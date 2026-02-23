import { Component, inject, signal, computed } from '@angular/core';
import { TestRunnerService } from '../../core/services/test-runner.service';
import { TestType } from '../../core/models/problem.model';

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
          <!-- Score display -->
          <div class="score-display mb-3 p-3 rounded text-center"
               [class.score-perfect]="suite.failed === 0 && suite.total > 0"
               [class.score-partial]="suite.failed > 0 && suite.passed > 0"
               [class.score-zero]="suite.passed === 0 && suite.total > 0">
            <h2 class="mb-0 text-white">{{ suite.score }} pts</h2>
            <small class="text-white-50">
              {{ suite.passed }}/{{ suite.total }} tests passed
            </small>
          </div>

          <!-- Progress bar -->
          <div class="progress mb-3" style="height: 8px;">
            <div class="progress-bar bg-success"
                 [style.width.%]="suite.total > 0 ? (suite.passed / suite.total) * 100 : 0"></div>
            <div class="progress-bar bg-danger"
                 [style.width.%]="suite.total > 0 ? (suite.failed / suite.total) * 100 : 0"></div>
          </div>

          <!-- Filter buttons -->
          <div class="filter-bar d-flex gap-1 mb-3">
            <button class="filter-btn" [class.active]="activeFilter() === 'all'"
                    (click)="activeFilter.set('all')">
              All <span class="badge bg-secondary ms-1">{{ suite.results.length }}</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'positive'"
                    (click)="activeFilter.set('positive')">
              Positive <span class="badge bg-info ms-1">{{ countByType('positive') }}</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'negative'"
                    (click)="activeFilter.set('negative')">
              Negative <span class="badge bg-warning ms-1">{{ countByType('negative') }}</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'edge'"
                    (click)="activeFilter.set('edge')">
              Edge <span class="badge bg-purple ms-1">{{ countByType('edge') }}</span>
            </button>
          </div>

          <!-- Test list -->
          @for (result of filteredResults(); track $index) {
            <div class="test-item d-flex align-items-start p-2 mb-1 rounded"
                 [class.test-passed]="result.status === 'passed'"
                 [class.test-failed]="result.status === 'failed'">
              <i [class]="result.status === 'passed' ? 'bi bi-check-circle-fill text-success' : 'bi bi-x-circle-fill text-danger'"
                 class="me-2 mt-1"></i>
              <div class="flex-grow-1">
                <div class="test-name d-flex align-items-center gap-2 flex-wrap">
                  <span>{{ result.name }}</span>
                  <span class="difficulty-badge"
                        [class.difficulty-easy]="result.difficulty === 'easy'"
                        [class.difficulty-medium]="result.difficulty === 'medium'"
                        [class.difficulty-hard]="result.difficulty === 'hard'">
                    {{ result.difficulty }}
                  </span>
                  <span class="type-tag"
                        [class.type-positive]="result.testType === 'positive'"
                        [class.type-negative]="result.testType === 'negative'"
                        [class.type-edge]="result.testType === 'edge'">
                    {{ result.testType }}
                  </span>
                </div>
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
    .score-perfect { background: #1b5e20 !important; }
    .score-partial { background: #e65100 !important; }
    .score-zero { background: #b71c1c !important; }
    .test-item { background: #252526; font-size: 13px; }
    .test-item.test-passed { border-left: 3px solid #28a745; }
    .test-item.test-failed { border-left: 3px solid #dc3545; }
    .test-name { color: #e0e0e0; }
    code { font-size: 11px; }

    /* Difficulty badges */
    .difficulty-badge {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .difficulty-easy { background: #1b5e20; color: #a5d6a7; }
    .difficulty-medium { background: #e65100; color: #ffcc80; }
    .difficulty-hard { background: #b71c1c; color: #ef9a9a; }

    /* Type tags */
    .type-tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 8px;
      font-weight: 500;
      text-transform: lowercase;
      border: 1px solid;
    }
    .type-positive { border-color: #4fc3f7; color: #4fc3f7; }
    .type-negative { border-color: #ffb74d; color: #ffb74d; }
    .type-edge { border-color: #ce93d8; color: #ce93d8; }

    /* Filter buttons */
    .filter-bar { flex-wrap: wrap; }
    .filter-btn {
      background: #333;
      border: 1px solid #444;
      color: #aaa;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .filter-btn:hover { background: #444; color: #eee; }
    .filter-btn.active { background: #0d6efd; border-color: #0d6efd; color: #fff; }
    .badge.bg-purple { background: #7b1fa2 !important; }
  `],
})
export class TestResultsPanelComponent {
  testRunner = inject(TestRunnerService);
  activeFilter = signal<'all' | TestType>('all');

  filteredResults = computed(() => {
    const suite = this.testRunner.testSuite();
    if (!suite) return [];
    const filter = this.activeFilter();
    if (filter === 'all') return suite.results;
    return suite.results.filter(r => r.testType === filter);
  });

  countByType(type: TestType): number {
    const suite = this.testRunner.testSuite();
    if (!suite) return 0;
    return suite.results.filter(r => r.testType === type).length;
  }
}
