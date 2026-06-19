async function kiatList(keyword) {
  const url = `https://www.kiat.or.kr/front/board/boardContentsListAjax.do?board_id=90&page=1&searchKeyword=${encodeURIComponent(keyword)}&searchCondition=title`;
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90",
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  return r.text();
}

const html = await kiatList("AI");
console.log("len", html.length);
const views = [...html.matchAll(/contentsView\('?(\d+)'?\)/g)];
console.log("contentsView count", views.length, views.slice(0, 5).map((m) => m[0]));
const onclick = [...html.matchAll(/onclick="([^"]*View[^"]*)"/gi)].slice(0, 10);
console.log("onclick view", onclick.map((m) => m[1]));
const titles = [...html.matchAll(/<td[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/td>/gi)].slice(0, 3);
console.log("title td", titles.map((m) => m[1].replace(/<[^>]+>/g, "").trim().slice(0, 80)));
// dump a section with list rows
const listIdx = html.indexOf("2026년도 지역");
console.log("row section", html.slice(listIdx - 100, listIdx + 800));

const hrefs = [...html.matchAll(/href="([^"]+)"/gi)].filter((m) => m[1].includes("View") || m[1].includes("view"));
console.log("view hrefs", hrefs.slice(0, 10).map((m) => m[1]));

const onclickAll = [...html.matchAll(/onclick="([^"]{5,120})"/gi)].slice(0, 15);
console.log("onclick samples", onclickAll.map((m) => m[1]));

