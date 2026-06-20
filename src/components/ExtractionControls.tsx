import { useState } from "react";
import { Calendar, Search, RefreshCw, SlidersHorizontal } from "lucide-react";
import { KEYWORD_FIELD_COUNT } from "../constants";

interface ExtractionControlsProps {
  startDate: string;
  endDate: string;
  keywordInputs: string[];
  loading: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onKeywordChange: (index: number, value: string) => void;
  onExtract: () => void;
}

export function ExtractionControls({
  startDate,
  endDate,
  keywordInputs,
  loading,
  onStartDateChange,
  onEndDateChange,
  onKeywordChange,
  onExtract,
}: ExtractionControlsProps) {
  const [focusedKeywordIndex, setFocusedKeywordIndex] = useState<number | null>(null);

  return (
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
            onChange={(e) => onStartDateChange(e.target.value)}
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
            onChange={(e) => onEndDateChange(e.target.value)}
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
                  onChange={(e) => onKeywordChange(index, e.target.value)}
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
          onClick={onExtract}
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
  );
}
