const html = await (
  await fetch("https://www.smtech.go.kr/front/ifg/no/notice02_list.do", {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
).text();

const pattern =
  /<a href="([^"]*notice02_detail\.do[^"]*)"[^>]*class="board"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<td[^>]*>([\d.]+)<\/td>/gi;
let m;
let n = 0;
while ((m = pattern.exec(html)) !== null) {
  const title = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (/ai|인공/i.test(title)) {
    console.log("AI", title.slice(0, 80), m[3]);
    n++;
  }
}
console.log("AI count", n, "total detail links", [...html.matchAll(/notice02_detail/g)].length);
