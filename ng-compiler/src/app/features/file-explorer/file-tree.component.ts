import { Component, inject, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FileSystemService } from '../editor/editor.service';
import { VirtualFile } from '../../core/models/virtual-file.model';
import { getFileIcon } from '../../shared/utils/file-language';

interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
  file?: VirtualFile;
}

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="file-tree">
      <div class="tree-header px-2 py-1 d-flex align-items-center">
        <i class="bi bi-folder2-open me-1"></i>
        <small class="fw-bold text-uppercase">Explorer</small>
      </div>
      @for (node of tree(); track node.path) {
        <ng-container *ngTemplateOutlet="treeNodeTpl; context: { $implicit: node, depth: 0 }" />
      }
    </div>

    <ng-template #treeNodeTpl let-node let-depth="depth">
      @if (node.isDir) {
        <div class="tree-item dir" [style.padding-left.px]="depth * 16 + 8"
             (click)="toggleDir(node.path)">
          <i [class]="isExpanded(node.path) ? 'bi bi-chevron-down' : 'bi bi-chevron-right'" class="me-1"></i>
          <i class="bi bi-folder-fill me-1 text-warning"></i>
          <span>{{ node.name }}</span>
        </div>
        @if (isExpanded(node.path)) {
          @for (child of node.children; track child.path) {
            <ng-container *ngTemplateOutlet="treeNodeTpl; context: { $implicit: child, depth: depth + 1 }" />
          }
        }
      } @else {
        <div class="tree-item file" [style.padding-left.px]="depth * 16 + 8"
             [class.active]="node.path === fileSystem.activeFilePath()"
             (click)="fileSystem.openFile(node.path)">
          <i [class]="getIcon(node.path)" class="me-1"></i>
          <span>{{ node.name }}</span>
          @if (node.file?.readOnly) {
            <i class="bi bi-lock-fill ms-1 text-muted" style="font-size: 10px;"></i>
          }
          @if (node.file?.dirty) {
            <span class="dirty-indicator ms-1"></span>
          }
        </div>
      }
    </ng-template>
  `,
  styles: [`
    .file-tree {
      background: #252526;
      color: #ccc;
      font-size: 13px;
      height: 100%;
      overflow-y: auto;
      user-select: none;
    }
    .tree-header {
      background: #2d2d2d;
      color: #bbb;
      font-size: 11px;
      border-bottom: 1px solid #333;
    }
    .tree-item {
      padding: 3px 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
    .tree-item:hover { background: #2a2d2e; }
    .tree-item.active { background: #37373d; color: #fff; }
    .tree-item i { font-size: 14px; flex-shrink: 0; }
    .dirty-indicator {
      width: 6px; height: 6px;
      background: #e8a317;
      border-radius: 50%;
      display: inline-block;
    }
  `],
})
export class FileTreeComponent {
  fileSystem = inject(FileSystemService);

  private expandedDirs = new Set<string>(['src', 'src/app']);

  tree = computed(() => this.buildTree(this.fileSystem.files()));

  private buildTree(files: VirtualFile[]): TreeNode[] {
    const root: TreeNode[] = [];
    const dirMap = new Map<string, TreeNode>();

    for (const file of files) {
      const parts = file.path.split('/');
      let currentChildren = root;

      for (let i = 0; i < parts.length - 1; i++) {
        const dirPath = parts.slice(0, i + 1).join('/');
        let dirNode = dirMap.get(dirPath);
        if (!dirNode) {
          dirNode = { name: parts[i], path: dirPath, isDir: true, children: [] };
          dirMap.set(dirPath, dirNode);
          currentChildren.push(dirNode);
        }
        currentChildren = dirNode.children;
      }

      currentChildren.push({
        name: parts[parts.length - 1],
        path: file.path,
        isDir: false,
        children: [],
        file,
      });
    }

    return root;
  }

  isExpanded(path: string): boolean {
    return this.expandedDirs.has(path);
  }

  toggleDir(path: string): void {
    if (this.expandedDirs.has(path)) {
      this.expandedDirs.delete(path);
    } else {
      this.expandedDirs.add(path);
    }
  }

  getIcon(path: string): string {
    return getFileIcon(path);
  }
}
