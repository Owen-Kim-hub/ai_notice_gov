async function fetchHtml(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  return r.text();
}

// MSIT pair fn_detail with unescape
{
  const html = await fetchHtml(
    "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311&searchOption=title&searchWord=AI"
  );
  const ids = [...html.matchAll(/fn_detail\((\d+)\)/g)].map((m) => m[1]);
  const titles = [...html.matchAll(/unescape\('([^']+)'\)/g)].map((m) => m[1]);
  console.log("MSIT ids", ids.length, "titles", titles.length);
  for (let i = 0; i < Math.min(5, ids.length); i++) {
    console.log(ids[i], titles[i]);
  }
}

// KIAT ajax
{
  const body = new URLSearchParams({
    board_id: "90",
    page: "1",
    searchKeyword: "AI",
    searchCondition: "title",
  });
  const r = await fetch("https://www.kiat.or.kr/front/board/boardContentsListAjax.do", {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90",
    },
    body,
  });
  console.log("KIAT ajax status", r.status, "type", r.headers.get("content-type"));
  const text = await r.text();
  console.log("KIAT ajax sample", text.slice(0, 800));
}

// SMTECH - try list ajax
{
  const html = await fetchHtml("https://www.smtech.go.kr/front/ifg/no/notice02_list.do");
  const scripts = [...html.matchAll(/\/front\/[^'"]+\.do/g)].slice(0, 30);
  console.log("SMTECH do endpoints", [...new Set(scripts.map((m) => m[0]))].slice(0, 15));
}
