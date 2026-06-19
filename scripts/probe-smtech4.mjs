for (let page = 1; page <= 5; page++) {
  const url = `https://www.smtech.go.kr/front/ifg/no/notice02_list.do?pageIndex=${page}`;
  const html = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();
  const count = [...html.matchAll(/notice02_detail/g)].length;
  const ai = [...html.matchAll(/class="board"[^>]*>([\s\S]*?)<\/a>/gi)].filter((m) =>
    /ai|인공/i.test(m[1])
  );
  console.log("page", page, "details", count, "ai titles", ai.length, ai[0]?.[1]?.replace(/<[^>]+>/g, "").slice(0, 60));
}
