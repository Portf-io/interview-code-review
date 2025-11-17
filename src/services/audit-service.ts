export async function logConversion(
  drawdownId: string,
  originalAmount: number,
  convertedAmount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<void> {
  console.log(`Audit: Drawdown ${drawdownId} converted ${originalAmount} ${fromCurrency} to ${convertedAmount} ${toCurrency}`);
}

