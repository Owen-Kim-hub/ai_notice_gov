export { handleExtract } from "./extractLogic.js";
export { handleOpen } from "./openHandler.js";

export type ApiRequest = { body?: unknown; query?: Record<string, unknown> };
export type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  send: (body: string) => void;
  json: (body: unknown) => void;
};
