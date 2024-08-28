export const toCurrency = (value: number, currencySymbol: string = '$'): string => {
  return `${currencySymbol}${new Intl.NumberFormat('es-CO').format(value)}`;
}