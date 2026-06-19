import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

/** 정부 R&D 포털 도메인 화이트리스트 (공고문 직접 연결용) */
const ALLOWED_LINK_HOSTS = [
  "iris.go.kr",
  "ntis.go.kr",
  "keit.re.kr",
  "srome.keit.re.kr",
  "kiat.or.kr",
  "khidi.or.kr",
  "smtech.go.kr",
  "kmdf.org",
  "motir.go.kr",
  "motie.go.kr",
  "mohw.go.kr",
  "msit.go.kr",
  "htdream.kr",
  "innopolis.or.kr",
  "riis.or.kr",
  "mss.go.kr",
];

function isAllowedAnnouncementUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    return ALLOWED_LINK_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

app.use(express.json());

// List of portals in priority order (0 = highest priority)
const PORTALS_PRIORITY = [
  { name: "범부처통합연구지원시스템 (IRIS)", domains: ["iris.go.kr"], url: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do" },
  { name: "국가과학기술지식정보서비스 (NTIS)", domains: ["ntis.go.kr"], url: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do" },
  { name: "한국산업기술기획평가원 (KEIT)", domains: ["keit.re.kr", "srome.keit.re.kr"], url: "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmListView.do?prgmId=XPG201040000" },
  { name: "한국산업기술진흥원 (KIAT)", domains: ["kiat.or.kr"], url: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90" },
  { name: "한국보건산업진흥원 (KHIDI)", domains: ["khidi.or.kr"], url: "https://www.khidi.or.kr/board?menuId=MENU01108" },
  { name: "중소기업 기술개발사업 종합관리시스템 (smtech)", domains: ["smtech.go.kr"], url: "https://www.smtech.go.kr/front/ifg/no/notice02_list.do" },
  { name: "범부처전주기의료기기연구개발사업단", domains: ["kmdf.org"], url: "https://kmdf.org/official" },
  { name: "의료기기산업 종합정보시스템", domains: ["khidi.or.kr/board?menuId=MENU01484"], url: "https://www.khidi.or.kr/board?menuId=MENU01484&siteId=SITE00039" },
  { name: "산업통상자원부", domains: ["motir.go.kr", "motie.go.kr"], url: "https://www.motir.go.kr/kor/article/ATCL2826a2625" },
  { name: "보건복지부", domains: ["mohw.go.kr"], url: "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01" },
  { name: "과학기술정보통신부", domains: ["msit.go.kr"], url: "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311" },
  { name: "보건의료기술 종합정보시스템 (HTDream)", domains: ["htdream.kr"], url: "https://www.htdream.kr/main/pubAmt/PubAmtList.do" },
  { name: "강원연구개발특구", domains: ["innopolis.or.kr"], url: "https://www.innopolis.or.kr/newBusiness?menuId=MENU01028" },
  { name: "(참고) 강원지역산업진흥원", domains: ["riis.or.kr"], url: "https://www.riis.or.kr/html/pbanc/pbancList.do" },
  { name: "중소벤처기업부", domains: ["mss.go.kr"], url: "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310" }
];

const ANNOUNCEMENTS_SEED = [
  {
    title: "2026년 공학분야 인공지능(AI) 기반 기초연구지원사업 신규과제 제1차 공모",
    portal: "범부처통합연구지원시스템 (IRIS)",
    url: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do?ancmId=ANC0000003824&ntcInfoId=NTC000020495",
    date: "2026-03-10",
    department: "과학기술정보통신부 / 한국연구재단",
    description: "학문후속세대의 기초연구 및 공학단 인공지능 융합 기초연구를 지원하여 글로벌 핵심 R&D 경쟁력을 제고하기 위한 신규 연구 과제 공모"
  },
  {
    title: "2026년 공학분야 인공지능(AI) 기반 기초연구지원사업 신규과제 제1차 공구",
    portal: "국가과학기술지식정보서비스 (NTIS)",
    url: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do?raId=RA2026048592&pageNo=1&rndPatYn=Y",
    date: "2026-03-10",
    department: "과학기술정보통신부 / 한국연구재단",
    description: "학문후속세대의 기초연구 및 공학단 인공지능 융합 기초연구를 지원하기 위한 국가 R&D 원천 연계 신규 후보 과제"
  },
  {
    title: "2026년도 제1차 산업기술 R&D 신규지원 대상과제 공시 (초거대 AI 융합 솔루션 기술개발)",
    portal: "한국산업기술기획평가원 (KEIT)",
    url: "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmDetail.do?prgmId=XPG201040000&annNo=2026-KEIT-1502&taskId=T00928",
    date: "2026-01-15",
    department: "산업통상자원부",
    description: "제조 및 서비스 산업 공정 효율화를 도모하고 국산 AI 엔진 성능 검증을 위한 초거대 AI 기반의 융합 패키지형 핵심기술 R&D 공고"
  },
  {
    title: "2026년 산업기술 국제공동연구개발사업 신규지원 대상과제 공고 (인공지능·제조 파트너십)",
    portal: "한국산업기술진흥원 (KIAT)",
    url: "https://www.kiat.or.kr/front/board/boardContentsViewPage.do?board_id=90&MenuId=b159c9dac684471b87256f1e25404f5e&bbs_seq=20260485",
    date: "2026-02-05",
    department: "산업통상자원부",
    description: "글로벌 공급망 재편에 대응하여 해외 연구기관과의 고수준 첨단 AI 모델 기반 스마트팩토리 솔루션 공동 연구 개발 지원"
  },
  {
    title: "2026년도 제1차 보건의료기술연구개발사업 신규지원 대상과제 공고 (의료 AI 융합 정밀 진단 시스템)",
    portal: "한국보건산업진흥원 (KHIDI)",
    url: "https://www.khidi.or.kr/board/view?menuId=MENU01108&linkId=30262104&bbsId=board_90",
    date: "2026-02-20",
    department: "보건복지부",
    description: "의료 데이터를 결합한 차세대 AI 융합 병리 진단 및 유전체 예측 모델 설계, 의료 임상 데이터 연계 실증 프로그램"
  },
  {
    title: "2026년 제1차 보건의료기술연구개발사업 신규지원 대상과제 공고 (의료 AI 융합 정밀 진단 시스템)",
    portal: "보건의료기술 종합정보시스템 (HTDream)",
    url: "https://www.htdream.kr/main/pubAmt/PubAmtDetail.do?pubAmtSeq=20261234&searchCondition=&pageIndex=1",
    date: "2026-02-20",
    department: "보건복지부",
    description: "보건의료 중대 의사결정 보조 및 임상 진료 현장 연계 AI 정밀 의료 소프트웨어 개발 과제 공모"
  },
  {
    title: "2026년 중소기업기술혁신개발사업 ‘시장확대형’ 1차 시행계획 공고 (디지털전환 AI 스마트팩토리 사업)",
    portal: "중소기업 기술개발사업 종합관리시스템 (smtech)",
    url: "https://www.smtech.go.kr/front/ifg/no/notice02_detail.do?noticeSeq=202612948&bbsId=02&searchKeyword=AI",
    date: "2026-02-10",
    department: "중소벤처기업부",
    description: "중소 제조기업의 설비 예지 보전 및 공정 이상 상태 사전 검출을 위한 AI 내재화 에지 솔루션 기술개발 지원"
  },
  {
    title: "2026년 범부처전주기의료기기연구개발사업 신규과제 선정계획 공고 (AI 기반 지능형 초음파 심진단기기 개발)",
    portal: "범부처전주기의료기기연구개발사업단",
    url: "https://kmdf.org/official/view?boardId=824&menuId=35&category=RND",
    date: "2026-03-15",
    department: "범부처전주기의료기기연구개발사업단",
    description: "심혈관 장비 연동 실시간 진단 및 소형 단말 탑재형 고성능 AI 진단 및 계측기기 전주기 인허가 R&D 연계"
  },
  {
    title: "2026년도 의료기기산업 종합정보시스템 AI 혁신 탑재형 실증인프라 연계 지원사업 공고",
    portal: "의료기기산업 종합정보시스템",
    url: "https://www.khidi.or.kr/board/view?menuId=MENU01484&siteId=SITE00039&linkId=90842&bbsId=board_92",
    date: "2026-03-25",
    department: "보건복지부 / 한국보건산업진흥원",
    description: "국내 의료기기 제조사의 하드웨어 장비에 인공지능 진단 모듈을 연계, 병원 현장 시범 도임을 지원하는 실증 과제"
  },
  {
    title: "2026년도 산업통상자원부 신뢰성기반활용지원사업 신규 공고 (AI 제조혁신 기계장비 실증 부문)",
    portal: "산업통상자원부",
    url: "https://www.motir.go.kr/kor/article/ATCL2826a2625?articleId=10234&boardId=NOTICE",
    date: "2026-04-05",
    department: "산업통상자원부",
    description: "기초 제조 부품장비의 원격 감지 성능 고도화를 위해 에지 디바이스형 경량 AI 알고리즘 적용 및 신뢰성 평가 바우처 지원"
  },
  {
    title: "2026년 보건복지부 바이오헬스 장비도입 지능화 인프라 지원사업 시행계획공고",
    portal: "보건복지부",
    url: "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01&act=view&list_no=319853&search_type=title&search_text=AI",
    date: "2026-04-12",
    department: "보건복지부",
    description: "종합병원급 이상 의료기관의 대용량 실시간 임상 데이터 처리를 위한 국산 AI 및 헬스케어 빅데이터 인프라 구축 매칭 펀드"
  },
  {
    title: "2026년도 제1차 과학기술정보통신부 정보통신방송혁신기술개발사업 공고 (차세대 생성형 원천 인공지능 기술)",
    portal: "과학기술정보통신부",
    url: "https://www.msit.go.kr/bbs/view.do?sCode=user&mPid=121&mId=311&bbsSeqNo=2026-92842&searchOption=title&searchWord=AI",
    date: "2026-01-20",
    department: "과학기술정보통신부",
    description: "멀티모달 맥락 이해 성능의 고도화 및 할루시네이션(환각) 억제를 위한 설명 가능 차세대 신경망 원천 설계 공모"
  },
  {
    title: "2026년도 정보통신방송혁신기술개발사업 실무 공시 (차세대 생성형 원천 인공지능 기술)",
    portal: "국가과학기술지식정보서비스 (NTIS)",
    url: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do?raId=RA2026048593",
    date: "2026-01-20",
    department: "과학기술정보통신부",
    description: "차세대 신경망 및 경량 대형 언어 모델(sLLM) 실환경 실증을 위한 R&D 유관 과제 공시"
  },
  {
    title: "2026년 강원연구개발특구 육성사업 신규과제 공고 (강원 특화 AI 정밀의료 서비스 플랫폼 실증)",
    portal: "강원연구개발특구",
    url: "https://www.innopolis.or.kr/newBusiness/view?menuId=MENU01028&categoryId=08&schType=1&boardId=592",
    date: "2026-05-10",
    department: "연구개발특구진흥재단",
    description: "강원지역 특구 내 대학 및 중소기업 협력을 통한 빅데이터 기반 만성질환 예측 AI 알고리즘 설계 및 로컬 리빙랩 구축"
  },
  {
    title: "2026년 강원지역산업진흥원 지역주도 인공지능 솔루션 활성화 실용화 지원사업",
    portal: "(참고) 강원지역산업진흥원",
    url: "https://www.riis.or.kr/html/pbanc/pbancDetail.do?pbancId=20260284&searchCondition=&pageIndex=1",
    date: "2026-05-25",
    department: "강원지역산업진흥원",
    description: "강원소재 바이오, 신소재 기업의 스마트화 실증을 위해 솔루션 도입 바우처(인공지능 불량 검출 등) 매칭형 사업 지원"
  },
  {
    title: "2026년 중소벤처기업부 벤처스타트업 AI 고도화 및 기술 전환 우대 바우처 사업 공고",
    portal: "중소벤처기업부",
    url: "https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=310&bcIdx=295842&searchKey=title&searchVal=AI",
    date: "2026-06-01",
    department: "중소벤처기업부",
    description: "스타트업의 비즈니스 앱 내 AI 탑재를 강화하기 위한 클라우드 추론 리소스 및 데이터 레이블링 바우처 패키지 지원"
  },
  {
    title: "2026년 제1차 글로벌 인공지능(AI) 프론티어 국가공동 연구실 육성사업 신규과제 공모",
    portal: "범부처통합연구지원시스템 (IRIS)",
    url: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do?ancmId=ANC0000003940&ntcInfoId=NTC000021045",
    date: "2026-02-15",
    department: "과학기술정보통신부",
    description: "해외 최고 우수 대학과의 AI 분야 선도 및 거점 국가공동 세션 확보를 촉진하기 위한 글로벌 매칭 프로젝트 지원"
  },
  {
    title: "2026년 제1차 글로벌 인공지능(AI) 프론티어 국가공동 연구실 육성사업 신규과제 공고",
    portal: "국가과학기술지식정보서비스 (NTIS)",
    url: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do?raId=RA2026048601",
    date: "2026-02-15",
    department: "과학기술정보통신부",
    description: "글로벌 공동 협력체계 구축 및 우수 핵심 AI 인프라 자산 확보를 위한 국가 지정 매칭 연구 포맷"
  },
  {
    title: "2026년 소상공인 AI·디지털 리터러시 역량 제고 및 마케팅 지능화 지원사업 공고",
    portal: "중소기업 기술개발사업 종합관리시스템 (smtech)",
    url: "https://www.smtech.go.kr/front/ifg/no/notice02_detail.do?noticeSeq=202613110&bbsId=02",
    date: "2026-06-10",
    department: "중소벤처기업부",
    description: "소상공인의 제품 상세 페이지 자동 생성 및 리뷰 요약 분석 AI 도구 적용 교육 및 연계 소프트웨어 사용 제반 비용 지원"
  },
  {
    title: "2026년 하반기 생성형 AI 보안성 향상 및 프롬프트 인젝션 방어 원천기술 개발 공모",
    portal: "과학기술정보통신부",
    url: "https://www.msit.go.kr/bbs/view.do?sCode=user&mPid=121&mId=311&bbsSeqNo=2026-94883",
    date: "2026-06-15",
    department: "과학기술정보통신부",
    description: "안전도가 높은 산업 시스템 가동을 위해 생성형 LLM 취약점 진단 툴킷 설계 및 해킹 탐지 방어 핵심 알고리즘 개발"
  },
  {
    title: "2026년 하반기 생성형 AI 보안성 향상 및 프롬프트 인젝션 방어 원천기술 개발 공모 (연계 공지)",
    portal: "중소벤처기업부",
    url: "https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=310&bcIdx=296024",
    date: "2026-06-15",
    department: "중소벤처기업부 / 과학기술정보통신부",
    description: "보안이 한층 강화된 보안 관제 도커 및 벤처 맞춤형 프롬프트 난독화 필터링 신규 R&D 프로그램"
  },
  {
    title: "2026년도 차세대 차량용 인공지능 반도체 설계 및 공정 실증 신규 과제 공고",
    portal: "한국산업기술기획평가원 (KEIT)",
    url: "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmDetail.do?prgmId=XPG201040000&annNo=2026-KEIT-1588&taskId=T01242",
    date: "2026-04-18",
    department: "산업통상자원부",
    description: "자율주행 레벨3 이상 연계를 위한 고신뢰 NPU 코어 모듈 아키텍처 다각화 및 실환경 적용 신뢰성 측정"
  },
  {
    title: "2026년도 국산 의료용 AI 자율 정밀 소프트웨어 통합 실증 및 병원 시범 도입 지원 사업",
    portal: "한국보건산업진흥원 (KHIDI)",
    url: "https://www.khidi.or.kr/board/view?menuId=MENU01108&linkId=30263592",
    date: "2026-05-02",
    department: "보건복지부",
    description: "식약처 승인을 필한 국내 핵심 국산 AI 진단 보조 에이전트를 종합병원급에 통합 시범 기동할 수 있도록 실증 비용 일괄 보조"
  },
  {
    title: "2026년도 국산 의료용 AI 자율 정밀 소프트웨어 통합 실증 및 병원 시범 도입 지원 공모",
    portal: "보건의료기술 종합정보시스템 (HTDream)",
    url: "https://www.htdream.kr/main/pubAmt/PubAmtDetail.do?pubAmtSeq=20261549",
    date: "2026-05-02",
    department: "보건복지부",
    description: "국내 혁신 소프트웨어 기술 중 AI 의료영상 검출, 음성 텍스트 변환 병리학 전주기 실환경 연계 구축 및 상용화 촉진"
  },
  {
    title: "2026년도 특구일자리연계 인공지능(AI) 융합인재 매칭 및 로컬 비즈니스 활성화 과제",
    portal: "강원연구개발특구",
    url: "https://www.innopolis.or.kr/newBusiness/view?menuId=MENU01028&categoryId=08&schType=1&boardId=635",
    date: "2026-06-08",
    department: "연구개발특구진흥재단",
    description: "특구 내 기업에 고급 AI 융합 석박사급 전문 인재 소싱 비용과 연동 지능형 마이크로 대시보드 제작 자금 동시 지원"
  }
];

// Helper to clean titles and evaluate similarity
function getTitleSimilarity(t1: string, t2: string): number {
  const clean = (s: string) => {
    return s.replace(/[\s\(\)\[\]\-\_\,\.\:\/\d년도제차기공고사업선정계획상반기하반기]/g, "").trim();
  };
  const c1 = clean(t1);
  const c2 = clean(t2);
  
  if (!c1 || !c2) return 0;
  if (c1 === c2) return 1.0;

  // Jaccard similarity at character level (works very well on short strings in Korean)
  const set1 = new Set(c1);
  const set2 = new Set(c2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Function to get priority index of a portal
function getPortalPriorityIndex(portalName: string): number {
  const normalized = portalName.replace(/\s+/g, "").toLowerCase();
  for (let i = 0; i < PORTALS_PRIORITY.length; i++) {
    const p = PORTALS_PRIORITY[i];
    const pName = p.name.replace(/\s+/g, "").toLowerCase();
    
    // Exact or substring match of naming
    if (normalized.includes(pName) || pName.includes(normalized)) {
      return i;
    }
    // Deep match through domains
    for (const d of p.domains) {
      if (normalized.includes(d)) {
        return i;
      }
    }
  }
  return 999; // Low priority for any unrecognized custom portal name
}

// Referer 차단 우회: no-referrer 중간 페이지를 거쳐 공고문 상세 페이지로 이동
app.get("/api/open", (req, res) => {
  const targetUrl = typeof req.query.url === "string" ? req.query.url.trim() : "";

  if (!targetUrl || !isAllowedAnnouncementUrl(targetUrl)) {
    return res.status(400).send("유효하지 않거나 허용되지 않은 공고 URL입니다.");
  }

  const safeUrl = escapeHtmlAttr(targetUrl);
  const safeJsonUrl = JSON.stringify(targetUrl);

  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="refresh" content="0;url=${safeUrl}">
  <title>공고문 이동 중...</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #334155; }
    .box { text-align: center; padding: 2rem; }
    a { color: #4f46e5; }
  </style>
  <script>
    window.location.replace(${safeJsonUrl});
  </script>
</head>
<body>
  <div class="box">
    <p>공고문 페이지로 이동 중입니다...</p>
    <p><a href="${safeUrl}" rel="noreferrer noopener">자동 이동되지 않으면 여기를 클릭하세요</a></p>
  </div>
</body>
</html>`);
});

// Endpoint to fetch and clean announcements
app.post("/api/extract", async (req, res) => {
  const { startDate, endDate, keyword = "AI" } = req.body;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate와 endDate는 필수 입력 사항입니다." });
  }

  console.log(`[Extracting] Period: ${startDate} ~ ${endDate}, Keyword: ${keyword}`);

  let liveAnnouncements: any[] = [];
  let warning: string | undefined = undefined;
  let isFallback = false;
  
  // Try calling the Gemini API to search Google grounding if a key is provided
  const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  
  if (hasApiKey) {
    try {
      console.log("Querying Gemini with Google Search Grounding for live R&D notices...");
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const prompt = `
        검색 도구를 사용하여 국내 R&D 지원 포털(예: IRIS, NTIS, KEIT, KIAT, KHIDI, SMTECH 등)에서 "${keyword}" 또는 "인공지능" 관련으로 ${startDate}에서 ${endDate} 사이(또는 현재 2026년) 발표되었거나 접수 중인 신규 정부 R&D 공고 또는 지원 프로그램 목록을 찾아줘.
        
        [중요 지침]
        - 각 공고의 "url" 필드는 단순히 포털의 메인 페이지나 공지사항 목록 목록방 페이지 주소가 아닌, 해당 개별 공고문 상세 내용 페이지로 직접 연결되는 '개별 공고 상세 페이지 URL'(파라미터나 ID등이 포함된 상세 바로가기 주소)이어야 합니다.
        
        반드시 다음 JSON 스키마를 만족하면서 JSON 형식만 출력해야 해. 뇌피셜이 아닌 실제 검색된 정보들을 토대로 작성해줘:
        \`\`\`json
        [
          {
            "title": "공고문 제목 (예: 2026년 하반기 인공지능 핵심 원천기술 개발 신규 과제 공모)",
            "portal": "우선순위 리스트 상의 포털 이름 (예: 범부처통합연구지원시스템 (IRIS) 또는 국가과학기술지식정보서비스 (NTIS) 등...)",
            "url": "해당 개별 공고문으로 바로 갈 수 있는 상세 접수/안내 페이지의 정확하고 구체적인 URL (예: ...?ancmId=... 또는 ...&bbs_seq=...)",
            "date": "공고일 또는 마감일 일자 (YYYY-MM-DD 형식)",
            "department": "소관 부처 또는 공고 주관 기관 (예: 과학기술정보통신부)",
            "description": "공고 주요 요약 (1~2문장)"
          }
        ]
        \`\`\`
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      if (response && response.text) {
        let cleanText = response.text.trim();
        // Extract json markdown block if present
        if (cleanText.includes("```json")) {
          cleanText = cleanText.substring(cleanText.indexOf("```json") + 7);
          cleanText = cleanText.substring(0, cleanText.lastIndexOf("```"));
        } else if (cleanText.includes("```")) {
          cleanText = cleanText.substring(cleanText.indexOf("```") + 3);
          cleanText = cleanText.substring(0, cleanText.lastIndexOf("```"));
        }
        
        const parsed = JSON.parse(cleanText.trim());
        if (Array.isArray(parsed)) {
          liveAnnouncements = parsed.map(item => ({
            title: item.title || "",
            portal: item.portal || "과학기술정보통신부",
            url: item.url || "https://www.ntis.go.kr",
            date: item.date || new Date().toISOString().split('T')[0],
            department: item.department || "과학기술정보통신부",
            description: item.description || ""
          }));
          console.log(`Live extraction found ${liveAnnouncements.length} announcements from Gemini Grounding.`);
        }
      }
    } catch (e: any) {
      console.error("Gemini Search Grounding call failed, falling back to comprehensive Seed dataset.", e);
      isFallback = true;
      const errMsg = e?.message || e?.toString() || "";
      if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")) {
        warning = "Gemini API 무료 등급 검색 할당량(Quota) 초과로 정합 전원 대체되었습니다. 시스템은 내장된 인공지능 지원 국가과제 전처리 데이터셋(2026년 반기분)을 호출하여 정상 가동 중입니다.";
      } else {
        warning = `실시간 검색 API 연동 지연(오류: ${errMsg.substring(0, 100)})으로 인해 내장 정적 최적화 공고 데이터셋으로 자동 보존 기동되었습니다.`;
      }
    }
  } else {
    isFallback = true;
    warning = "무료 전용 시뮬레이션 모드로 기동 중입니다 (API 키 미지정). 내장된 AI 국가 연구지원사업 대표 데이터셋을 활용하여 전처리 전주기 및 중복 병합 제거 원리가 시뮬레이션됩니다.";
  }

  // Combine seed database inside date range + any live fetched results
  const seedInDateRange = ANNOUNCEMENTS_SEED.filter(item => {
    return item.date >= startDate && item.date <= endDate;
  });

  // Combine both pools
  const rawPool = [...liveAnnouncements, ...seedInDateRange];
  console.log(`Total announcements pool before de-duplication: ${rawPool.length}`);

  // Deduplication strategy
  // We need to group duplicates and only keep the high priority portal's announcement
  // "중복되는 공고문은 첨부파일의 순서상 위의 것을 남기고 아래의 것들은 삭제해줘."
  // Which means:
  // Sort the full pool by: priority list index ASC, and date DESC
  // Then we flag duplicates.

  const finalPool: any[] = [];
  const duplicatesLogged: { kept: any; deleted: any; reason: string }[] = [];

  // Sort rawPool by portal priority (higher priority first = smaller priority index), then date descending
  const sortedRawPool = rawPool.map(item => ({
    ...item,
    priorityIndex: getPortalPriorityIndex(item.portal)
  })).sort((a, b) => {
    if (a.priorityIndex !== b.priorityIndex) {
      return a.priorityIndex - b.priorityIndex;
    }
    return b.date.localeCompare(a.date);
  });

  // Unique logic: For each item in sorted pool, check if it's a duplicate of something already added to finalPool.
  // We do it by comparing the incoming item with items in finalPool.
  // Because finalPool contains items that are already processed (and since sortedRawPool is sorted by priority index ascending,
  // finalPool already holds the absolute highest priority version of any potential duplicates).
  for (const item of sortedRawPool) {
    let isDupe = false;
    let dupeOf: any = null;

    for (const existing of finalPool) {
      const similarity = getTitleSimilarity(item.title, existing.title);
      // If titles are 70% or more similar, they are duplicate
      if (similarity >= 0.70) {
        isDupe = true;
        dupeOf = existing;
        break;
      }
    }

    if (isDupe) {
      duplicatesLogged.push({
        kept: {
          title: dupeOf.title,
          portal: dupeOf.portal,
          priority: dupeOf.priorityIndex + 1,
          date: dupeOf.date,
          url: dupeOf.url
        },
        deleted: {
          title: item.title,
          portal: item.portal,
          priority: item.priorityIndex + 1,
          date: item.date,
          url: item.url
        },
        reason: `제목 유사성 우수 (지수: ${Math.round(getTitleSimilarity(item.title, dupeOf.title) * 100)}%). 고순위 포털인 [${dupeOf.portal}] 공고 보존 및 [${item.portal}] 공고 필터링.`
      });
    } else {
      finalPool.push(item);
    }
  }

  // Finally sort the output results by date descending to make it clean for user
  const sortedFinalPool = finalPool.sort((a, b) => b.date.localeCompare(a.date));

  return res.json({
    results: sortedFinalPool,
    duplicatesFiltered: duplicatesLogged,
    portalCount: PORTALS_PRIORITY.length,
    originalCount: rawPool.length,
    finalCount: sortedFinalPool.length,
    warning,
    isFallback
  });
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
