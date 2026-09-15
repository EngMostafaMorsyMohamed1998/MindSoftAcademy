export function shuffled<T>(items: T[], seed: number): T[] {
  const next = [...items];
  let value = seed || 1;
  for (let i = next.length - 1; i > 0; i -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const j = value % (i + 1);
    const current = next[i]!;
    next[i] = next[j]!;
    next[j] = current;
  }
  return next;
}

export function newAttemptSeed(): number {
  return Date.now() % 1_000_000_007;
}
