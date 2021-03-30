import { ExchangeOrderType } from "./ExchangeOrderType.ts";
import { ExchangeOrderDirection } from "./ExchangeOrderDirection.ts";
import { ExchangeOrderStatus } from "./ExchangeOrderStatus.ts";
import { ExchangePlatform } from "./ExchangePlatform.ts";

export default interface ExchangeOrder {
  orderId: string;
  memberId: number;
  type: ExchangeOrderType;
  amount: number;
  symbol: string;
  coinSymbol: string;
  baseSymbol: string;
  direction: ExchangeOrderDirection;
  price: number;
  time?: number;
  completedTime?: number;
  canceledTime?: number;
  exchangePlatform: ExchangePlatform;
  status: ExchangeOrderStatus;
}
