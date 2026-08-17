export function formatMoney(val: number | string): string {
  const n = typeof val === 'string' ? parseFloat(val) : val;
  const safe = isNaN(n) ? 0 : n;
  return 'R$ ' + safe.toFixed(2).replace('.', ',');
}
