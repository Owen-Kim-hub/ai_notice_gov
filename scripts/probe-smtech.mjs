async function trySmtech() {
  const body = new URLSearchParams({
    searchCondition: "title",
    searchKeyword: "AI",
    pageIndex: "1",
  });
  const r = await fetch("https://www.smtech.go.kr/front/ifg/no/notice02_list.do", {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const html = await r.text();
  console.log("POST len", html.length, "detail", html.includes("notice02_detail"), "board", html.includes('class="board"'));
  const m = [...html.matchAll(/notice02_detail\.do[^"]+/g)].slice(0, 3);
  console.log("links", m.map((x) => x[0].slice(0, 120)));
}

await trySmtech();
