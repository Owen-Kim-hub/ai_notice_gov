// 연동 및 보정 포털 리스트(16개)의 링크 아이콘 URL이 실제 접속되는지 점검한다.
// PortalList.tsx는 각 URL을 새 탭에서 직접 여므로, 여기서 동일 URL의 도달성을 확인한다.
// 사용: node scripts/check-portal-links.mjs
import { readFileSync } from "node:fs";

// constants.ts에서 PORTALS_LIST의 {name, url}를 그대로 파싱(단일 출처 유지)
const src = readFileSync(new URL("../src/constants.ts", import.meta.url), "utf8");
const re = /name:\s*"([^"]+)",\s*url:\s*"([^"]+)"/g;
const portals = [...src.matchAll(re)].map((m) => ({ name: m[1], url: m[2].replace(/&amp;/g, "&") }));

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function check(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const body = await res.text();
    return { status: res.status, ok: res.ok, bytes: body.length, finalUrl: res.url };
  } catch (e) {
    return { status: 0, ok: false, error: e.message };
  }
}

console.log(`연동 포털 링크 점검 (${portals.length}개)\n`);
let bad = 0;
for (const p of portals) {
  const r = await check(p.url);
  // 도달성 기준: HTTP 2xx + 응답 본문이 충분히 큼(에러/차단 페이지 거르기)
  const healthy = r.ok && r.bytes > 1000;
  if (!healthy) bad++;
  const tag = healthy ? "OK  " : "확인필요";
  const detail = r.error
    ? `에러: ${r.error}`
    : `HTTP ${r.status}, ${r.bytes}바이트${r.finalUrl !== p.url ? ` → 리다이렉트: ${r.finalUrl}` : ""}`;
  console.log(`[${tag}] ${p.name}`);
  console.log(`        ${detail}`);
}
console.log(`\n결과: ${portals.length - bad}/${portals.length} 정상${bad ? `, ${bad}개 확인 필요` : ""}`);
