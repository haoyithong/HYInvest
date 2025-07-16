/**
 * 四捨五入到指定的小數位數（預設為4位）
 * @param num 要處理的數字
 * @param digits 保留的小數位數，預設為4
 * @returns 處理後的數字
 */
export function round(num: number, digits: number = 4): number {
    const factor = Math.pow(10, digits);
    return Math.round(num * factor) / factor;
}

/**
 * 快捷函數：四捨五入到4位小數
 * @param num 要處理的數字
 * @returns 處理後的數字
 */
export function round4(num: number): number {
    return round(num, 4);
}

/**
 * 快捷函數：四捨五入到2位小數
 * @param num 要處理的數字
 * @returns 處理後的數字
 */
export function round2(num: number): number {
    return round(num, 2);
}

/**
 * 將數字格式化為貨幣字串
 * @param num 要格式化的數字
 * @param digits 小數位數（預設2）
 * @returns e.g. '1,234.56'
 */
export function formatCurrency(num: number, digits: number = 2): string {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}