/** Express / Vercel 양쪽 핸들러가 공유하는 최소 요청·응답 형태 */
export type ApiRequest = {
  body?: unknown;
  query?: Record<string, unknown>;
};

export type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  send: (body: string) => void;
  json: (body: unknown) => void;
};
