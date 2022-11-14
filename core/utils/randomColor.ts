export default function getRandomColor(n: number): string {
  let hsl: number[] = [20,80, 52];
  hsl[0] = Math.floor(Math.random() * 256);
  return `hsl(${hsl.join(', ')})`;
}
