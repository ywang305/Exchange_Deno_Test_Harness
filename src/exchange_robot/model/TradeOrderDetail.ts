import { ExchangeOrderDirection } from "./ExchangeOrderDirection.ts";
import { ExchangeOrderType } from "./ExchangeOrderType.ts";

export default interface TradeOrderDetail {
  orderId: string;
  price: number;
  amount: number;
  turnover: number;
  fee: number;
  time: number;
  type: ExchangeOrderType;
  username: string;
  realName: string;
  memberId: number;
  direction: ExchangeOrderDirection;
  coinSymbol: string;
  baseCoinSymbol: string;
  opponentOrderId: string;
}
