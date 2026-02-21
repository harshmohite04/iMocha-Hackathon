import { Component, inject, output, input, computed } from '@angular/core';
import { TimerService } from '../../core/services/timer.service';
import { TabBarComponent } from '../../shared/components/tab-bar.component';
import { FileSystemService } from '../editor/editor.service';
import { WebContainerService } from '../../core/services/webcontainer.service';

@Component({
  selector: 'app-workspace-header',
  standalone: true,
  imports: [TabBarComponent],
  template: `
    <div class="workspace-header d-flex align-items-center">
      <div class="flex-grow-1">
        <app-tab-bar
          [files]="fileSystem.openFiles()"
          [activeFilePath]="fileSystem.activeFilePath()"
          (tabClick)="fileSystem.openFile($event)"
          (tabClose)="fileSystem.closeTab($event)" />
      </div>
      <div class="header-actions d-flex align-items-center gap-2 px-2">
        <!-- Environment status -->
        @if (statusInfo(); as info) {
          @if (!info.ready) {
            <div class="env-status d-flex align-items-center">
              <div class="spinner-border spinner-border-sm me-1" style="width: 14px; height: 14px;"></div>
              <small>{{ info.label }}</small>
            </div>
          } @else {
            <div class="env-status env-ready d-flex align-items-center">
              <i class="bi bi-check-circle-fill me-1"></i>
              <small>Ready</small>
            </div>
          }
        }

        <!-- Timer -->
        <div class="timer-display d-flex align-items-center"
             [class.text-danger]="timer.remainingSeconds() < 120"
             [class.text-warning]="timer.remainingSeconds() >= 120 && timer.remainingSeconds() < 300">
          <i class="bi bi-clock me-1"></i>
          <span class="font-monospace fw-bold">{{ timer.formattedTime() }}</span>
        </div>

        <!-- Theme toggle -->
        <button class="btn btn-sm btn-outline-secondary" (click)="themeToggle.emit()"
                title="Toggle theme">
          <i [class]="isDarkTheme() ? 'bi bi-sun' : 'bi bi-moon'"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .workspace-header {
      background: #1e1e1e;
      border-bottom: 1px solid #333;
      min-height: 36px;
    }
    .timer-display {
      font-size: 13px;
      color: #4ec9b0;
      padding: 2px 8px;
      background: #252526;
      border-radius: 4px;
    }
    .env-status {
      font-size: 11px;
      color: #cca700;
      padding: 2px 8px;
      background: #252526;
      border-radius: 4px;
    }
    .env-ready { color: #89d185; }
    .header-actions .btn { padding: 2px 6px; font-size: 12px; }
  `],
})
export class WorkspaceHeaderComponent {
  fileSystem = inject(FileSystemService);
  timer = inject(TimerService);
  webContainer = inject(WebContainerService);

  isDarkTheme = input(true);
  themeToggle = output<void>();

  statusInfo = computed(() => {
    const stage = this.webContainer.stage();
    switch (stage) {
      case 'installing': return { label: 'Installing deps...', ready: false };
      case 'starting': return { label: 'Starting server...', ready: false };
      case 'ready': return { label: 'Ready', ready: true };
      case 'error': return { label: 'Error', ready: false };
      default: return null;
    }
  });
}
