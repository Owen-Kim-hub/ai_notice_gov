import { ExtractResponse } from "../types";

interface SummaryCardsProps {
  loading: boolean;
  data: ExtractResponse | null;
}

export function SummaryCards({ loading, data }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs text-center">
        <span className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">1차 수집 공고</span>
        <span className="text-xl sm:text-2xl font-bold text-neutral-600 leading-none">
          {loading ? "-" : (data ? data.originalCount : 0)}
        </span>
        <span className="text-[10px] text-neutral-400 block mt-1">중복 포함 누적</span>
      </div>
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 shadow-xs text-center">
        <span className="text-[10px] sm:text-xs font-medium text-rose-500 uppercase tracking-wider block mb-1">중복 탐지 삭제</span>
        <span className="text-xl sm:text-2xl font-bold text-rose-600 leading-none">
          {loading ? "-" : (data ? data.duplicatesFiltered.length : 0)}
        </span>
        <span className="text-[10px] text-rose-400 block mt-1">고순위 포털 보존</span>
      </div>
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-xs text-center">
        <span className="text-[10px] sm:text-xs font-medium text-emerald-600 uppercase tracking-wider block mb-1">최종 고유 공고</span>
        <span className="text-xl sm:text-2xl font-bold text-emerald-700 leading-none">
          {loading ? "-" : (data ? data.finalCount : 0)}
        </span>
        <span className="text-[10px] text-emerald-500 block mt-1">엑셀 정리 최종본</span>
      </div>
    </div>
  );
}
