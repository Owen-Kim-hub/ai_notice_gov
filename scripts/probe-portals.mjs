async function fetchHtml(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
  });
  return await r.text();
}

const probes = [
  ["IRIS", "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do", /href="([^"]*(?:ancmId|retrieveBsnsAncm)[^"]*)"/gi],
  ["SMTECH", "https://www.smtech.go.kr/front/ifg/no/notice02_list.do?searchKeyword=AI", /href="([^"]*notice02_detail[^"]*)"/gi],
  ["MSIT", "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311&searchOption=title&searchWord=AI", /href="([^"]*view\.do[^"]*)"/gi],
  ["KIAT", "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90", /href="([^"]*boardContentsView[^"]*)"/gi],
  ["MSS", "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310&searchKey=title&searchVal=AI", /href="([^"]*View\.do[^"]*)"/gi],
];

for (const [name, url, re] of probes) {
  const html = await fetchHtml(url);
  const links = [...html.matchAll(re)].slice(0, 3).map((m) => m[1]);
  console.log(`\n=== ${name} (${html.length} bytes) ===`);
  console.log(links);
}
