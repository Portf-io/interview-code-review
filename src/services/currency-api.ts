// Mock external currency API - simulates async call with setTimeout
// No error handling, no retries, just a simple mock

export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  
  // Hardcoded exchange rates to GBP for the purposes of this example
  const rates: Record<string, number> = {
    'USD': 0.79,
    'EUR': 0.85,
    'JPY': 0.0053,
    'GBP': 1.0,
    'CHF': 0.91,
    'AUD': 0.52
  };
  
  // If currency not found, just return 1.0 (bad practice)
  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;
  
  // Simple division, no validation
  return fromRate / toRate;
}

