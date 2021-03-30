import "https://deno.land/x/dotenv/load.ts";

export const HOST = Deno.env.get("HOST") ?? "http://localhost";
export const PORT = "8082";
export const PATH = {
  ORDERS: "/orders",
};
