import { Download, AlertCircle } from "lucide-react";
import { Announcement, ExtractResponse } from "../types";
import { ResultsPanel } from "./ResultsPanel";
import { DuplicatesPanel } from "./DuplicatesPanel";

export type ResultsTab = "results" | "duplicates";

interface ResultsSectionProps {
  activeTab: ResultsTab;
  loading: boolean;
  error: string | null;
  data: ExtractResponse | null;
  filteredResults: Announcement[];
  searchTerm: string;
  currentPage: number;
  onTabChange: (tab: ResultsTab) => void;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onDownload: () => void;
}

export function ResultsSection({
  activeTab,
  loading,
  error,
  data,
  filteredResults,
  searchTerm,
  currentPage,
  onTabChange,
  onSearchChange,
  onPageChange,
  onDownload,
}: ResultsSectionProps) {
  const duplicates = data?.duplicatesFiltered ?? [];
  const downloadDisabled = !data || data.results.length === 0 || loading;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden min-h-[500px]">
      {/* Tab headers */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex space-x-1 py-1.5">
          <button
            onClick={() => onTabChange("results")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "results"
                ? "bg-white text-indigo-700 shadow-xs border border-neutral-200"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            최종 공고 리스트 ({data ? filteredResults.length : 0})
          </button>
          <button
            onClick={() => onTabChange("duplicates")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
              activeTab === "duplicates"
                ? "bg-white text-indigo-700 shadow-xs border border-neutral-200"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <span>중복 제거 내역</span>
            {data && duplicates.length > 0 && (
              <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {duplicates.length}
              </span>
            )}
          </button>
        </div>

        <div className="py-1.5 flex items-center space-x-2">
          <button
            id="btn-download"
            onClick={onDownload}
            disabled={downloadDisabled}
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
        {activeTab === "results" && (
          <ResultsPanel
            loading={loading}
            results={filteredResults}
            searchTerm={searchTerm}
            currentPage={currentPage}
            onSearchChange={onSearchChange}
            onPageChange={onPageChange}
          />
        )}

        {activeTab === "duplicates" && (
          <DuplicatesPanel loading={loading} duplicates={duplicates} />
        )}
      </div>
    </div>
  );
}
