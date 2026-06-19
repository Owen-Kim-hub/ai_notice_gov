const headers = { "User-Agent": "Mozilla/5.0" };

const getRes = await fetch("https://www.smtech.go.kr/front/ifg/no/notice02_list.do", { headers });
const getHtml = await getRes.text();
const cookie = getRes.headers.getSetCookie?.()?.join("; ") || "";
console.log("GET status", getRes.status, "cookie len", cookie.length, "detail in GET", getHtml.includes("notice02_detail"));

const body = new URLSearchParams({
  searchCondition: "title",
  searchKeyword: "AI",
  pageIndex: "1",
});
const postRes = await fetch("https://www.smtech.go.kr/front/ifg/no/notice02_list.do", {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie },
  body,
});
const postHtml = await postRes.text();
console.log("POST detail", postHtml.includes("notice02_detail"), "board", postHtml.includes('class="board"'));
const links = [...postHtml.matchAll(/href="([^"]*notice02_detail[^"]*)"[^>]*class="board"[^>]*>([\s\S]*?)<\/a>/gi)].slice(0, 5);
console.log("items", links.map((m) => [m[2].replace(/<[^>]+>/g, "").trim().slice(0, 60), m[1].slice(0, 80)]));
