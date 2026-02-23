import { VirtualFile } from './virtual-file.model';

export type TestDifficulty = 'easy' | 'medium' | 'hard';
export type TestType = 'positive' | 'negative' | 'edge';

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
  difficulty: TestDifficulty;
  testType: TestType;
}

export interface CodeQualityRatings {
  maintainability: number; // 1-10
  reliability: number;     // 1-10
  cyclomaticComplexity: 'low' | 'moderate' | 'high';
}

export interface LlmEvaluation {
  adjustedScore: number;
  reasoning: string;
  codeQuality: CodeQualityRatings;
}

export interface TestSuite {
  total: number;
  passed: number;
  failed: number;
  score: number;
  results: TestResult[];
  llmEvaluation?: LlmEvaluation;
  finalScore?: number;
}
