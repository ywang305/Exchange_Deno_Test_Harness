import {
  assert,
  fail,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { HOST, PORT, PATH } from "../api/api.ts";
import ExchangeOrder from "../model/ExchangeOrder.ts";

const baseUrl = HOST + ":" + PORT + PATH.ORDERS;

const testMemberId = 600821;

Deno.test("list all orders", async () => {
  const uri = baseUrl + "/BTC-USDT/" + testMemberId;
  const resp = await fetch(uri);
  const data: Array<ExchangeOrder> = await resp.json();

  assert(data?.length > 0, "order list should be length > 0");

  data.forEach((exOrder, index) => {
    assertEquals(
      exOrder.memberId,
      testMemberId,
      `order ${index}'s memberId : ${exOrder.memberId} should equal to ${testMemberId}`
    );
  });
});
