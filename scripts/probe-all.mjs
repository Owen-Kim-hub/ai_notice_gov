import fs from "fs";

const PORTALS = [
  ["ntis", "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do?searchKeyword=AI"],
  ["msit", "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311&searchOption=title&searchWord=AI"],
  ["kiat", "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90&searchKeyword=AI"],
  ["khidi", "https://www.khidi.or.kr/board?menuId=MENU01108&searchKeyword=AI"],
  ["keit", "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmListView.do?prgmId=XPG201040000&searchKeyword=AI"],
  ["mohw", "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01&search_type=title&search_text=AI"],
  ["mss", "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310&searchKey=title&searchVal=AI"],
  ["htdream", "https://www.htdream.kr/main/pubAmt/PubAmtList.do?searchCondition=1&searchKeyword=AI"],
];

for (const [name, url] of PORTALS) {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ko-KR,ko;q=0.9" },
      redirect: "follow",
    });
    const html = await r.text();
    fs.writeFileSync(`scripts/sample-${name}.html`, html);
    const hasAi = /AI|인공지능/i.test(html);
    const linkCount = (html.match(/href=/gi) || []).length;
    console.log(name, r.status, html.length, "AI?", hasAi, "links", linkCount);
  } catch (e) {
    console.log(name, "ERR", e.message);
  }
}
