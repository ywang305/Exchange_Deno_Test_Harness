import {
  assertArrayIncludes,
  assertEquals,
  assert,
} from "https://deno.land/std/testing/asserts.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts";
import { HOST, PORT } from "../api/api.ts";
import ExchangeOrder from "../model/ExchangeOrder.ts";
import { ExchangeOrderDirection } from "../model/ExchangeOrderDirection.ts";
import { ExchangeOrderType } from "../model/ExchangeOrderType.ts";
import { ExchangePlatform } from "../model/ExchangePlatform.ts";
import TradeOrderDetail from "../model/TradeOrderDetail.ts";

const baseUrl = HOST + ":" + PORT.MARKET + "/market";
const testMemberId = 600821;
const symbol = "BTC-USDT";

export const exBuyOrder: Partial<ExchangeOrder> = {
  memberId: testMemberId,
  type: ExchangeOrderType.LIMIT_PRICE,
  symbol,
  coinSymbol: "BTC",
  baseSymbol: "USDT",
  direction: ExchangeOrderDirection.BUY,
  price: 88,
  amount: 0.22,
  exchangePlatform: ExchangePlatform.GOLDEN_SOURCE,
};

export const exSellOrder: Partial<ExchangeOrder> = {
  memberId: testMemberId,
  type: ExchangeOrderType.LIMIT_PRICE,
  symbol,
  coinSymbol: "BTC",
  baseSymbol: "USDT",
  direction: ExchangeOrderDirection.SELL,
  price: 90,
  amount: 0.015,
  exchangePlatform: ExchangePlatform.GOLDEN_SOURCE,
};

async function placeExchangeOrder(
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

Deno.test(
  "order buy/sell, then trade-order-detail gen from placed orders and trades",
  async () => {
    const tradeOrderDetailUrl =
      baseUrl + `/trade_order_list/${symbol}/${testMemberId}`;

    const buyOrderId = await placeExchangeOrder(exBuyOrder);
    const sellOrderId = await placeExchangeOrder(exSellOrder);

    console.info("\n waiting for 30s to checkout... \n");

    await sleep(30);

    const resp = await fetch(tradeOrderDetailUrl);
    const todList: Array<TradeOrderDetail> = await resp.json();
    const orderIds = todList.map((tod) => tod.orderId);
    console.info({ orderIds });
    assert(
      orderIds.some((id) => id === buyOrderId || id === sellOrderId),
      "no buyOrderId or sellOrderId exists in returned tradeOrderDetail's id "
    );
  }
);

Deno.test(
  "order buy/sell, pressure test with 1000 request for each buy / sell",
  async () => {
    const buyIds: Array<string> = [];
    const sellIds: string[] = [];
    const seqs = Array.from({ length: 1000 });
    for await (const _ of seqs) {
      const buyOrderId = await placeExchangeOrder(exBuyOrder);
      const sellOrderId = await placeExchangeOrder(exSellOrder);
      buyIds.push(buyOrderId);
      sellIds.push(sellOrderId);
    }

    assertEquals(buyIds.length, 1000, "not generated 1000 buys");
    assertEquals(sellIds.length, 1000, "not generated 1000 sells");

    console.info("\n waiting for 60s to checkout... \n");

    await sleep(60);

    const tradeOrderDetailUrl =
      baseUrl + `/trade_order_list/${symbol}/${testMemberId}`;

    const resp = await fetch(tradeOrderDetailUrl);
    const todList: Array<TradeOrderDetail> = await resp.json();
    const todOrderIdSet = new Set(todList.map((tod) => tod.orderId));
    seqs.forEach((_, i) => {
      assert(
        todOrderIdSet.has(buyIds[i]) || todOrderIdSet.has(sellIds[i]),
        "tod ids should be exists in checkout"
      );
    });
  }
);
