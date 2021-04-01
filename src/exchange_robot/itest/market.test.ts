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
import TradeOrderDetail from "../model/TradeOrderDetail.ts";
import { makeExchangeOrder, placeExchangeOrder } from "./helper.ts";

const baseUrl = HOST + ":" + PORT.MARKET + "/market";
const testMemberId = 600821;
const symbol = "BTC-USDT";

Deno.test(
  "order buy/sell, then trade-order-detail gen from placed orders and trades",
  async () => {
    const tradeOrderDetailUrl =
      baseUrl + `/trade_order_list/${symbol}/${testMemberId}`;
    const exBuyOrder = makeExchangeOrder(
      ExchangeOrderType.LIMIT_PRICE,
      ExchangeOrderDirection.BUY,
      testMemberId
    );
    const exSellOrder = makeExchangeOrder(
      ExchangeOrderType.LIMIT_PRICE,
      ExchangeOrderDirection.SELL,
      testMemberId
    );
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
