import { Component, inject, viewChild, ElementRef, effect } from '@angular/core';
import { WebContainerService } from '../../core/services/webcontainer.service';

@Component({
  selector: 'app-console-output',
  standalone: true,
  template: `
    <div class="console-panel d-flex flex-column h-100">
      <div class="console-header d-flex align-items-center justify-content-between px-2 py-1">
        <div class="d-flex align-items-center">
          <i class="bi bi-terminal me-1"></i>
          <small class="fw-bold text-uppercase">Console</small>
        </div>
        <button class="btn btn-sm btn-outline-secondary" (click)="clear()" title="Clear console">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div class="console-body flex-grow-1" #consoleBody>
        <pre class="mb-0">{{ webContainer.serverOutput() }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .console-panel { background: #1e1e1e; color: #ccc; }
    .console-header {
      background: #2d2d2d;
      font-size: 11px;
      border-bottom: 1px solid #333;
      min-height: 32px;
      flex-shrink: 0;
    }
    .console-body {
      overflow-y: auto;
      font-family: 'Cascadia Code', 'Fira Code', monospace;
      font-size: 12px;
      padding: 8px;
    }
    pre { white-space: pre-wrap; word-break: break-all; color: #d4d4d4; }
  `],
})
export class ConsoleOutputComponent {
  webContainer = inject(WebContainerService);
  private consoleBody = viewChild<ElementRef>('consoleBody');

  constructor() {
    // Auto-scroll to bottom when output changes
    effect(() => {
      this.webContainer.serverOutput();
      setTimeout(() => {
        const el = this.consoleBody()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    });
  }

  clear(): void {
    this.webContainer.serverOutput.set('');
  }
}
