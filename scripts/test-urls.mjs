const urls = [
  "https://www.iris.go.kr/contents/retrieveBsnsAncmView.do?ancmId=022474",
  "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do?ancmId=022474",
];

for (const url of urls) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const t = await r.text();
  console.log(url, r.status, t.includes("022474"), t.includes("조선해양"));
}

const smUrl =
  "https://www.smtech.go.kr/front/ifg/no/notice02_detail.do?buclYy=&ancmId=S02867&buclCd=S9171&dtlAncmSn=1&schdSe=MO5005&aplySn=1&pageIndex=1";
const sm = await fetch(smUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
const smText = await sm.text();
console.log("SMTECH", sm.status, smText.includes("S02867"), smText.slice(0, 150));
