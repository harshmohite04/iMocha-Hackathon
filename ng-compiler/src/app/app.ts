import { Component, inject, signal } from '@angular/core';
import { AssessmentService } from './core/services/assessment.service';
import { WebContainerService } from './core/services/webcontainer.service';
import { SplitPaneComponent } from './shared/components/split-pane.component';
import { LoadingOverlayComponent } from './shared/components/loading-overlay.component';
import { CodeEditorComponent } from './features/editor/code-editor.component';
import { FileTreeComponent } from './features/file-explorer/file-tree.component';
import { PreviewPanelComponent } from './features/preview/preview-panel.component';
import { ConsoleOutputComponent } from './features/preview/console-output.component';
import { TestResultsPanelComponent } from './features/test-results/test-results-panel.component';
import { ProblemPanelComponent } from './features/problem/problem-panel.component';
import { WorkspaceHeaderComponent } from './features/workspace/workspace-header.component';
import { ToolbarComponent } from './features/toolbar/toolbar.component';
import { PROBLEMS } from './core/constants/problems';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SplitPaneComponent,
    LoadingOverlayComponent,
    CodeEditorComponent,
    FileTreeComponent,
    PreviewPanelComponent,
    ConsoleOutputComponent,
    TestResultsPanelComponent,
    ProblemPanelComponent,
    WorkspaceHeaderComponent,
    ToolbarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  assessment = inject(AssessmentService);
  webContainer = inject(WebContainerService);

  problems = PROBLEMS;
  Math = Math;

  isDarkTheme = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

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

  backToProblems(): void {
    this.assessment.isSubmitted.set(false);
    this.assessment.currentProblem.set(null);
    this.webContainer.teardown();
  }
}
