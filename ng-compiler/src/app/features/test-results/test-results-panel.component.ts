import { Component, inject } from '@angular/core';
import { TestRunnerService } from '../../core/services/test-runner.service';

@Component({
  selector: 'app-test-results-panel',
  standalone: true,
  template: `
    <div class="test-results-panel h-100 d-flex flex-column">
      <div class="results-header d-flex align-items-center px-2 py-1">
        <i class="bi bi-check2-square me-1"></i>
        <small class="fw-bold text-uppercase">Test Results</small>
        @if (testRunner.isRunning()) {
          <span class="spinner-border spinner-border-sm ms-2" style="width: 12px; height: 12px;"></span>
        }
      </div>

      <div class="results-body flex-grow-1 overflow-auto p-2">
        @if (testRunner.testSuite(); as suite) {
          <div class="score-display mb-3 p-3 rounded text-center"
               [class.bg-success]="suite.failed === 0"
               [class.bg-danger]="suite.failed > 0 && suite.passed === 0"
               [class.bg-warning]="suite.failed > 0 && suite.passed > 0">
            <h2 class="mb-0 text-white">{{ suite.score }} pts</h2>
            <small class="text-white-50">
              {{ suite.passed }}/{{ suite.total }} tests passed
            </small>
          </div>

          <div class="progress mb-3" style="height: 8px;">
            <div class="progress-bar bg-success"
                 [style.width.%]="suite.total > 0 ? (suite.passed / suite.total) * 100 : 0"></div>
            <div class="progress-bar bg-danger"
                 [style.width.%]="suite.total > 0 ? (suite.failed / suite.total) * 100 : 0"></div>
          </div>

          @for (result of suite.results; track $index) {
            <div class="test-item d-flex align-items-start p-2 mb-1 rounded"
                 [class.test-passed]="result.status === 'passed'"
                 [class.test-failed]="result.status === 'failed'">
              <i [class]="result.status === 'passed' ? 'bi bi-check-circle-fill text-success' : 'bi bi-x-circle-fill text-danger'"
                 class="me-2 mt-1"></i>
              <div class="flex-grow-1">
                <div class="test-name">{{ result.name }}</div>
                @if (result.errorMessage) {
                  <small class="text-danger d-block mt-1">
                    <code>{{ result.errorMessage }}</code>
                  </small>
                }
                <small class="text-muted">{{ result.duration }}ms</small>
              </div>
            </div>
          }
        } @else if (!testRunner.isRunning()) {
          <div class="text-center text-muted py-4">
            <i class="bi bi-play-circle" style="font-size: 2rem;"></i>
            <p class="mt-2 mb-0">Click "Run Tests" to execute the test suite</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .test-results-panel { background: #1e1e1e; color: #ccc; }
    .results-header {
      background: #2d2d2d;
      font-size: 11px;
      border-bottom: 1px solid #333;
      min-height: 32px;
      flex-shrink: 0;
      color: #bbb;
    }
    .results-body { font-size: 13px; }
    .score-display { background: #333; }
    .test-item { background: #252526; font-size: 13px; }
    .test-item.test-passed { border-left: 3px solid #28a745; }
    .test-item.test-failed { border-left: 3px solid #dc3545; }
    .test-name { color: #e0e0e0; }
    code { font-size: 11px; }
  `],
})
export class TestResultsPanelComponent {
  testRunner = inject(TestRunnerService);
}
