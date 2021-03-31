import {
  assert,
  fail,
  assertEquals,
  assertMatch,
} from "https://deno.land/std/testing/asserts.ts";
import { HOST, PORT } from "../api/api.ts";
import ExchangeOrder from "../model/ExchangeOrder.ts";
import { ExchangeOrderType } from "../model/ExchangeOrderType.ts";
import { ExchangeOrderDirection } from "../model/ExchangeOrderDirection.ts";
import { ExchangePlatform } from "../model/ExchangePlatform.ts";

const baseUrl = HOST + ":" + PORT.ORDER_API + "/orders";

const testMemberId = 600821;
const symbol = "BTC-USDT";

const exBuyOrder: Partial<ExchangeOrder> = {
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

const exSellOrder: Partial<ExchangeOrder> = {
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

Deno.test("list all orders", async () => {
  const uri = baseUrl + `/${symbol}/` + testMemberId;
  const resp = await fetch(uri);
  const data: Array<ExchangeOrder> = await resp.json();

  assert(data?.length > 0, "order list should be length > 0");
  console.log("all order length = ", data.length);
  data.forEach((exOrder, index) => {
    assertEquals(
      exOrder.memberId,
      testMemberId,
      `order ${index}'s memberId : ${exBuyOrder.memberId} should equal to ${testMemberId}`
    );
  });
});

Deno.test("list open orders", async () => {
  const uri = baseUrl + `/${symbol}/` + testMemberId + "?status=TRADING";
  const resp = await fetch(uri);
  const data: Array<ExchangeOrder> = await resp.json();

  assert(data?.length > 0, "order list should be length > 0");
  console.log("open order length = ", data.length);
  data.forEach((exOrder, index) => {
    assertEquals(
      exOrder.memberId,
      testMemberId,
      `order ${index}'s memberId : ${exSellOrder.memberId} should equal to ${testMemberId}`
    );
  });
});

Deno.test("place a limit buy order", async () => {
  const uri = baseUrl + "/" + symbol;

  const resp = await fetch(uri, {
    method: "POST",
    body: JSON.stringify(exBuyOrder),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  const createdOrder: ExchangeOrder = await resp.json();

  console.table(createdOrder);

  assertMatch(
    createdOrder.orderId,
    /^E-/,
    "created orderId " + createdOrder.orderId + " should start with E-..."
  );
  assertEquals(
    createdOrder.direction,
    ExchangeOrderDirection[0],
    "direction not match"
  );
});

Deno.test("place a limit sell order", async () => {
  const uri = baseUrl + "/" + symbol;

  const resp = await fetch(uri, {
    method: "POST",
    body: JSON.stringify(exSellOrder),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  const createdOrder: ExchangeOrder = await resp.json();

  console.table(createdOrder);

  assertMatch(
    createdOrder.orderId,
    /^E-/,
    "created orderId " + createdOrder.orderId + " should start with E-..."
  );

  assertEquals(
    createdOrder.direction,
    ExchangeOrderDirection[1],
    "direction not match"
  );
});
