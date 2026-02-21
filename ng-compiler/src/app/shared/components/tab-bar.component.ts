import { Component, input, output, computed } from '@angular/core';
import { VirtualFile } from '../../core/models/virtual-file.model';
import { getFileIcon } from '../../shared/utils/file-language';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  template: `
    <div class="tab-bar d-flex align-items-center">
      @for (file of files(); track file.path) {
        <div class="tab-item d-flex align-items-center"
             [class.active]="file.path === activeFilePath()"
             (click)="tabClick.emit(file.path)">
          <i [class]="getIcon(file.path)" class="me-1"></i>
          <span class="tab-name">{{ getFileName(file.path) }}</span>
          @if (file.dirty) {
            <span class="dirty-dot ms-1"></span>
          }
          @if (!file.readOnly) {
            <button class="btn-close-tab ms-2" (click)="closeTab($event, file.path)"
                    title="Close tab">
              <i class="bi bi-x"></i>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tab-bar {
      background: #1e1e1e;
      border-bottom: 1px solid #333;
      overflow-x: auto;
      min-height: 36px;
    }
    .tab-item {
      padding: 6px 12px;
      cursor: pointer;
      color: #888;
      font-size: 13px;
      border-right: 1px solid #333;
      white-space: nowrap;
      user-select: none;
      transition: background 0.15s;
    }
    .tab-item:hover { background: #2a2a2a; color: #ccc; }
    .tab-item.active { background: #1e1e1e; color: #fff; border-bottom: 2px solid #007acc; }
    .tab-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
    .dirty-dot {
      width: 8px; height: 8px;
      background: #e8a317;
      border-radius: 50%;
      display: inline-block;
    }
    .btn-close-tab {
      background: none; border: none; color: #666;
      padding: 0 2px; font-size: 14px; line-height: 1; cursor: pointer;
    }
    .btn-close-tab:hover { color: #fff; }
    .tab-item i { font-size: 14px; }
  `],
})
export class TabBarComponent {
  files = input.required<VirtualFile[]>();
  activeFilePath = input.required<string>();
  tabClick = output<string>();
  tabClose = output<string>();

  getFileName(path: string): string {
    return path.split('/').pop() || path;
  }

  getIcon(path: string): string {
    return getFileIcon(path);
  }

  closeTab(event: Event, path: string): void {
    event.stopPropagation();
    this.tabClose.emit(path);
  }
}
