import { Injectable, signal, OnDestroy } from '@angular/core';

export interface ConsoleEntry {
  method: 'log' | 'warn' | 'error' | 'info' | 'debug';
  args: string[];
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class AppConsoleService implements OnDestroy {
  readonly logs = signal<ConsoleEntry[]>([]);
  readonly count = signal(0);
  readonly errorCount = signal(0);

  private listener = (event: MessageEvent) => {
    const data = event.data;
    if (data?.type !== '__CONSOLE__') return;

    const entry: ConsoleEntry = {
      method: data.method || 'log',
      args: data.args || [],
      timestamp: data.timestamp || Date.now(),
    };

    this.logs.update((prev) => [...prev, entry]);
    this.count.update((c) => c + 1);
    if (entry.method === 'error') {
      this.errorCount.update((c) => c + 1);
    }
  };

  constructor() {
    window.addEventListener('message', this.listener);
  }

  /** Add a log entry programmatically (e.g., from build/compilation events) */
  addEntry(method: ConsoleEntry['method'], ...args: string[]): void {
    const entry: ConsoleEntry = { method, args, timestamp: Date.now() };
    this.logs.update((prev) => [...prev, entry]);
    this.count.update((c) => c + 1);
    if (method === 'error') {
      this.errorCount.update((c) => c + 1);
    }
  }

  clear(): void {
    this.logs.set([]);
    this.count.set(0);
    this.errorCount.set(0);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.listener);
  }
}
