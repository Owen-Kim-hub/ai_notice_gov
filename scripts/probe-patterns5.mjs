async function fetchHtml(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  return r.text();
}

const html = await fetchHtml(
  "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311&searchOption=title&searchWord=AI"
);

const idx = html.indexOf("3186785");
console.log("context around id", html.slice(idx - 100, idx + 600));

const blockPattern = /fn_detail\((\d+)\);[\s\S]*?unescape\('([^']+)'\)/gi;
let m;
let n = 0;
while ((m = blockPattern.exec(html)) !== null && n < 5) {
  console.log("block", m[1], m[2]);
  n++;
}

// KIAT - try GET with proper params from form
{
  const url =
    "https://www.kiat.or.kr/front/board/boardContentsListAjax.do?board_id=90&page=1&searchKeyword=AI&searchCondition=title";
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90",
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  const text = await r.text();
  console.log("KIAT GET ajax len", text.length, "has contentsView", text.includes("contentsView"));
  const view = [...text.matchAll(/contentsView\((\d+)\)/g)].slice(0, 5);
  console.log("KIAT content ids", view.map((m) => m[1]));
  const titles = [...text.matchAll(/<a[^>]+>([^<]*AI[^<]*)<\/a>/gi)].slice(0, 5);
  console.log("KIAT AI titles", titles.map((m) => m[1]));
}
