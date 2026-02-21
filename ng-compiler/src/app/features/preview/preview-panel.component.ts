import { Component, inject, computed } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WebContainerService } from '../../core/services/webcontainer.service';
import { CompilationService } from '../../core/services/compilation.service';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  template: `
    <div class="preview-panel h-100 d-flex flex-column">
      <div class="preview-header d-flex align-items-center justify-content-between px-2 py-1">
        <div class="d-flex align-items-center">
          <i class="bi bi-eye me-1"></i>
          <small class="fw-bold text-uppercase">Preview</small>
          @if (compilation.isCompiling()) {
            <span class="badge bg-warning text-dark ms-2">
              <span class="spinner-border spinner-border-sm me-1" style="width: 10px; height: 10px;"></span>
              Compiling...
            </span>
          }
          @if (webContainer.previewUrl()) {
            <span class="badge bg-success ms-2">Live</span>
          }
        </div>
        <button class="btn btn-sm btn-outline-secondary" (click)="refreshPreview()"
                title="Refresh preview">
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>

      @if (compilation.hasErrors()) {
        <div class="error-overlay p-3">
          <div class="alert alert-danger mb-0">
            <h6 class="alert-heading">
              <i class="bi bi-exclamation-triangle me-1"></i>
              Compilation Errors
            </h6>
            @for (error of compilation.errors(); track $index) {
              <div class="error-item">
                <code class="text-danger">{{ error.file }}:{{ error.line }}:{{ error.column }}</code>
                <span class="ms-2">{{ error.message }}</span>
              </div>
            }
          </div>
        </div>
      }

      <div class="preview-frame flex-grow-1">
        @if (safeUrl()) {
          <iframe [src]="safeUrl()"
                  class="w-100 h-100 border-0"
                  #previewIframe></iframe>
        } @else {
          <div class="d-flex align-items-center justify-content-center h-100 text-muted">
            <div class="text-center">
              <i class="bi bi-display" style="font-size: 3rem;"></i>
              <p class="mt-2">Preview will appear here after the dev server starts</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .preview-panel { background: #fff; }
    .preview-header {
      background: #2d2d2d;
      color: #ccc;
      font-size: 11px;
      border-bottom: 1px solid #333;
      min-height: 32px;
    }
    .preview-frame { background: #fff; }
    .error-overlay {
      background: #1e1e1e;
      max-height: 200px;
      overflow-y: auto;
    }
    .error-item {
      font-size: 12px;
      padding: 2px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    iframe { background: #fff; }
  `],
})
export class PreviewPanelComponent {
  webContainer = inject(WebContainerService);
  compilation = inject(CompilationService);
  private sanitizer = inject(DomSanitizer);

  /** Trusted URL for the iframe — Angular blocks raw URLs in [src] */
  safeUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.webContainer.previewUrl();
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  refreshPreview(): void {
    const url = this.webContainer.previewUrl();
    if (url) {
      this.webContainer.previewUrl.set('');
      setTimeout(() => this.webContainer.previewUrl.set(url), 150);
    }
  }
}
