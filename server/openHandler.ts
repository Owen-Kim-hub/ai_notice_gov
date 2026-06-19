import { PORTALS } from "./portals";

export type ApiRequest = { query: Record<string, string | string[] | undefined> };
export type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  send: (body: string) => void;
};

const ALLOWED_LINK_HOSTS = PORTALS.flatMap((portal) => portal.domains);

function normalizeUrl(url: string): string {
  return url.replace(/;jsessionid=[^?]*/gi, "").replace(/&amp;/g, "&");
}

function isAllowedAnnouncementUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizeUrl(url));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    return ALLOWED_LINK_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function handleOpen(req: ApiRequest, res: ApiResponse) {
  const rawUrl = typeof req.query.url === "string" ? req.query.url.trim() : "";
  const targetUrl = normalizeUrl(rawUrl);

  if (!targetUrl || !isAllowedAnnouncementUrl(targetUrl)) {
    return res.status(400).send("유효하지 않거나 허용되지 않은 공고 URL입니다.");
  }

  const safeUrl = escapeHtmlAttr(targetUrl);
  const safeJsonUrl = JSON.stringify(targetUrl);

  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="refresh" content="0;url=${safeUrl}">
  <title>공고문 이동 중...</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #334155; }
    .box { text-align: center; padding: 2rem; max-width: 560px; line-height: 1.6; }
    a { color: #4f46e5; word-break: break-all; }
  </style>
  <script>
    window.location.replace(${safeJsonUrl});
  </script>
</head>
<body>
  <div class="box">
    <p>공고문 페이지로 이동 중입니다...</p>
    <p><a href="${safeUrl}" rel="noreferrer noopener">자동 이동되지 않으면 여기를 클릭하세요</a></p>
  </div>
</body>
</html>`);
}
