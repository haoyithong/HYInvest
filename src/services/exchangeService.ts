export const fetchExchangeRate = async (from: string, to: string): Promise<number> => {
    const response = await fetch(`https://api.frankfurter.app/latest?base=${from}&symbols=${to}`);
    if (!response.ok) throw new Error('Failed to fetch exchange rate');
    const data = await response.json();
    return data.rates[to];
};