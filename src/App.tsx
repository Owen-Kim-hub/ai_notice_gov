import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Calendar, 
  Search, 
  Download, 
  CheckCircle, 
  ExternalLink, 
  FileSpreadsheet, 
  Info, 
  AlertCircle, 
  RefreshCw, 
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Sparkles,
  Copy,
  Check
} from "lucide-react";
import { Announcement, DeduplicationRecord, ExtractResponse } from "./types";
import { getAnnouncementOpenLink } from "./utils/openLink";

const PORTALS_LIST = [
  { rank: 1, name: "범부처통합연구지원시스템 (IRIS)", url: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do" },
  { rank: 2, name: "국가과학기술지식정보서비스 (NTIS)", url: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do" },
  { rank: 3, name: "한국산업기술기획평가원 (KEIT)", url: "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmListView.do?prgmId=XPG201040000" },
  { rank: 4, name: "한국산업기술진흥원 (KIAT)", url: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90" },
  { rank: 5, name: "한국보건산업진흥원 (KHIDI)", url: "https://www.khidi.or.kr/board?menuId=MENU01108" },
  { rank: 6, name: "중소기업 기술개발사업 종합관리시스템 (smtech)", url: "https://www.smtech.go.kr/front/ifg/no/notice02_list.do" },
  { rank: 7, name: "범부처전주기의료기기연구개발사업단", url: "https://kmdf.org/official" },
  { rank: 8, name: "의료기기산업 종합정보시스템", url: "https://www.khidi.or.kr/board?menuId=MENU01484&siteId=SITE00039" },
  { rank: 9, name: "산업통상자원부", url: "https://www.motir.go.kr/kor/article/ATCL2826a2625" },
  { rank: 10, name: "보건복지부", url: "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01" },
  { rank: 11, name: "과학기술정보통신부", url: "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311" },
  { rank: 12, name: "보건의료기술 종합정보시스템 (HTDream)", url: "https://www.htdream.kr/main/pubAmt/PubAmtList.do" },
  { rank: 13, name: "강원연구개발특구", url: "https://www.innopolis.or.kr/newBusiness?menuId=MENU01028" },
  { rank: 14, name: "(참고) 강원지역산업진흥원", url: "https://www.riis.or.kr/html/pbanc/pbancList.do" },
  { rank: 15, name: "중소벤처기업부", url: "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310" }
];

const RESULTS_PAGE_SIZE = 15;
const KEYWORD_FIELD_COUNT = 3;

function formatDateKST(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function App() {
  // Initialize date range: default from 30 days ago to today, based on KST (Korea Standard Time)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [startDate, setStartDate] = useState(formatDateKST(thirtyDaysAgo));
  const [endDate, setEndDate] = useState(formatDateKST(now));
  const [keywordInputs, setKeywordInputs] = useState(["의료기기", "", ""]);
  
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"results" | "duplicates" | "portals">("results");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentResultPage, setCurrentResultPage] = useState(1);
  const [focusedKeywordIndex, setFocusedKeywordIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Trigger initial extraction on mount
  useEffect(() => {
    handleExtract();
  }, []);

  useEffect(() => {
    setCurrentResultPage(1);
  }, [extractedData, searchTerm]);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          keywords: keywordInputs.map((value) => value.trim()).filter(Boolean)
        })
      });

      if (!response.ok) {
        throw new Error("서버로부터 공고 데이터를 추출하는 중에 오류가 발생했습니다.");
      }

      const data: ExtractResponse = await response.json();
      setExtractedData(data);
    } catch (err: any) {
      setError(err?.message || "네트워크 통신 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcelCSV = () => {
    if (!extractedData || extractedData.results.length === 0) return;

    // Excel compatible UTF-8 CSV formatting (starting with BOM)
    const BOM = "\ufeff";
    let csvContent = BOM;
    
    // Header
    const headers = ["공고일자", "공고 포털", "연동 순위", "부처/기관", "공고문 제목", "요약 설명", "공고 주소"];
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";

    // Row definitions
    extractedData.results.forEach((item) => {
      // Find priority Rank index
      const portalIndex = PORTALS_LIST.findIndex(p => p.name === item.portal);
      const rankInfo = portalIndex !== -1 ? `${portalIndex + 1}위` : "기타";

      const row = [
        item.date,
        item.portal,
        rankInfo,
        item.department,
        item.title,
        item.description,
        item.url
      ];
      csvContent += row.map(val => `"${(val || "").replace(/"/g, '""')}"`).join(",") + "\n";
    });

    // Create BLOB and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AI_공고추출결과_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list based on search term inside results
  const filteredResults = extractedData?.results.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.portal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const totalResultPages = Math.max(Math.ceil(filteredResults.length / RESULTS_PAGE_SIZE), 1);
  const currentResultPageSafe = Math.min(currentResultPage, totalResultPages);
  const resultPageStart = (currentResultPageSafe - 1) * RESULTS_PAGE_SIZE;
  const visibleResults = filteredResults.slice(resultPageStart, resultPageStart + RESULTS_PAGE_SIZE);
  const pageGroupStart = Math.floor((currentResultPageSafe - 1) / 5) * 5 + 1;
  const pageGroupEnd = Math.min(pageGroupStart + 4, totalResultPages);
  const visiblePageNumbers = Array.from(
    { length: pageGroupEnd - pageGroupStart + 1 },
    (_, index) => pageGroupStart + index
  );

  return (
    <div id="app-root" className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      {/* Top Header Panel */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" id="header-icon" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-neutral-900" id="header-title">AI 공고 추출기</h1>
              <p className="text-[10px] text-neutral-500 font-mono -mt-0.5">National R&D AI Notice Deduplicator</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-400 font-mono hidden md:inline">v1.2.0</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Concept / Explanatory Banner */}
        <div className="bg-indigo-900 text-white rounded-2xl p-5 md:p-6 mb-6 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Layers className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-lg md:text-xl font-bold tracking-tight mb-1.5"> R&D 국가 공고 탐색 시스템 (시범운영) </h2>
            <p className="text-xs md:text-sm text-indigo-200 leading-relaxed mb-4">
              국내 의료기기 관련 주요 부처의 R&D 지원 공고사이트로 부터 입력하신 핵심타겟키워드를 중심으로 공고문을 실시간 수집합니다.
              특히, 부처 포털 간 <strong>중복 공고</strong>를 제외하고 개별 공고문에 접속할 수 있도록 지원합니다.
              <span className="block mt-1 text-[80%]">
                (크롤링 단계에서, 포털에서 가져오는 페이지 수가 제한되어 있어 &quot;수집 대상 시작일&quot;을 빠른 일자로 설정하더라도 오래된 공고문은 표시되지 않을 수 있습니다.)
              </span>
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-indigo-100">
              <span className="bg-indigo-800/60 px-2.5 py-1 rounded-md border border-indigo-700/50">#1 IRIS 최우선</span>
              <span className="bg-indigo-800/60 px-2.5 py-1 rounded-md border border-indigo-700/50">#중복 고도 필터링</span>
              <span className="bg-indigo-800/60 px-2.5 py-1 rounded-md border border-indigo-700/50">#실시간 공고 주소 연동</span>
              <span className="bg-indigo-800/60 px-2.5 py-1 rounded-md border border-indigo-700/50">#Excel 자동 호환</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-neutral-100">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <h3 className="font-semibold text-sm text-neutral-900">추출 최적화 설정</h3>
              </div>

              {/* Extraction Target Period Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 flex items-center justify-between">
                    <span>수집 대상 시작일</span>
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  </label>
                  <input 
                    type="date" 
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 flex items-center justify-between">
                    <span>수집 대상 종료일</span>
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  </label>
                  <input 
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-2xs"
                  />
                </div>

                {/* Filter Keyword Choice */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-neutral-500">핵심 타겟 키워드</label>
                    <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-white text-indigo-700 shadow-xs">
                        AND
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: KEYWORD_FIELD_COUNT }).map((_, index) => (
                      <div className="relative" key={index}>
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                        <input
                          type="text"
                          id={`keywordInput-${index + 1}`}
                          value={keywordInputs[index]}
                          onFocus={() => setFocusedKeywordIndex(index)}
                          onBlur={() => setFocusedKeywordIndex(null)}
                          onChange={(e) =>
                            setKeywordInputs((current) =>
                              current.map((value, valueIndex) =>
                                valueIndex === index ? e.target.value : value
                              )
                            )
                          }
                          placeholder={
                            index === 0
                              ? "예: 의료기기"
                              : focusedKeywordIndex === index
                                ? ""
                                : "입력 가능"
                          }
                          className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium placeholder:text-neutral-400"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">포털 사이트 내 AI R&D 연계 공고를 매칭합니다.</p>
                </div>

                {/* Search execution Button */}
                <button
                  type="button"
                  id="btn-extract"
                  onClick={handleExtract}
                  disabled={loading}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white shadow-xs transition-colors duration-150 flex items-center justify-center space-x-2 cursor-pointer ${
                    loading 
                      ? "bg-indigo-400 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>공고 추출 & 분석 가동 중...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>AI R&D 공고 추출 및 중복 전처리</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Helper Widget: Portals list */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <h3 className="font-semibold text-xs text-neutral-400 uppercase tracking-wider mb-3">연동 및 보정 포털 리스트 (총 {PORTALS_LIST.length}개)</h3>
              <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 text-xs">
                {PORTALS_LIST.map((p) => (
                  <div key={p.rank} className="flex items-center justify-between py-1 border-b border-neutral-50/50 last:border-0 hover:bg-neutral-50 px-1 rounded">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 bg-neutral-100 text-neutral-600">
                        {p.rank}
                      </span>
                      <span className="truncate text-neutral-700 font-medium" title={p.name}>{p.name}</span>
                    </div>
                    <a 
                      href={p.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-neutral-400 hover:text-indigo-600 shrink-0 ml-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Display and Results Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Real-time counters summary cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs text-center">
                <span className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">1차 수집 공고</span>
                <span className="text-xl sm:text-2xl font-bold text-neutral-600 leading-none">
                  {loading ? "-" : (extractedData ? extractedData.originalCount : 0)}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-1">중복 포함 누적</span>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 shadow-xs text-center">
                <span className="text-[10px] sm:text-xs font-medium text-rose-500 uppercase tracking-wider block mb-1">중복 탐지 삭제</span>
                <span className="text-xl sm:text-2xl font-bold text-rose-600 leading-none">
                  {loading ? "-" : (extractedData ? extractedData.duplicatesFiltered.length : 0)}
                </span>
                <span className="text-[10px] text-rose-400 block mt-1">고순위 포털 보존</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-xs text-center">
                <span className="text-[10px] sm:text-xs font-medium text-emerald-600 uppercase tracking-wider block mb-1">최종 고유 공고</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-700 leading-none">
                  {loading ? "-" : (extractedData ? extractedData.finalCount : 0)}
                </span>
                <span className="text-[10px] text-emerald-500 block mt-1">엑셀 정리 최종본</span>
              </div>
            </div>

            {/* Active Quota Fallback / Notice Warning Banner */}
            {extractedData?.warning && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-3xs flex items-start space-x-3 text-xs text-amber-900 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-bold block mb-0.5">⚠️ 공고 수집 방식 및 상태 안내</span>
                  <span>{extractedData.warning}</span>
                </div>
              </div>
            )}

            {/* Main Tabs switcher */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden min-h-[500px]">
              
              {/* Tab headers */}
              <div className="border-b border-neutral-200 bg-neutral-50 px-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex space-x-1 py-1.5">
                  <button
                    onClick={() => setActiveTab("results")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === "results"
                        ? "bg-white text-indigo-700 shadow-xs border border-neutral-200"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    최종 공고 리스트 ({extractedData ? filteredResults.length : 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("duplicates")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                      activeTab === "duplicates"
                        ? "bg-white text-indigo-700 shadow-xs border border-neutral-200"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <span>중복 제거 내역</span>
                    {extractedData && extractedData.duplicatesFiltered.length > 0 && (
                      <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {extractedData.duplicatesFiltered.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("portals")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === "portals"
                        ? "bg-white text-indigo-700 shadow-xs border border-neutral-200"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    우선순위 지침서
                  </button>
                </div>

                <div className="py-1.5 flex items-center space-x-2">
                  <button
                    id="btn-download"
                    onClick={downloadExcelCSV}
                    disabled={!extractedData || extractedData.results.length === 0 || loading}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 shadow-xs cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel 저장</span>
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="m-4 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start space-x-3 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">오류가 발생했습니다</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Tab Display Screens */}
              <div className="p-5">
                
                {/* 1. Results List Tab */}
                {activeTab === "results" && (
                  <div className="space-y-4">
                    {/* Search inside results */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="이 결과 내에서 검색 (제목, 포털, 내용)..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                    </div>

                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-neutral-800 leading-relaxed space-y-1.5 shadow-2xs">
                      <div className="flex items-center space-x-2 text-indigo-700 font-bold">
                        <Sparkles className="w-4 h-4 shrink-0 text-indigo-500" />
                        <span>실시간 포털 수집 및 바로접속 안내</span>
                      </div>
                      <p className="text-neutral-600 text-[11px] leading-relaxed">
                        좌측 <strong>연동 및 보정 포털 리스트</strong>의 각 사이트에서 추출 조건(기간·키워드)에 맞는 공고를 실시간 수집합니다.
                        <strong> [공고문 바로접속]</strong>은 포털에서 파싱한 <strong>실제 상세 페이지 URL</strong>을
                        Referer 없이 여는 게이트웨이(<code className="text-[10px] bg-white px-1 rounded">/api/open</code>)로 연결합니다.
                      </p>
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="text-xs text-neutral-500 font-medium">실시간 R&D 포털 탐색 및 AI 공고 수집 중...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredResults.length === 0 ? (
                          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-2xl">
                            <Info className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                            <p className="text-xs text-neutral-500">선택한 기간 동안 발견된 AI R&D 공고가 없습니다.</p>
                            <p className="text-[10px] text-neutral-400 mt-1">기간 설정을 조정하거나 핵심 타겟 키워드를 변경해 보세요.</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-neutral-100">
                            {visibleResults.map((item, idx) => {
                              // Identify portal serial/rank
                              const portalInfo = PORTALS_LIST.find(p => p.name === item.portal);
                              const pRank = portalInfo ? portalInfo.rank : null;
                              const pRankText = pRank ? `${pRank}위` : "기타";
                              
                              return (
                                <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                                  className="py-4 first:pt-0 last:pb-0 hover:bg-neutral-50/70 rounded-lg px-2 transition-colors"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 max-w-full">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                        <span className="text-[10px] font-mono text-neutral-500 shrink-0 bg-neutral-100 px-1.5 py-0.5 rounded">
                                          {item.date}
                                        </span>
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                                          pRank === 1 
                                            ? "bg-amber-50 text-amber-700 border-amber-200" 
                                            : pRank && pRank <= 3 
                                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                              : "bg-neutral-100 text-neutral-700 border-neutral-200"
                                        }`}>
                                          {item.portal} <span className="font-mono text-[9px] opacity-80">(우선순위 {pRankText})</span>
                                        </span>
                                        <span className="text-[10px] text-neutral-400 font-medium truncate">
                                          {item.department}
                                        </span>
                                      </div>
                                      
                                      <a
                                        href={getAnnouncementOpenLink(item.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        referrerPolicy="no-referrer"
                                        className="group/title block cursor-pointer"
                                      >
                                        <h4 className="text-sm font-bold text-neutral-900 tracking-tight leading-snug mb-1 group-hover/title:text-indigo-600 transition-colors flex items-center flex-wrap gap-1">
                                          {item.title}
                                        </h4>
                                      </a>
                                      <p className="text-xs text-neutral-500 leading-relaxed mb-2 max-w-3xl line-clamp-2">
                                        {item.description}
                                      </p>
                                    </div>
 
                                    {/* Action items: direct login or connection */}
                                    <div className="shrink-0 flex flex-wrap sm:flex-col items-stretch justify-start gap-1.5 min-w-[130px] w-full sm:w-auto mt-2 sm:mt-0">
                                      {/* 1. Direct Access via Referer-safe gateway */}
                                      <a 
                                        href={getAnnouncementOpenLink(item.url)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        referrerPolicy="no-referrer"
                                        className="text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-2.5 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                                        title="Referer 차단을 우회하여 공고문 상세 페이지로 이동합니다"
                                      >
                                        <span>공고문 바로접속</span>
                                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                      </a>

                                      {/* 2. Copy Deep URL */}
                                      <button 
                                        onClick={() => handleCopyText(item.url, `url-${idx}`)}
                                        className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
                                          copiedId === `url-${idx}` 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs animate-pulse" 
                                            : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200"
                                        }`}
                                        title="상세한 개별 공고문 다이렉트 URL 주소를 고스란히 복사하여 새 주소창에 직접 붙여넣으십시요"
                                      >
                                        {copiedId === `url-${idx}` ? (
                                          <>
                                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                            <span>주소 복사됨!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                                            <span>세부 URL 복사</span>
                                          </>
                                        )}
                                      </button>

                                      {/* 3. Title copy and Search portal */}
                                      <button 
                                        onClick={() => {
                                          handleCopyText(item.title, `title-${idx}`);
                                          window.open(portalInfo ? portalInfo.url : item.url, "_blank", "noopener,noreferrer");
                                        }}
                                        className={`text-[10px] font-medium px-2 py-1 rounded-lg flex items-center justify-center space-x-1 border transition-all cursor-pointer ${
                                          copiedId === `title-${idx}` 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs" 
                                            : "bg-white text-neutral-500 hover:bg-neutral-50 border-neutral-200"
                                        }`}
                                        title="제목을 클립보드에 복사하고 해당 포털의 정식 공지사항 목록 게시판으로 바로 갑니다"
                                      >
                                        {copiedId === `title-${idx}` ? (
                                          <>
                                            <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                                            <span>제목 복사됨!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Search className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                                            <span>제목 복사 & 포털 검색</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                            {totalResultPages > 1 && (
                              <div className="pt-4 flex flex-col items-center gap-2">
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                  {pageGroupStart > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setCurrentResultPage(pageGroupStart - 1)}
                                      className="min-w-8 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
                                    >
                                      이전
                                    </button>
                                  )}
                                  {visiblePageNumbers.map((pageNumber) => (
                                    <button
                                      key={pageNumber}
                                      type="button"
                                      onClick={() => setCurrentResultPage(pageNumber)}
                                      className={`min-w-8 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                                        currentResultPageSafe === pageNumber
                                          ? "border-indigo-500 bg-indigo-600 text-white"
                                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-indigo-50 hover:text-indigo-700"
                                      }`}
                                    >
                                      {pageNumber}
                                    </button>
                                  ))}
                                  {pageGroupEnd < totalResultPages && (
                                    <button
                                      type="button"
                                      onClick={() => setCurrentResultPage(pageGroupEnd + 1)}
                                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                                    >
                                      더보기
                                    </button>
                                  )}
                                </div>
                                <span className="text-[10px] text-neutral-400">
                                  {resultPageStart + 1}-{resultPageStart + visibleResults.length}개 표시 중 / 총 {filteredResults.length}개
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Deduplication Log Tab */}
                {activeTab === "duplicates" && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-xl p-3 text-neutral-800 border border-amber-200/50 flex items-start space-x-2 text-xs">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-0.5">중복 공고문 판별 정책</strong>
                        <span>
                          국가 R&D 시스템 특성상 동일한 주관부처 공고가 대국민 NTIS, 범부처 통합 IRIS, 산하기관 개별 사이트로 전파 및 미러링됩니다. 
                          본 모듈은 캐릭터 단위의 문자 유사성 지수를 분석하여 동일과제를 식별하고, 첨부 순서에 따른 우선 수위 포털 <strong>내의 것만 남긴 후 미러링용 하위 순위 항목을 일괄 제거</strong>했습니다.
                        </span>
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {!extractedData || extractedData.duplicatesFiltered.length === 0 ? (
                          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-2xl">
                            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <p className="text-xs text-neutral-500 font-medium font-noto">검출 및 보정된 중복 공고문이 없습니다.</p>
                            <p className="text-[10px] text-neutral-400 mt-1 font-noto">모든 수집된 공고의 지수가 개별 고유 공고로 판명되었습니다.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {extractedData.duplicatesFiltered.map((record, index) => (
                              <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden shadow-xs bg-white">
                                <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200 flex items-center justify-between text-xs font-mono">
                                  <span className="text-rose-600 font-bold">중복 탐지 #{index + 1}</span>
                                  <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-md font-bold text-[10px]">
                                    하위 삭제됨
                                  </span>
                                </div>
                                <div className="p-3.5 space-y-3 text-xs leading-relaxed font-noto">
                                  
                                  {/* Kept (High priority) */}
                                  <div className="flex items-start space-x-2">
                                    <div className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm shrink-0">
                                      보존 (우선 {record.kept.priority}위)
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-neutral-900">{record.kept.title}</p>
                                      <span className="text-[10px] text-neutral-400 font-mono">포털: {record.kept.portal} | 일자: {record.kept.date}</span>
                                    </div>
                                  </div>

                                  {/* Arrow separator */}
                                  <div className="pl-1 text-neutral-300">
                                    <ArrowRight className="w-4 h-4 rotate-90 transform shrink-0" />
                                  </div>

                                  {/* Deleted (Low priority) */}
                                  <div className="flex items-start space-x-2">
                                    <div className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm shrink-0">
                                      삭제 (하위 {record.deleted.priority}위)
                                    </div>
                                    <div className="min-w-0 flex-1 opacity-70">
                                      <p className="font-semibold text-neutral-700 line-through">{record.deleted.title}</p>
                                      <span className="text-[10px] text-neutral-400 font-mono">포털: {record.deleted.portal} | 일자: {record.deleted.date}</span>
                                    </div>
                                  </div>

                                  {/* Cleared explanation reason logic */}
                                  <div className="mt-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 font-medium">
                                    💡 <strong className="text-neutral-700 font-noto">보정 사유:</strong> {record.reason}
                                  </div>

                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Portals priority reference tab */}
                {activeTab === "portals" && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-900 leading-relaxed font-noto">
                      <p className="font-bold text-sm mb-1">📌 중복 정합성의 우선순위 원칙</p>
                      <p className="mb-2">
                        첨부 문서에서 제시한 순위에 따라 <strong>범부처통합연구지원시스템(IRIS)</strong>이 원조이자 최우선 수집 포털로 인정됩니다.
                        중복되는 공고가 탐지될 경우 이 계층 우선구조에 의해 상위 순위 포털 정보만 유지되고 하위 순위 항목들은 자동 여과 및 삭제(정리)됩니다.
                      </p>
                      <p className="font-bold">계층 순위 예시:</p>
                      <p>
                        "2026년도 국가 과제 공고" 가 <strong className="text-indigo-800">[범부처통합연구지원시스템 (IRIS)] (1위)</strong> 과 <strong className="text-indigo-800">[국가과학기술지식정보서비스 (NTIS)] (2위)</strong> 양측에 게재된 경우, 
                        우선의 원칙에 의해 <u>NTIS의 과제가 자동 삭제</u>되고 <u>IRIS의 과제만 보존</u>됩니다.
                      </p>
                    </div>

                    <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-xs bg-white">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-600 font-noto">
                            <th className="py-2.5 px-3 w-16 text-center">우선순위</th>
                            <th className="py-2.5 px-3">연구진흥 포털명</th>
                            <th className="py-2.5 px-3">가중 보정 범위 및 도메인</th>
                            <th className="py-2.5 px-3">포털 홈페이지 고정 주소</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 font-noto">
                          {PORTALS_LIST.map((p) => (
                            <tr key={p.rank} className="hover:bg-neutral-50/50">
                              <td className="py-2.5 px-3 text-center font-bold text-neutral-500 font-mono">{p.rank}위</td>
                              <td className="py-2.5 px-3 font-semibold text-neutral-800">{p.name}</td>
                              <td className="py-2.5 px-3 font-mono text-[10px] text-neutral-500">
                                {p.rank === 1 ? "최우선 (IRIS 원본)" : p.rank === 12 ? "보건의료 융합" : "R&D 중복유통 보정 대상"}
                              </td>
                              <td className="py-2.5 px-3 text-neutral-500">
                                <a 
                                  href={p.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs text-indigo-600 hover:underline flex items-center space-x-1"
                                >
                                  <span className="truncate max-w-[200px] inline-block">{p.url}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Page Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-20 py-8 text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2 text-xs font-noto">
          <p>© 2026 AI 공고 추출기. All Rights Reserved. (국가 R&D 연계 포털 데이터 전처리 모듈)</p>
          <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed select-none font-mono text-[10px]">
            본 전처리 솔루션은 비공개 내부 R&D 평가 연동 및 보정 업무를 촉진하기 위해 제작되었습니다. 
            Gemini모델에 의한 Grounded 검색 데이터가 로컬 검증 세트와 융합 정제됩니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
