import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./uploadthing/core";

const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    return GET(req, res);
  } else if (req.method === "POST") {
    return POST(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}