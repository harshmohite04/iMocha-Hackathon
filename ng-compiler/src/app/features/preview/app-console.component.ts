import { Component, inject, viewChild, ElementRef, effect } from '@angular/core';
import { AppConsoleService, ConsoleEntry } from '../../core/services/app-console.service';

@Component({
  selector: 'app-app-console',
  standalone: true,
  template: `
    <div class="app-console d-flex flex-column h-100">
      <div class="console-header d-flex align-items-center justify-content-between px-2 py-1">
        <div class="d-flex align-items-center">
          <i class="bi bi-journal-code me-1"></i>
          <small class="fw-bold text-uppercase">Console</small>
          @if (appConsole.count() > 0) {
            <span class="badge bg-secondary ms-2" style="font-size: 9px;">{{ appConsole.count() }}</span>
          }
          @if (appConsole.errorCount() > 0) {
            <span class="badge bg-danger ms-1" style="font-size: 9px;">{{ appConsole.errorCount() }} errors</span>
          }
        </div>
        <button class="btn btn-sm btn-outline-secondary" (click)="appConsole.clear()" title="Clear console">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div class="console-body flex-grow-1" #consoleBody>
        @if (appConsole.logs().length === 0) {
          <div class="text-center text-muted py-4">
            <i class="bi bi-terminal" style="font-size: 1.5rem;"></i>
            <p class="mt-2 mb-0" style="font-size: 12px;">
              Console output from your code will appear here.<br>
              Use <code>console.log()</code> in your Angular code to debug.
            </p>
          </div>
        }
        @for (entry of appConsole.logs(); track $index) {
          <div class="log-entry" [class]="'log-' + entry.method">
            <span class="log-badge">{{ entry.method }}</span>
            <span class="log-time">{{ formatTime(entry.timestamp) }}</span>
            <span class="log-text">{{ entry.args.join(' ') }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .app-console { background: #1e1e1e; color: #ccc; }
    .console-header {
      background: #2d2d2d;
      font-size: 11px;
      border-bottom: 1px solid #333;
      min-height: 32px;
      flex-shrink: 0;
    }
    .console-body {
      overflow-y: auto;
      font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
      font-size: 12px;
      padding: 4px;
    }
    .log-entry {
      padding: 3px 8px;
      border-bottom: 1px solid #2a2a2a;
      display: flex;
      align-items: baseline;
      gap: 8px;
      line-height: 1.5;
    }
    .log-entry:hover { background: rgba(255,255,255,0.03); }
    .log-badge {
      font-size: 9px;
      text-transform: uppercase;
      padding: 1px 4px;
      border-radius: 3px;
      flex-shrink: 0;
      min-width: 36px;
      text-align: center;
    }
    .log-time {
      color: #666;
      font-size: 10px;
      flex-shrink: 0;
    }
    .log-text {
      white-space: pre-wrap;
      word-break: break-all;
    }
    .log-log .log-badge { background: #333; color: #d4d4d4; }
    .log-log .log-text { color: #d4d4d4; }
    .log-info .log-badge { background: #1a3a5c; color: #75beff; }
    .log-info .log-text { color: #75beff; }
    .log-warn .log-badge { background: #5c4a00; color: #cca700; }
    .log-warn .log-text { color: #cca700; }
    .log-error .log-badge { background: #5c1a1a; color: #f48771; }
    .log-error .log-text { color: #f48771; }
    .log-debug .log-badge { background: #2d2d2d; color: #888; }
    .log-debug .log-text { color: #888; }
    code { background: #333; padding: 1px 4px; border-radius: 2px; color: #ce9178; }
  `],
})
export class AppConsoleComponent {
  appConsole = inject(AppConsoleService);
  private consoleBody = viewChild<ElementRef>('consoleBody');

  constructor() {
    effect(() => {
      this.appConsole.logs();
      setTimeout(() => {
        const el = this.consoleBody()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    });
  }

  formatTime(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
