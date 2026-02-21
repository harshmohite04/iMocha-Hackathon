import { Injectable, signal } from '@angular/core';
import { WebContainer, FileSystemTree, WebContainerProcess } from '@webcontainer/api';

export type BootStage = 'idle' | 'booting' | 'installing' | 'starting' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class WebContainerService {
  private container: WebContainer | null = null;
  private devServerProcess: WebContainerProcess | null = null;

  readonly stage = signal<BootStage>('idle');
  readonly previewUrl = signal<string>('');
  readonly serverOutput = signal<string>('');
  readonly isReady = signal(false);

  async boot(): Promise<void> {
    if (this.container) return;

    try {
      this.stage.set('booting');
      this.container = await WebContainer.boot();
      this.stage.set('installing');
    } catch (err) {
      this.stage.set('error');
      throw err;
    }
  }

  async mountFiles(tree: FileSystemTree): Promise<void> {
    if (!this.container) throw new Error('WebContainer not booted');
    await this.container.mount(tree);
  }

  async installDependencies(): Promise<boolean> {
    if (!this.container) throw new Error('WebContainer not booted');

    this.stage.set('installing');
    const process = await this.container.spawn('npm', [
      'install',
      '--prefer-offline',
      '--no-audit',
      '--no-fund',
      '--no-optional',
      '--no-package-lock',
    ]);

    process.output.pipeTo(
      new WritableStream({
        write: (chunk) => {
          this.serverOutput.update((prev) => prev + chunk);
        },
      })
    );

    const exitCode = await process.exit;
    if (exitCode !== 0) {
      this.stage.set('error');
      return false;
    }
    return true;
  }

  async startDevServer(): Promise<string> {
    if (!this.container) throw new Error('WebContainer not booted');

    this.stage.set('starting');

    this.devServerProcess = await this.container.spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000']);

    this.devServerProcess.output.pipeTo(
      new WritableStream({
        write: (chunk) => {
          this.serverOutput.update((prev) => prev + chunk);
        },
      })
    );

    return new Promise<string>((resolve) => {
      this.container!.on('server-ready', (_port, url) => {
        this.previewUrl.set(url);
        this.isReady.set(true);
        this.stage.set('ready');
        resolve(url);
      });
    });
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!this.container) throw new Error('WebContainer not booted');

    // Ensure parent directories exist
    const dir = path.substring(0, path.lastIndexOf('/'));
    if (dir) {
      await this.container.spawn('mkdir', ['-p', dir]);
    }
    await this.container.fs.writeFile(path, content);
  }

  async readFile(path: string): Promise<string> {
    if (!this.container) throw new Error('WebContainer not booted');
    return this.container.fs.readFile(path, 'utf-8');
  }

  async spawn(command: string, args: string[]): Promise<{ output: string; exitCode: number }> {
    if (!this.container) throw new Error('WebContainer not booted');

    const process = await this.container.spawn(command, args);
    let output = '';

    process.output.pipeTo(
      new WritableStream({
        write: (chunk) => {
          output += chunk;
        },
      })
    );

    const exitCode = await process.exit;
    return { output, exitCode };
  }

  async teardown(): Promise<void> {
    this.container?.teardown();
    this.container = null;
    this.devServerProcess = null;
    this.stage.set('idle');
    this.previewUrl.set('');
    this.isReady.set(false);
    this.serverOutput.set('');
  }
}
