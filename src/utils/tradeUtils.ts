
export function formatCurrency(value: number): string {
  if (!value && value !== 0) return '0.00';
  
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  }
  
  if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K';
  }
  
  if (value < 0.001) {
    return value.toFixed(6);
  }
  
  return value.toFixed(2);
}
