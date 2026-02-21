import { Component, inject, signal, OnInit } from '@angular/core';
import { AssessmentService } from '../../core/services/assessment.service';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-problem-panel',
  standalone: true,
  template: `
    <div class="problem-panel h-100 d-flex flex-column">
      <div class="problem-header d-flex align-items-center px-2 py-1">
        <i class="bi bi-book me-1"></i>
        <small class="fw-bold text-uppercase">Problem</small>
      </div>
      <div class="problem-body flex-grow-1 overflow-auto p-3">
        @if (assessment.currentProblem(); as problem) {
          <div class="rendered-markdown" [innerHTML]="renderedDescription()"></div>
        } @else {
          <div class="text-center text-muted py-4">
            <i class="bi bi-journal-text" style="font-size: 2rem;"></i>
            <p class="mt-2">Select a problem to begin</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .problem-panel { background: #1e1e1e; color: #d4d4d4; }
    .problem-header {
      background: #2d2d2d;
      font-size: 11px;
      border-bottom: 1px solid #333;
      min-height: 32px;
      flex-shrink: 0;
      color: #bbb;
    }
    .problem-body { font-size: 14px; line-height: 1.6; }
    :host ::ng-deep .rendered-markdown {
      h1 { font-size: 1.5rem; color: #fff; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
      h2 { font-size: 1.2rem; color: #e0e0e0; margin-top: 1.5rem; }
      h3 { font-size: 1.1rem; color: #ccc; }
      code { background: #333; padding: 2px 6px; border-radius: 3px; color: #ce9178; font-size: 13px; }
      pre { background: #252526; padding: 12px; border-radius: 6px; overflow-x: auto; }
      pre code { background: none; padding: 0; }
      ul, ol { padding-left: 1.5rem; }
      li { margin-bottom: 0.3rem; }
      strong { color: #fff; }
    }
  `],
})
export class ProblemPanelComponent {
  assessment = inject(AssessmentService);
  private sanitizer = inject(DomSanitizer);

  renderedDescription = signal<SafeHtml>('');

  constructor() {
    // Using a simple interval check since we need marked to process the description
    const checkAndRender = () => {
      const problem = this.assessment.currentProblem();
      if (problem) {
        const html = marked.parse(problem.description) as string;
        this.renderedDescription.set(this.sanitizer.bypassSecurityTrustHtml(html));
      }
    };

    // We'll call this reactively via effect-like pattern
    setTimeout(() => checkAndRender(), 100);
    // Re-check whenever problem changes
    setInterval(() => checkAndRender(), 1000);
  }
}
