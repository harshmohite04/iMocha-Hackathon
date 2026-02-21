import { Component, inject, signal, HostListener } from '@angular/core';
import { AssessmentService } from './core/services/assessment.service';
import { WebContainerService } from './core/services/webcontainer.service';
import { CompilationService } from './core/services/compilation.service';
import { LoadingOverlayComponent } from './shared/components/loading-overlay.component';
import { CodeEditorComponent } from './features/editor/code-editor.component';
import { FileTreeComponent } from './features/file-explorer/file-tree.component';
import { PreviewPanelComponent } from './features/preview/preview-panel.component';
import { ConsoleOutputComponent } from './features/preview/console-output.component';
import { TestResultsPanelComponent } from './features/test-results/test-results-panel.component';
import { ProblemPanelComponent } from './features/problem/problem-panel.component';
import { WorkspaceHeaderComponent } from './features/workspace/workspace-header.component';
import { ToolbarComponent } from './features/toolbar/toolbar.component';
import { AppConsoleComponent } from './features/preview/app-console.component';
import { AppConsoleService } from './core/services/app-console.service';
import { PROBLEMS } from './core/constants/problems';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    CodeEditorComponent,
    FileTreeComponent,
    PreviewPanelComponent,
    ConsoleOutputComponent,
    TestResultsPanelComponent,
    ProblemPanelComponent,
    WorkspaceHeaderComponent,
    ToolbarComponent,
    AppConsoleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  assessment = inject(AssessmentService);
  webContainer = inject(WebContainerService);
  compilation = inject(CompilationService);
  appConsole = inject(AppConsoleService);

  problems = PROBLEMS;
  Math = Math;

  isDarkTheme = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  // Layout state
  sidebarTab = signal<'problem' | 'files'>('problem');
  bottomTab = signal<'terminal' | 'console' | 'preview' | 'tests' | 'errors'>('terminal');
  sidebarWidth = signal(300);
  bottomPanelHeight = signal(250);

  // Drag state
  private dragging: 'sidebar' | 'bottom' | null = null;
  private dragStartPos = 0;
  private dragStartSize = 0;

  async startAssessment(problemId: string): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.assessment.initialize(problemId);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to initialize assessment');
      console.error('Assessment init error:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onRunTests(): Promise<void> {
    this.bottomTab.set('tests');
    await this.assessment.runTests();
  }

  async onSubmit(): Promise<void> {
    if (confirm('Are you sure you want to submit? This action cannot be undone.')) {
      await this.assessment.submit();
    }
  }

  async onReset(): Promise<void> {
    if (confirm('Reset all code to the original starter files? Your changes will be lost.')) {
      await this.assessment.reset();
    }
  }

  toggleTheme(): void {
    this.isDarkTheme.update((v) => !v);
  }

  toggleBottomPanel(): void {
    if (this.bottomPanelHeight() > 50) {
      this.bottomPanelHeight.set(36); // collapsed to just tabs
    } else {
      this.bottomPanelHeight.set(250);
    }
  }

  backToProblems(): void {
    this.assessment.isSubmitted.set(false);
    this.assessment.currentProblem.set(null);
    this.webContainer.teardown();
  }

  // --- Resize handlers ---
  startSidebarDrag(event: MouseEvent): void {
    event.preventDefault();
    this.dragging = 'sidebar';
    this.dragStartPos = event.clientX;
    this.dragStartSize = this.sidebarWidth();
  }

  startBottomDrag(event: MouseEvent): void {
    event.preventDefault();
    this.dragging = 'bottom';
    this.dragStartPos = event.clientY;
    this.dragStartSize = this.bottomPanelHeight();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.dragging) return;
    if (this.dragging === 'sidebar') {
      const delta = event.clientX - this.dragStartPos;
      this.sidebarWidth.set(Math.max(180, Math.min(600, this.dragStartSize + delta)));
    } else {
      const delta = this.dragStartPos - event.clientY;
      this.bottomPanelHeight.set(Math.max(36, Math.min(500, this.dragStartSize + delta)));
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.dragging = null;
  }
}
