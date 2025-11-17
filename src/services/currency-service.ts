import { getExchangeRate } from './currency-api';

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  const converted = amount * rate;
  
  return Math.round(converted * 100) / 100;
}

