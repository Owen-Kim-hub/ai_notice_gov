import { Layers } from "lucide-react";

export function IntroBanner() {
  return (
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
  );
}
