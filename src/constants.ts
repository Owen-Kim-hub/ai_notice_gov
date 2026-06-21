export interface PortalListItem {
  rank: number;
  name: string;
  url: string;
}

export const PORTALS_LIST: PortalListItem[] = [
  { rank: 1, name: "범부처통합연구지원시스템 (IRIS, 접수중)", url: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do?ancmPrg=ancmIng" },
  { rank: 2, name: "국가과학기술지식정보서비스 (NTIS)", url: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do" },
  { rank: 3, name: "한국산업기술기획평가원 (KEIT)", url: "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmListView.do?prgmId=XPG201040000" },
  { rank: 4, name: "한국산업기술진흥원 (KIAT)", url: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90" },
  { rank: 5, name: "중소기업 기술개발사업 종합관리시스템 (smtech)", url: "https://www.smtech.go.kr/front/ifg/no/notice02_list.do" },
  { rank: 6, name: "범부처전주기의료기기연구개발사업단", url: "https://kmdf.org/official" },
  { rank: 7, name: "산업통상자원부", url: "https://www.motir.go.kr/kor/article/ATCL2826a2625" },
  { rank: 8, name: "중소벤처기업부", url: "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310" },
  { rank: 9, name: "보건복지부", url: "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01" },
  { rank: 10, name: "과학기술정보통신부", url: "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311" },
  { rank: 11, name: "보건의료기술 종합정보시스템 (HTDream)", url: "https://www.htdream.kr/main/pubAmt/PubAmtList.do" },
  { rank: 12, name: "연구개발특구", url: "https://www.innopolis.or.kr/newBusiness?menuId=MENU01028" },
  { rank: 13, name: "지역산업진흥원", url: "https://www.riis.or.kr/html/pbanc/pbancList.do" },
  { rank: 14, name: "범부처통합연구지원시스템 (IRIS, 접수예정)(공고추출 제외)", url: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do?ancmPrg=ancmPre" },
  { rank: 15, name: "한국보건산업진흥원 (KHIDI) (공고추출 제외)", url: "https://www.khidi.or.kr/board?menuId=MENU01108" },
  { rank: 16, name: "의료기기산업 종합정보시스템 (공고추출 제외)", url: "https://www.khidi.or.kr/board?menuId=MENU01484&siteId=SITE00039" }
];

export const RESULTS_PAGE_SIZE = 15;
export const KEYWORD_FIELD_COUNT = 3;

/** 기본 수집 기간(종료일 기준으로 며칠 이전부터) */
export const DEFAULT_RANGE_DAYS = 15;
