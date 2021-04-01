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
import { makeExchangeOrder, placeExchangeOrder } from "./helper.ts";

//  pressure testing

const pressure = 100;
const testMemberId = 600821;
const symbol = "BTC-USDT";
const baseUrl = HOST + ":" + PORT.MARKET + "/market";

Deno.test(
  `limit order buy/sell, pressure test with ${pressure} request for each buy / sell`,
  async () => {
    const buyIds: Array<string> = [];
    const sellIds: string[] = [];
    const seqs = Array.from({ length: 1000 });
    for await (const _ of seqs) {
      const exBuyOrder = makeExchangeOrder(
        ExchangeOrderType.LIMIT_PRICE,
        ExchangeOrderDirection.BUY,
        testMemberId,
        [0.01, 10]
      );
      const exSellOrder = makeExchangeOrder(
        ExchangeOrderType.LIMIT_PRICE,
        ExchangeOrderDirection.SELL,
        testMemberId,
        [30, 100]
      );
      const buyOrderId = await placeExchangeOrder(exBuyOrder);
      const sellOrderId = await placeExchangeOrder(exSellOrder);
      buyIds.push(buyOrderId);
      sellIds.push(sellOrderId);
    }

    assertEquals(buyIds.length, 1000, `not generated ${pressure} buys`);
    assertEquals(sellIds.length, 1000, `not generated ${pressure} sells`);

    console.info("\n waiting for 60s to checkout... \n");
    await sleep(60);

    const tradeOrderDetailUrl =
      baseUrl + `/trade_order_list/${symbol}/${testMemberId}`;

    const resp = await fetch(tradeOrderDetailUrl);
    const todList: Array<TradeOrderDetail> = await resp.json();
    const todOrderIdSet = new Set(todList.map((tod) => tod.orderId));
  }
);
