import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleOpen } from "../server/handlers.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }
  return handleOpen(req, res);
}
