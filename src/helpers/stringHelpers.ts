export const toCurrency = (value: number | string, currencySymbol: string = '$'): string => {
  if (typeof value === 'string') {
    value = parseFloat(value);
    if (isNaN(value)) {
      return `${currencySymbol}0`;
    }
  }
  return `${currencySymbol}${new Intl.NumberFormat('es-CO').format(value)}`;
}