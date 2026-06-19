async function check(url, patterns) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await r.text();
  console.log("\n===", url, "status", r.status, "len", html.length);
  for (const [name, re] of patterns) {
    const m = [...html.matchAll(re)];
    console.log(name, m.length, m[0]?.[0]?.slice(0, 120));
  }
}

await check("https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90?searchKeyword=AI", [
  ["bad", /boardContentsView/gi],
]);
await check("https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90&searchKeyword=AI", [
  ["view", /boardContentsView\.do[^"']+/gi],
  ["onclick=" , /fn_[a-zA-Z]+\([^)]+\)/gi],
]);
await check("https://www.smtech.go.kr/front/ifg/no/notice02_list.do?searchKeyword=AI", [
  ["detail", /notice02_detail\.do[^"']+/gi],
  ["board", /class="board"/gi],
]);
await check(
  "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311&searchOption=title&searchWord=AI",
  [["fn", /fn_detail\(\d+\)/gi], ["view", /view\.do\?[^"']+/gi]]
);
await check(
  "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01&search_type=title&search_text=AI",
  [["view", /act=view[^"']+/gi], ["title", /txt_title/gi]]
);
