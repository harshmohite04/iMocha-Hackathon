import { VirtualFile } from './virtual-file.model';

export interface Problem {
  id: string;
  title: string;
  description: string;
  starterFiles: VirtualFile[];
  testFiles: VirtualFile[];
  maxScore: number;
  timeLimit: number; // seconds
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  errorMessage?: string;
}

export interface TestSuite {
  total: number;
  passed: number;
  failed: number;
  score: number;
  results: TestResult[];
}
