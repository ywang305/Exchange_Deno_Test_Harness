import { HOST, PORT } from "../api/api.ts";
import ExchangeOrder from "../model/ExchangeOrder.ts";
import { ExchangeOrderDirection } from "../model/ExchangeOrderDirection.ts";
import { ExchangeOrderType } from "../model/ExchangeOrderType.ts";
import { ExchangePlatform } from "../model/ExchangePlatform.ts";

const Random = Math.random;

export function generateRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const makeExchangeOrder = (
  type: ExchangeOrderType,
  direction: ExchangeOrderDirection,
  memberId: number,
  priceRange: Array<number>
) => {
  const exOrder: Partial<ExchangeOrder> = {
    memberId,
    type,
    symbol: "BTC-USDT",
    coinSymbol: "BTC",
    baseSymbol: "USDT",
    direction,
    price: generateRandomNumber(priceRange[0], priceRange[1]),
    amount: generateRandomNumber(0.01, 9),
    exchangePlatform: ExchangePlatform.GOLDEN_SOURCE,
  };

  return exOrder;
};

export async function placeExchangeOrder(
  exOrder: Partial<ExchangeOrder>
): Promise<string> {
  const uri = HOST + ":" + PORT.ORDER_API + "/orders/" + exOrder.symbol;

  const resp = await fetch(uri, {
    method: "POST",
    body: JSON.stringify(exOrder),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  const createdOrder: ExchangeOrder = await resp.json();

  console.table(createdOrder);

  return createdOrder.orderId;
}
