import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ message: "hello" }), {
    headers: { "Content-Type": "application/json" },
  });
};
