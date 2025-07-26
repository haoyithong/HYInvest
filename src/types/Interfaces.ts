import { StockTrade } from "./StockTrade";
import { TradeSummaryItem } from "./TradeSummaryItem";

export interface TradeState {
  trades: StockTrade[];
  summary: TradeSummaryItem[];
  loading: boolean;
  error: string | null;
}