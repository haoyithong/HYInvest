import { LocalStockTrade } from "../types/StockTrade";
import { TradeSummaryItem } from "../types/TradeSummaryItem";
import { round4 } from "./numberUtils";


export function calculateTradeSummary(
    trades: LocalStockTrade[],
    calculateCommission = false
): TradeSummaryItem[] {
    const grouped = trades.reduce((acc, trade) => {
        if (!acc[trade.symbol]) acc[trade.symbol] = [];
        acc[trade.symbol].push(trade);
        return acc;
    }, {} as Record<string, LocalStockTrade[]>);

    return Object.entries(grouped).map(([symbol, trades]) => {
        let positionQty = 0;
        let positionCost = 0;
        let realized = 0;
        let realizedCommission = 0;

        trades.forEach(t => {
            const rawCommission = t.commission || 0;
            const commission = calculateCommission ? rawCommission : 0;
            if (t.tradeType === 'buy') {
                const totalCost = t.price * t.quantity + commission;
                positionCost += totalCost;
                positionQty += t.quantity;
                realizedCommission += rawCommission;
            } else if (t.tradeType === 'sell') {
                if (positionQty <= 0) return;

                const avgCost = round4(positionCost / positionQty);
                const sellRevenue = round4(t.price * t.quantity);
                const sellCost = round4(avgCost * t.quantity);

                realized += round4(sellRevenue - sellCost - commission);
                realizedCommission += rawCommission;

                // Update remaining position
                positionQty -= t.quantity;
                positionCost -= sellCost;
            }
        });

        const avgBuyPrice = round4(positionQty > 0 ? positionCost / positionQty : 0);

        return {
            symbol,
            realized: parseFloat(realized.toFixed(2)),
            realizedCommission: parseFloat(realizedCommission.toFixed(2)),
            quantity: round4(positionQty),
            avgBuyPrice: parseFloat(avgBuyPrice.toFixed(4)),
        };
    });
}