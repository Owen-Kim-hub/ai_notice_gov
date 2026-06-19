import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_HOSTS = [
  "iris.go.kr",
  "ntis.go.kr",
  "keit.re.kr",
  "srome.keit.re.kr",
  "kiat.or.kr",
  "khidi.or.kr",
  "smtech.go.kr",
  "kmdf.org",
  "motir.go.kr",
  "motie.go.kr",
  "mohw.go.kr",
  "msit.go.kr",
  "htdream.kr",
  "innopolis.or.kr",
  "riis.or.kr",
  "mss.go.kr",
];

function normalizeUrl(url: string): string {
  return url.replace(/;jsessionid=[^?]*/gi, "").replace(/&amp;/g, "&");
}

function isAllowed(url: string): boolean {
  try {
    const parsed = new URL(normalizeUrl(url));
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      ALLOWED_HOSTS.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const rawUrl = typeof req.query.url === "string" ? req.query.url.trim() : "";
  const targetUrl = normalizeUrl(rawUrl);

  if (!targetUrl || !isAllowed(targetUrl)) {
    return res.status(400).send("유효하지 않거나 허용되지 않은 공고 URL입니다.");
  }

  const safeUrl = escapeHtmlAttr(targetUrl);
  const safeJsonUrl = JSON.stringify(targetUrl);

  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  return res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="refresh" content="0;url=${safeUrl}">
  <title>공고문 이동 중...</title>
  <script>window.location.replace(${safeJsonUrl});</script>
</head>
<body>
  <p>공고문 페이지로 이동 중입니다...</p>
  <p><a href="${safeUrl}" rel="noreferrer noopener">자동 이동되지 않으면 여기를 클릭하세요</a></p>
</body>
</html>`);
}
