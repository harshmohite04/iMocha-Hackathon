export interface CompilationError {
  file: string;
  line: number;
  column: number;
  message: string;
}
