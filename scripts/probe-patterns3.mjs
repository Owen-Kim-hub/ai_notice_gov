async function fetchHtml(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  return r.text();
}

// MOHW - fix pattern
{
  const html = await fetchHtml(
    "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01&search_type=title&search_text=AI"
  );
  const pattern =
    /<a href="(\/board\.es\?[^"]*act=view[^"]*)"[^>]*class="txt_title"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<td[^>]*data-label="등록일">([\d-]+)<\/td>/gi;
  let m;
  let n = 0;
  while ((m = pattern.exec(html)) !== null && n < 3) {
    console.log("MOHW", strip(m[2]), m[1], m[3]);
    n++;
  }
  function strip(s) {
    return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}

// MSIT - look for nttSeqNo in page
{
  const html = await fetchHtml(
    "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311&searchOption=title&searchWord=AI"
  );
  const jsonMatch = html.match(/var\s+listData\s*=\s*(\[[\s\S]*?\]);/);
  console.log("MSIT listData", jsonMatch?.[1]?.slice(0, 300));
  const titleMatch = [...html.matchAll(/nttSeqNo['":\s]+(\d+)/gi)].slice(0, 5);
  console.log("MSIT nttSeqNo", titleMatch.map((m) => m[0]));
  const unescapeMatch = [...html.matchAll(/unescape\('([^']+)'\)/gi)].slice(0, 5);
  console.log("MSIT unescape", unescapeMatch.map((m) => m[1]));
}

// KIAT - search board list API
{
  const html = await fetchHtml("https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90");
  const apis = [...html.matchAll(/url\s*:\s*['"]([^'"]+)['"]/gi)].slice(0, 15);
  console.log("KIAT urls in script", apis.map((m) => m[1]));
  const board = [...html.matchAll(/boardContents[^"']+/gi)].slice(0, 10);
  console.log("KIAT board refs", board.map((m) => m[0]));
}

// SMTECH ajax
{
  const html = await fetchHtml("https://www.smtech.go.kr/front/ifg/no/notice02_list.do");
  const urls = [...html.matchAll(/url\s*:\s*['"]([^'"]*notice[^'"]*)['"]/gi)];
  console.log("SMTECH ajax urls", urls.map((m) => m[1]).slice(0, 10));
}
