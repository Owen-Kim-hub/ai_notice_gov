import fs from "fs";

async function fetchHtml(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
  });
  return await r.text();
}

const url = process.argv[2] || "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do";
const name = process.argv[3] || "portal";
const html = await fetchHtml(url);
fs.writeFileSync(`scripts/sample-${name}.html`, html);

const keywords = ["ancmId", "noticeSeq", "bbsSeqNo", "onclick", "AI", "인공지능", "detail", "view.do", "ajax", "json"];
for (const kw of keywords) {
  const idx = html.indexOf(kw);
  if (idx >= 0) {
    console.log(`\n[${kw}] context:`, html.slice(Math.max(0, idx - 80), idx + 120).replace(/\s+/g, " "));
  }
}

console.log("\nTotal length:", html.length);
