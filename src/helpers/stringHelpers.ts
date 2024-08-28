export const toCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
}