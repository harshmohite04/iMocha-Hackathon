import { Component, inject, output, input } from '@angular/core';
import { TimerService } from '../../core/services/timer.service';
import { TabBarComponent } from '../../shared/components/tab-bar.component';
import { FileSystemService } from '../editor/editor.service';

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
    .header-actions .btn { padding: 2px 6px; font-size: 12px; }
  `],
})
export class WorkspaceHeaderComponent {
  fileSystem = inject(FileSystemService);
  timer = inject(TimerService);

  isDarkTheme = input(true);
  themeToggle = output<void>();
}
