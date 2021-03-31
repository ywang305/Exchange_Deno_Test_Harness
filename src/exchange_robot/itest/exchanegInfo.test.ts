import { assertArrayIncludes } from "https://deno.land/std/testing/asserts.ts";
import { HOST, PORT } from "../api/api.ts";
import ExchangeOrder from "../model/ExchangeOrder.ts";

const baseUrl = HOST + ":" + PORT.MARKET + "/exchangeInfo/symbols";

Deno.test("exchangeInfo endpoint get all enabled ex-coin pairs", async () => {
  const uri = baseUrl + "?exchangePlatform=GOLDEN_SOURCE";
  const resp = await fetch(uri);
  const data: Array<string> = await resp.json();

  assertArrayIncludes(data, ["BTC-USDT"]);
});
