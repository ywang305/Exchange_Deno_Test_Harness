import "https://deno.land/x/dotenv/load.ts";

export const HOST = Deno.env.get("HOST") ?? "http://localhost";

export const PORT = {
  ORDER_API: 8082,
  MARKET: 8080,
  ORDER_MATCH: 8081,
};
