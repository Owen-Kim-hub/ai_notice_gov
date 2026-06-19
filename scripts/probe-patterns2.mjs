async function fetchHtml(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  return r.text();
}

// KIAT
{
  const html = await fetchHtml(
    "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90&searchKeyword=AI"
  );
  const snippets = [...html.matchAll(/onclick="([^"]+)"/gi)].slice(0, 10);
  console.log("KIAT onclick samples:", snippets.map((m) => m[1]));
  const ai = html.match(/AI[^<]{0,80}/gi)?.slice(0, 5);
  console.log("KIAT AI snippets:", ai);
}

// SMTECH
{
  const html = await fetchHtml(
    "https://www.smtech.go.kr/front/ifg/no/notice02_list.do?searchKeyword=AI"
  );
  console.log(
    "SMTECH patterns:",
    "notice02_detail",
    html.includes("notice02_detail"),
    "ancmId",
    html.includes("ancmId"),
    "fn_",
    (html.match(/fn_[a-zA-Z]+\(/g) || []).slice(0, 5)
  );
  const idx = html.indexOf("AI");
  if (idx > 0) console.log("SMTECH AI context:", html.slice(idx - 200, idx + 300));
}

// MSIT
{
  const html = await fetchHtml(
    "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311&searchOption=title&searchWord=AI"
  );
  const m = html.match(/fn_detail\(3186785\)[\s\S]{0,500}/);
  console.log("MSIT fn_detail context:", m?.[0]?.slice(0, 400));
}

// MOHW
{
  const html = await fetchHtml(
    "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01&search_type=title&search_text=AI"
  );
  const m = html.match(/txt_title[\s\S]{0,400}/);
  console.log("MOHW title context:", m?.[0]?.slice(0, 400));
}
