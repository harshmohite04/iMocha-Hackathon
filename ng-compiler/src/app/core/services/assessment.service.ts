import { Injectable, signal, inject } from '@angular/core';
import { Problem, TestSuite } from '../models/problem.model';
import { PROBLEMS, PROBLEM_TEST_SPECS } from '../constants/problems';
import { DEFAULT_ANGULAR_PROJECT } from '../constants/default-angular-project';
import { WebContainerService, BootStage } from './webcontainer.service';
import { FileSystemService } from '../../features/editor/editor.service';
import { TestRunnerService } from './test-runner.service';
import { TimerService } from './timer.service';
import { FileSystemTree } from '@webcontainer/api';

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private webContainer = inject(WebContainerService);
  private fileSystem = inject(FileSystemService);
  private testRunner = inject(TestRunnerService);
  private timer = inject(TimerService);

  readonly currentProblem = signal<Problem | null>(null);
  readonly isSubmitted = signal(false);
  readonly finalScore = signal<TestSuite | null>(null);
  readonly problems = signal<Problem[]>(PROBLEMS);

  async initialize(problemId: string): Promise<void> {
    const problem = PROBLEMS.find((p) => p.id === problemId);
    if (!problem) throw new Error(`Problem not found: ${problemId}`);

    this.currentProblem.set(problem);
    this.isSubmitted.set(false);
    this.finalScore.set(null);
    this.testRunner.reset();

    // Connect FileSystemService to WebContainerService
    this.fileSystem.setWebContainerService(this.webContainer);

    // Boot WebContainer
    await this.webContainer.boot();

    // Build the file system tree: default project + starter files + test specs
    const tree = this.buildFileSystemTree(problem);
    await this.webContainer.mountFiles(tree);

    // Install dependencies
    const success = await this.webContainer.installDependencies();
    if (!success) throw new Error('npm install failed');

    // Start dev server
    await this.webContainer.startDevServer();

    // Load files into editor
    this.fileSystem.loadFiles(problem.starterFiles);

    // Start timer
    this.timer.start(problem.timeLimit, () => this.submit());
  }

  private buildFileSystemTree(problem: Problem): FileSystemTree {
    // Start with the default Angular project
    const tree: FileSystemTree = { ...DEFAULT_ANGULAR_PROJECT };

    // Override with starter files
    for (const file of problem.starterFiles) {
      this.setFileInTree(tree, file.path, file.content);
    }

    // Mount test specs
    const specs = PROBLEM_TEST_SPECS[problem.id];
    if (specs) {
      this.setFileInTree(tree, 'test-specs.json', JSON.stringify(specs));
    }

    return tree;
  }

  private setFileInTree(tree: FileSystemTree, filePath: string, content: string): void {
    const parts = filePath.split('/');
    let current: FileSystemTree = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = { directory: {} };
      }
      const node = current[part];
      if ('directory' in node) {
        current = node.directory;
      }
    }

    const fileName = parts[parts.length - 1];
    current[fileName] = { file: { contents: content } };
  }

  async runTests(): Promise<TestSuite> {
    const problem = this.currentProblem();
    if (!problem) throw new Error('No problem loaded');

    // Flush pending file writes
    await this.fileSystem.flushAll();

    // Write current file contents to container (in case of edits)
    for (const file of this.fileSystem.files()) {
      await this.webContainer.writeFile(file.path, file.content);
    }

    return this.testRunner.runTests(problem.maxScore);
  }

  async submit(): Promise<TestSuite> {
    this.timer.stop();
    const suite = await this.runTests();
    this.isSubmitted.set(true);
    this.finalScore.set(suite);
    return suite;
  }

  async reset(): Promise<void> {
    const problem = this.currentProblem();
    if (!problem) return;

    this.isSubmitted.set(false);
    this.finalScore.set(null);
    this.testRunner.reset();

    // Restore starter files
    for (const file of problem.starterFiles) {
      await this.webContainer.writeFile(file.path, file.content);
    }
    this.fileSystem.loadFiles(problem.starterFiles);

    // Restart timer
    this.timer.start(problem.timeLimit, () => this.submit());
  }
}
