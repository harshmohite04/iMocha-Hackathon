import { Injectable, signal } from '@angular/core';
import { LlmEvaluation, TestSuite } from '../models/problem.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LlmEvaluatorService {
  readonly isEvaluating = signal(false);

  get hasApiKey(): boolean {
    return environment.anthropicApiKey.trim().length > 0;
  }

  async evaluate(
    problemDescription: string,
    codeFiles: { path: string; content: string }[],
    testSuite: TestSuite,
    maxScore: number
  ): Promise<LlmEvaluation | null> {
    const key = environment.anthropicApiKey.trim();
    if (!key) return null;

    this.isEvaluating.set(true);

    try {
      const codeContext = codeFiles
        .map(f => `--- ${f.path} ---\n${f.content}`)
        .join('\n\n');

      const testSummary = testSuite.results
        .map(r => `[${r.status.toUpperCase()}] ${r.name} (${r.difficulty}, ${r.testType})${r.errorMessage ? ' - ' + r.errorMessage : ''}`)
        .join('\n');

      const prompt = `You are an expert Angular code reviewer evaluating a candidate's solution to a coding assessment.

## Problem Description
${problemDescription}

## Candidate's Code
${codeContext}

## Test Results (${testSuite.passed}/${testSuite.total} passed, base score: ${testSuite.score}/${maxScore})
${testSummary}

## Instructions
Evaluate the candidate's code holistically. Consider:
1. Code correctness — does it solve the problem even if some tests fail due to minor issues?
2. Code quality — proper Angular patterns, clean code, good naming
3. Partial credit — if the approach is right but has small bugs, give partial credit
4. Signal usage — proper use of Angular signals and reactive patterns

Return your evaluation as JSON with EXACTLY this format (no markdown, no code fences):
{"adjustedScore": <number 0-${maxScore}>, "reasoning": "<2-3 sentences explaining score adjustment>", "codeQuality": {"maintainability": <1-10>, "reliability": <1-10>, "cyclomaticComplexity": "<low|moderate|high>"}}

Rules:
- adjustedScore should be between 0 and ${maxScore}
- If tests all pass, adjustedScore should be >= base score
- If code is well-written but has minor test failures, you may award partial credit above the raw test score
- If code is poorly structured even though tests pass, you may slightly reduce the score
- maintainability: rate 1-10 (readability, naming, structure, Angular best practices)
- reliability: rate 1-10 (error handling, edge cases, correctness)
- cyclomaticComplexity: "low" (simple linear flow), "moderate" (some branching), or "high" (deeply nested/complex logic)
- Be fair and constructive`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 512,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LLM API error:', response.status, errorText);
        return null;
      }

      const data = await response.json();
      const text: string = data.content?.[0]?.text || '';

      // Parse JSON from response — handle potential markdown fences
      let jsonStr = text.trim();
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) {
        jsonStr = fenceMatch[1].trim();
      }

      const parsed = JSON.parse(jsonStr);

      const validComplexity = ['low', 'moderate', 'high'];
      const cq = parsed.codeQuality || {};

      return {
        adjustedScore: Math.max(0, Math.min(maxScore, Math.round(parsed.adjustedScore))),
        reasoning: parsed.reasoning || 'No reasoning provided.',
        codeQuality: {
          maintainability: Math.max(1, Math.min(10, Math.round(cq.maintainability || 5))),
          reliability: Math.max(1, Math.min(10, Math.round(cq.reliability || 5))),
          cyclomaticComplexity: validComplexity.includes(cq.cyclomaticComplexity) ? cq.cyclomaticComplexity : 'moderate',
        },
      };
    } catch (err) {
      console.error('LLM evaluation failed:', err);
      return null;
    } finally {
      this.isEvaluating.set(false);
    }
  }
}
