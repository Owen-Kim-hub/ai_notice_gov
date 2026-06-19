import { scrapeAllPortals } from "../server/portalScraper.ts";

// KIAT only debug
const { scrapeKiat } = await import("../server/portalScraper.ts").then(async (m) => {
  // can't import private fn - inline test
  return {};
});

const url =
  "https://www.kiat.or.kr/front/board/boardContentsListAjax.do?board_id=90&page=1&searchKeyword=AI&searchCondition=title";
const html = await (
  await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
).text();

const rowPattern =
  /javascript:contentsView\('([^']+)'\)[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4}-\d{2}-\d{2})/gi;
let m;
let n = 0;
while ((m = rowPattern.exec(html)) !== null && n < 5) {
  console.log(m[1], m[2].replace(/<[^>]+>/g, "").trim().slice(0, 60), m[3]);
  n++;
}
console.log("matches", n);
