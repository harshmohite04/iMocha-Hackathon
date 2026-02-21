import { FileSystemTree } from '@webcontainer/api';

export const DEFAULT_ANGULAR_PROJECT: FileSystemTree = {
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'candidate-app',
        version: '0.0.0',
        private: true,
        scripts: {
          start: 'npx vite --host 0.0.0.0 --port 3000',
          test: 'node run-tests.js',
        },
        dependencies: {
          '@angular/common': '19.0.0',
          '@angular/compiler': '19.0.0',
          '@angular/core': '19.0.0',
          '@angular/forms': '19.0.0',
          '@angular/platform-browser': '19.0.0',
          '@angular/platform-browser-dynamic': '19.0.0',
          'rxjs': '7.8.1',
          'tslib': '2.8.1',
          'zone.js': '0.15.0',
        },
        devDependencies: {
          'vite': '5.4.11',
        },
      }, null, 2),
    },
  },
  'vite.config.js': {
    file: {
      contents: `import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: { outDir: '../dist' },
  esbuild: {
    target: 'es2022',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        useDefineForClassFields: false,
      }
    }
  },
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/common',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/forms',
      'rxjs',
      'zone.js',
    ],
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          useDefineForClassFields: false,
        }
      }
    }
  },
  server: {
    hmr: true,
    watch: { usePolling: true, interval: 500 },
  },
});
`,
    },
  },
  'tsconfig.json': {
    file: {
      contents: JSON.stringify({
        compilerOptions: {
          strict: true,
          skipLibCheck: true,
          experimentalDecorators: true,
          useDefineForClassFields: false,
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          isolatedModules: true,
        },
      }, null, 2),
    },
  },
  src: {
    directory: {
      'main.ts': {
        file: {
          contents: `import 'zone.js';
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch(err => console.error(err));
`,
        },
      },
      'styles.css': {
        file: {
          contents: `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 16px; }
`,
        },
      },
      'index.html': {
        file: {
          contents: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Candidate App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <app-root></app-root>
  <script type="module" src="/main.ts"></script>
</body>
</html>
`,
        },
      },
      app: {
        directory: {
          'app.component.ts': {
            file: {
              contents: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: \`<h1>Hello, Angular!</h1>\`,
})
export class AppComponent {
  title = 'candidate-app';
}
`,
            },
          },
        },
      },
    },
  },
  'run-tests.js': {
    file: {
      contents: `const fs = require('fs');
const path = require('path');

const suites = [];
let currentSuite = null;

globalThis.describe = function(name, fn) {
  currentSuite = { name, specs: [], beforeEach: null };
  suites.push(currentSuite);
  fn();
  currentSuite = null;
};

globalThis.it = function(name, fn) {
  if (currentSuite) currentSuite.specs.push({ name, fn });
};

globalThis.expect = function(actual) {
  return {
    toBe(expected) { if (actual !== expected) throw new Error('Expected ' + JSON.stringify(actual) + ' to be ' + JSON.stringify(expected)); },
    toEqual(expected) { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Expected ' + JSON.stringify(actual) + ' to equal ' + JSON.stringify(expected)); },
    toBeTruthy() { if (!actual) throw new Error('Expected ' + JSON.stringify(actual) + ' to be truthy'); },
    toBeFalsy() { if (actual) throw new Error('Expected ' + JSON.stringify(actual) + ' to be falsy'); },
    toContain(expected) {
      if (typeof actual === 'string') { if (!actual.includes(expected)) throw new Error('Expected string to contain "' + expected + '"'); }
      else if (Array.isArray(actual)) { if (!actual.includes(expected)) throw new Error('Expected array to contain ' + JSON.stringify(expected)); }
    },
    toBeGreaterThan(expected) { if (actual <= expected) throw new Error('Expected ' + actual + ' > ' + expected); },
    toBeLessThan(expected) { if (actual >= expected) throw new Error('Expected ' + actual + ' < ' + expected); },
    toBeDefined() { if (actual === undefined) throw new Error('Expected value to be defined'); },
    toBeUndefined() { if (actual !== undefined) throw new Error('Expected undefined but got ' + JSON.stringify(actual)); },
    toBeNull() { if (actual !== null) throw new Error('Expected null but got ' + JSON.stringify(actual)); },
  };
};

globalThis.beforeEach = function(fn) { if (currentSuite) currentSuite.beforeEach = fn; };

async function runTests() {
  const manifestPath = path.join(__dirname, 'test-specs.json');
  let specContents = [];

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    specContents = manifest.map(s => ({ name: s.name, content: s.content }));
  }

  for (const spec of specContents) {
    try {
      let code = spec.content.replace(/import\\s+.*?from\\s+['"][^'"]+['"]/g, '').replace(/export\\s+/g, '');
      eval(code);
    } catch (e) { console.error('Error loading spec ' + spec.name + ': ' + e.message); }
  }

  const testResults = [];
  for (const suite of suites) {
    for (const spec of suite.specs) {
      const start = Date.now();
      try {
        if (suite.beforeEach) suite.beforeEach();
        spec.fn();
        testResults.push({ name: suite.name + ' > ' + spec.name, status: 'passed', duration: Date.now() - start });
      } catch (e) {
        testResults.push({ name: suite.name + ' > ' + spec.name, status: 'failed', duration: Date.now() - start, errorMessage: e.message });
      }
    }
  }

  const output = { total: testResults.length, passed: testResults.filter(r => r.status === 'passed').length, failed: testResults.filter(r => r.status === 'failed').length, results: testResults };
  console.log('__TEST_RESULTS_START__');
  console.log(JSON.stringify(output));
  console.log('__TEST_RESULTS_END__');
}

runTests().catch(e => {
  console.error('Test runner error:', e);
  console.log('__TEST_RESULTS_START__');
  console.log(JSON.stringify({ total: 0, passed: 0, failed: 0, results: [], error: e.message }));
  console.log('__TEST_RESULTS_END__');
});
`,
    },
  },
};
