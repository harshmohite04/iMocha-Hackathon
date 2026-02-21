import { FileSystemTree } from '@webcontainer/api';

// Vite config with Angular inline plugin.
// Uses String.raw to avoid escaping issues with regex patterns and backticks.
// The ${''} breaks are used to prevent the TS compiler from interpreting
// backticks and ${} inside String.raw as template literal syntax.
const VITE_CONFIG_CONTENT: string = (() => {
  const imports = [
    'import { defineConfig } from "vite";',
    'import fs from "fs";',
    'import path from "path";',
  ].join('\n');

  // The replace chain for escaping content before wrapping in backticks
  const escChain = String.raw`.replace(/\\/g, '\\\\').replace(/` + '`' + String.raw`/g, '\\` + '`' + String.raw`').replace(/\$/g, '\\$')`;

  const plugin = [
    'function angularInlinePlugin() {',
    '  return {',
    '    name: "angular-inline",',
    '    enforce: "pre",',
    '    transform(code, id) {',
    '      if (!id.endsWith(".ts") || id.includes("node_modules")) return null;',
    '      if (code.indexOf("templateUrl") === -1 && code.indexOf("styleUrl") === -1) return null;',
    '      var result = code;',
    '      var dir = path.dirname(id);',
    '',
    String.raw`      var tmplMatch = result.match(/templateUrl\s*:\s*['"]\.\/([^'"]+)['"]/);`,
    '      if (tmplMatch) {',
    '        try {',
    '          var html = fs.readFileSync(path.join(dir, tmplMatch[1]), "utf-8");',
    '          var escaped = html' + escChain + ';',
    '          result = result.replace(tmplMatch[0], "template: `" + escaped + "`");',
    '        } catch(e) {}',
    '      }',
    '',
    String.raw`      var styleMatch = result.match(/styleUrl\s*:\s*['"]\.\/([^'"]+)['"]/);`,
    '      if (styleMatch) {',
    '        try {',
    '          var css = fs.readFileSync(path.join(dir, styleMatch[1]), "utf-8");',
    '          var esc2 = css' + escChain + ';',
    '          result = result.replace(styleMatch[0], "styles: [`" + esc2 + "`]");',
    '        } catch(e) {}',
    '      }',
    '',
    String.raw`      var suMatch = result.match(/styleUrls\s*:\s*\[\s*['"]\.\/([^'"]+)['"]\s*\]/);`,
    '      if (suMatch) {',
    '        try {',
    '          var css2 = fs.readFileSync(path.join(dir, suMatch[1]), "utf-8");',
    '          var esc3 = css2' + escChain + ';',
    '          result = result.replace(suMatch[0], "styles: [`" + esc3 + "`]");',
    '        } catch(e) {}',
    '      }',
    '',
    '      if (result !== code) return { code: result, map: null };',
    '      return null;',
    '    }',
    '  };',
    '}',
  ].join('\n');

  const config = [
    'export default defineConfig({',
    '  root: "src",',
    '  build: { outDir: "../dist" },',
    '  plugins: [angularInlinePlugin()],',
    '  esbuild: {',
    '    target: "es2022",',
    '    tsconfigRaw: {',
    '      compilerOptions: {',
    '        experimentalDecorators: true,',
    '        useDefineForClassFields: false,',
    '      }',
    '    }',
    '  },',
    '  optimizeDeps: {',
    '    include: [',
    '      "@angular/core",',
    '      "@angular/common",',
    '      "@angular/compiler",',
    '      "@angular/platform-browser",',
    '      "@angular/platform-browser-dynamic",',
    '      "@angular/forms",',
    '      "rxjs",',
    '      "zone.js",',
    '    ],',
    '    esbuildOptions: {',
    '      tsconfigRaw: {',
    '        compilerOptions: {',
    '          experimentalDecorators: true,',
    '          useDefineForClassFields: false,',
    '        }',
    '      }',
    '    }',
    '  },',
    '  server: {',
    '    hmr: true,',
    '    watch: { usePolling: true, interval: 500 },',
    '  },',
    '});',
  ].join('\n');

  return imports + '\n\n' + plugin + '\n\n' + config;
})();

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
      contents: VITE_CONFIG_CONTENT,
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

bootstrapApplication(AppComponent)
  .then(() => console.info('Angular application initialized successfully'))
  .catch(err => console.error('Bootstrap failed:', err));
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
  <script>
    (function() {
      var viteKeywords = ['[vite]','[hmr]','connecting','connected','hot updated','page reload','hmr update'];

      function isViteMessage(firstArg) {
        if (typeof firstArg !== 'string') return false;
        var l = firstArg.toLowerCase();
        for (var i = 0; i < viteKeywords.length; i++) {
          if (l.indexOf(viteKeywords[i]) !== -1) return true;
        }
        if (firstArg.indexOf('%c') === 0 && l.indexOf('vite') !== -1) return true;
        return false;
      }

      function send(method, args) {
        try {
          window.parent.postMessage({
            type: '__CONSOLE__',
            method: method,
            args: args,
            timestamp: Date.now()
          }, '*');
        } catch(e) {}
      }

      var methods = ['log', 'warn', 'error', 'info', 'debug'];
      methods.forEach(function(method) {
        var original = console[method];
        console[method] = function() {
          if (!isViteMessage(arguments[0])) {
            var args = Array.from(arguments).map(function(a) {
              try {
                if (a instanceof Error) return a.stack || a.message || String(a);
                if (typeof a === 'object') return JSON.stringify(a, null, 2);
                return String(a);
              } catch(e) { return String(a); }
            });
            send(method, args);
          }
          original.apply(console, arguments);
        };
      });

      window.addEventListener('error', function(e) {
        var msg = e.error ? (e.error.stack || e.error.message) : e.message;
        send('error', ['Uncaught Error: ' + msg]);
      });

      window.addEventListener('unhandledrejection', function(e) {
        var reason = e.reason ? (e.reason.stack || e.reason.message || String(e.reason)) : 'unknown';
        send('error', ['Unhandled Promise Rejection: ' + reason]);
      });

      send('info', ['Loading Angular application...']);
    })();
  </script>
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

globalThis.it = function(name, optionsOrFn, maybeFn) {
  var fn, options = {};
  if (typeof optionsOrFn === 'function') {
    fn = optionsOrFn;
  } else {
    options = optionsOrFn || {};
    fn = maybeFn;
  }
  if (currentSuite) currentSuite.specs.push({ name, fn, difficulty: options.difficulty || 'medium', testType: options.testType || 'positive' });
};

function makeExpect(actual, negated) {
  var matchers = {
    toBe: function(expected) {
      var pass = actual === expected;
      if (negated ? pass : !pass) throw new Error('Expected ' + JSON.stringify(actual) + (negated ? ' not ' : ' ') + 'to be ' + JSON.stringify(expected));
    },
    toEqual: function(expected) {
      var pass = JSON.stringify(actual) === JSON.stringify(expected);
      if (negated ? pass : !pass) throw new Error('Expected ' + JSON.stringify(actual) + (negated ? ' not ' : ' ') + 'to equal ' + JSON.stringify(expected));
    },
    toBeTruthy: function() {
      var pass = !!actual;
      if (negated ? pass : !pass) throw new Error('Expected ' + JSON.stringify(actual) + (negated ? ' not ' : ' ') + 'to be truthy');
    },
    toBeFalsy: function() {
      var pass = !actual;
      if (negated ? pass : !pass) throw new Error('Expected ' + JSON.stringify(actual) + (negated ? ' not ' : ' ') + 'to be falsy');
    },
    toContain: function(expected) {
      var pass = false;
      if (typeof actual === 'string') pass = actual.includes(expected);
      else if (Array.isArray(actual)) pass = actual.includes(expected);
      if (negated ? pass : !pass) throw new Error('Expected ' + (negated ? 'not ' : '') + 'to contain ' + JSON.stringify(expected));
    },
    toMatch: function(pattern) {
      var regex = (pattern instanceof RegExp) ? pattern : new RegExp(pattern);
      var pass = regex.test(actual);
      if (negated ? pass : !pass) throw new Error('Expected ' + JSON.stringify(actual) + (negated ? ' not ' : ' ') + 'to match ' + pattern);
    },
    toBeGreaterThan: function(expected) {
      var pass = actual > expected;
      if (negated ? pass : !pass) throw new Error('Expected ' + actual + (negated ? ' not ' : ' ') + '> ' + expected);
    },
    toBeLessThan: function(expected) {
      var pass = actual < expected;
      if (negated ? pass : !pass) throw new Error('Expected ' + actual + (negated ? ' not ' : ' ') + '< ' + expected);
    },
    toBeDefined: function() {
      var pass = actual !== undefined;
      if (negated ? pass : !pass) throw new Error('Expected value ' + (negated ? 'not ' : '') + 'to be defined');
    },
    toBeUndefined: function() {
      var pass = actual === undefined;
      if (negated ? pass : !pass) throw new Error('Expected ' + (negated ? 'not ' : '') + 'undefined but got ' + JSON.stringify(actual));
    },
    toBeNull: function() {
      var pass = actual === null;
      if (negated ? pass : !pass) throw new Error('Expected ' + (negated ? 'not ' : '') + 'null but got ' + JSON.stringify(actual));
    },
  };
  if (!negated) {
    matchers.not = makeExpect(actual, true);
  }
  return matchers;
}

globalThis.expect = function(actual) { return makeExpect(actual, false); };

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
        testResults.push({ name: suite.name + ' > ' + spec.name, status: 'passed', duration: Date.now() - start, difficulty: spec.difficulty, testType: spec.testType });
      } catch (e) {
        testResults.push({ name: suite.name + ' > ' + spec.name, status: 'failed', duration: Date.now() - start, errorMessage: e.message, difficulty: spec.difficulty, testType: spec.testType });
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
