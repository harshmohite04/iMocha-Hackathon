import { Injectable, signal, inject } from '@angular/core';
import { WebContainerService } from './webcontainer.service';
import { TestSuite, TestResult } from '../models/problem.model';

@Injectable({ providedIn: 'root' })
export class TestRunnerService {
  private webContainer = inject(WebContainerService);

  readonly isRunning = signal(false);
  readonly testSuite = signal<TestSuite | null>(null);
  readonly testOutput = signal('');

  async runTests(maxScore: number): Promise<TestSuite> {
    this.isRunning.set(true);
    this.testOutput.set('');

    try {
      const { output, exitCode } = await this.webContainer.spawn('node', ['run-tests.js']);
      this.testOutput.set(output);

      // Parse test results from output
      const startMarker = '__TEST_RESULTS_START__';
      const endMarker = '__TEST_RESULTS_END__';
      const startIdx = output.indexOf(startMarker);
      const endIdx = output.indexOf(endMarker);

      if (startIdx === -1 || endIdx === -1) {
        const errorSuite: TestSuite = {
          total: 0,
          passed: 0,
          failed: 0,
          score: 0,
          results: [],
        };
        this.testSuite.set(errorSuite);
        return errorSuite;
      }

      const jsonStr = output.substring(startIdx + startMarker.length, endIdx).trim();
      const raw = JSON.parse(jsonStr);

      const suite: TestSuite = {
        total: raw.total,
        passed: raw.passed,
        failed: raw.failed,
        score: raw.total > 0 ? Math.round((raw.passed / raw.total) * maxScore) : 0,
        results: raw.results as TestResult[],
      };

      this.testSuite.set(suite);
      return suite;
    } catch (err) {
      const errorSuite: TestSuite = {
        total: 0,
        passed: 0,
        failed: 0,
        score: 0,
        results: [],
      };
      this.testSuite.set(errorSuite);
      return errorSuite;
    } finally {
      this.isRunning.set(false);
    }
  }

  reset(): void {
    this.testSuite.set(null);
    this.testOutput.set('');
  }
}
