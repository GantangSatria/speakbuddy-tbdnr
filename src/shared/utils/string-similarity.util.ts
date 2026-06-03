export function calculateAccuracy(target: string, input: string): number {
  if (!target || !input) return 0;

  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/gi, '');
  const t = normalize(target);
  const i = normalize(input);

  if (t === i) return 100;
  if (t.length === 0 || i.length === 0) return 0;

  const matrix: number[][] = [];

  for (let a = 0; a <= t.length; a++) {
    matrix[a] = [a];
  }
  for (let b = 0; b <= i.length; b++) {
    matrix[0][b] = b;
  }

  for (let a = 1; a <= t.length; a++) {
    for (let b = 1; b <= i.length; b++) {
      if (t.charAt(a - 1) === i.charAt(b - 1)) {
        matrix[a][b] = matrix[a - 1][b - 1];
      } else {
        matrix[a][b] = Math.min(
          matrix[a - 1][b - 1] + 1, // substitution
          Math.min(
            matrix[a][b - 1] + 1, // insertion
            matrix[a - 1][b] + 1  // deletion
          )
        );
      }
    }
  }

  const distance = matrix[t.length][i.length];
  const maxLength = Math.max(t.length, i.length);
  const accuracy = ((maxLength - distance) / maxLength) * 100;

  return Math.round(accuracy);
}
