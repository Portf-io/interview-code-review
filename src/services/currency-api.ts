export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  
  const rates: Record<string, number> = {
    'USD': 0.79,
    'EUR': 0.85,
    'JPY': 0.0053,
    'GBP': 1.0,
    'CHF': 0.91,
    'AUD': 0.52
  };
  
  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;
  
  return fromRate / toRate;
}

