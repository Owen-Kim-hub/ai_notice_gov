import { Search, Sparkles, Info, RefreshCw } from "lucide-react";
import { Announcement } from "../types";
import { RESULTS_PAGE_SIZE } from "../constants";
import { getPaginationState } from "../utils/pagination";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { ResultCard } from "./ResultCard";
import { Pagination } from "./Pagination";

interface ResultsPanelProps {
  loading: boolean;
  results: Announcement[];
  searchTerm: string;
  currentPage: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

export function ResultsPanel({
  loading,
  results,
  searchTerm,
  currentPage,
  onSearchChange,
  onPageChange,
}: ResultsPanelProps) {
  const { copiedId, copy } = useCopyToClipboard();
  const pagination = getPaginationState(results, currentPage, RESULTS_PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Search inside results */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-xs text-neutral-500 font-medium">실시간 R&D 포털 탐색 및 WMIT 공고 수집 중...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-200 rounded-2xl">
              <Info className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500">선택한 기간 동안 발견된 WMIT R&D 공고가 없습니다.</p>
              <p className="text-[10px] text-neutral-400 mt-1">기간 설정을 조정하거나 핵심 타겟 키워드를 변경해 보세요.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {pagination.visibleItems.map((item, idx) => (
                <ResultCard
                  key={idx}
                  item={item}
                  index={idx}
                  copiedId={copiedId}
                  onCopy={copy}
                />
              ))}
              <Pagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                groupStart={pagination.groupStart}
                groupEnd={pagination.groupEnd}
                pageNumbers={pagination.pageNumbers}
                pageStart={pagination.pageStart}
                visibleCount={pagination.visibleItems.length}
                totalCount={results.length}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
