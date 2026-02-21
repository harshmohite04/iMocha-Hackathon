import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CompilationError } from '../models/compilation-error.model';
import { WebContainerService } from './webcontainer.service';

@Injectable({ providedIn: 'root' })
export class CompilationService {
  private webContainer = inject(WebContainerService);

  readonly errors = signal<CompilationError[]>([]);
  readonly isCompiling = signal(false);
  readonly hasErrors = computed(() => this.errors().length > 0);

  private lastOutput = '';

  constructor() {
    // Watch server output for compilation errors
    effect(() => {
      const output = this.webContainer.serverOutput();
      if (output === this.lastOutput) return;

      const newContent = output.slice(this.lastOutput.length);
      this.lastOutput = output;

      this.parseOutput(newContent);
    });
  }

  private parseOutput(chunk: string): void {
    // Detect compilation start (Vite + Angular CLI patterns)
    if (chunk.includes('Compiling') || chunk.includes('Building') || chunk.includes('hmr update') || chunk.includes('page reload')) {
      this.isCompiling.set(true);
    }

    // Detect successful compilation
    if (chunk.includes('Compiled successfully') || chunk.includes('Build at:') ||
        chunk.includes('ready in') || chunk.includes('page reload') || chunk.includes('hmr update')) {
      this.isCompiling.set(false);
      this.errors.set([]);
      return;
    }

    // Detect compilation failure
    if (chunk.includes('Failed to compile') || chunk.includes('Build failed') || chunk.includes('error during build')) {
      this.isCompiling.set(false);
    }

    // Parse TypeScript errors: src/app/file.ts:10:5 - error TS2339: ...
    const tsErrorRegex = /([^\s]+\.ts):(\d+):(\d+)\s*-?\s*(?:error\s+\w+:\s*)?(.+)/g;
    // Parse Vite/esbuild errors: ERROR: ... (file.ts:10:5)
    const viteErrorRegex = /ERROR[:\s]+(.+?)(?:\s+\(([^)]+\.ts):(\d+):(\d+)\))?$/gm;

    let match;
    const newErrors: CompilationError[] = [];

    while ((match = tsErrorRegex.exec(chunk)) !== null) {
      if (match[4] && match[4].includes('error')) {
        newErrors.push({
          file: match[1],
          line: parseInt(match[2], 10),
          column: parseInt(match[3], 10),
          message: match[4].trim(),
        });
      }
    }

    while ((match = viteErrorRegex.exec(chunk)) !== null) {
      newErrors.push({
        file: match[2] || 'unknown',
        line: match[3] ? parseInt(match[3], 10) : 0,
        column: match[4] ? parseInt(match[4], 10) : 0,
        message: match[1].trim(),
      });
    }

    if (newErrors.length > 0) {
      this.errors.set(newErrors);
    }
  }

  clearErrors(): void {
    this.errors.set([]);
  }
}
