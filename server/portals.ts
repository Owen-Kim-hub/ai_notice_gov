export interface ScrapedAnnouncement {
  title: string;
  portal: string;
  url: string;
  date: string;
  department: string;
  description: string;
}

export interface PortalDefinition {
  name: string;
  domains: string[];
  listUrl: string;
  department: string;
}

// 우선순위 순서. 낮은 인덱스일수록 중복 제거 시 우선 보존된다.
// khidi.or.kr 두 포털(한국보건산업진흥원·의료기기산업 종합정보시스템)은 Vercel 클라우드
// IP를 시간대별로 차단(간헐적 전면 실패)하여 안정 수집이 불가능하므로 제외한다.
// 재검증(2026-06-21)에서도 같은 시간 10/10 성공→다른 시간 0/10 실패로 불안정 확인.
export const PORTALS: PortalDefinition[] = [
  {
    name: "범부처통합연구지원시스템 (IRIS, 접수중)",
    domains: ["iris.go.kr"],
    listUrl: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do?ancmPrg=ancmIng",
    department: "과학기술정보통신부",
  },
  {
    name: "범부처통합연구지원시스템 (IRIS, 접수예정)",
    domains: ["iris.go.kr"],
    listUrl: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do?ancmPrg=ancmPre",
    department: "과학기술정보통신부",
  },
  {
    name: "국가과학기술지식정보서비스 (NTIS)",
    domains: ["ntis.go.kr"],
    listUrl: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do",
    department: "과학기술정보통신부",
  },
  {
    name: "한국산업기술기획평가원 (KEIT)",
    domains: ["keit.re.kr", "srome.keit.re.kr"],
    listUrl: "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmListView.do?prgmId=XPG201040000",
    department: "산업통상자원부",
  },
  {
    name: "한국산업기술진흥원 (KIAT)",
    domains: ["kiat.or.kr"],
    listUrl: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90",
    department: "산업통상자원부",
  },
  {
    name: "중소기업 기술개발사업 종합관리시스템 (smtech)",
    domains: ["smtech.go.kr"],
    listUrl: "https://www.smtech.go.kr/front/ifg/no/notice02_list.do",
    department: "중소벤처기업부",
  },
  {
    name: "범부처전주기의료기기연구개발사업단",
    domains: ["kmdf.org"],
    listUrl: "https://kmdf.org/official",
    department: "보건복지부",
  },
  {
    name: "산업통상자원부",
    domains: ["motir.go.kr", "motie.go.kr"],
    listUrl: "https://www.motir.go.kr/kor/article/ATCL2826a2625",
    department: "산업통상자원부",
  },
  {
    name: "중소벤처기업부",
    domains: ["mss.go.kr"],
    listUrl: "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310",
    department: "중소벤처기업부",
  },
  {
    name: "보건복지부",
    domains: ["mohw.go.kr"],
    listUrl: "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01",
    department: "보건복지부",
  },
  {
    name: "과학기술정보통신부",
    domains: ["msit.go.kr"],
    listUrl: "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311",
    department: "과학기술정보통신부",
  },
  {
    name: "보건의료기술 종합정보시스템 (HTDream)",
    domains: ["htdream.kr"],
    listUrl: "https://www.htdream.kr/main/pubAmt/PubAmtList.do",
    department: "보건복지부",
  },
  {
    name: "연구개발특구",
    domains: ["innopolis.or.kr"],
    listUrl: "https://www.innopolis.or.kr/newBusiness?menuId=MENU01028",
    department: "연구개발특구진흥재단",
  },
  {
    name: "강원지역산업진흥원",
    domains: ["riis.or.kr"],
    listUrl: "https://www.riis.or.kr/html/pbanc/pbancList.do",
    department: "강원지역산업진흥원",
  },
];
