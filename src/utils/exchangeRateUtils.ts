export type SupportedCurrency = 'MYR' | 'USD';

export const convertCurrency = (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency,
    rate: number
): number => {
    if (from === to) return amount;

    if (from === 'USD' && to === 'MYR') {
        return amount * rate;
    }

    if (from === 'MYR' && to === 'USD') {
        return amount / rate;
    }

    throw new Error('Unsupported currency conversion');
};