import { Info, RefreshCw, CheckCircle, ArrowRight } from "lucide-react";
import { DeduplicationRecord } from "../types";

interface DuplicatesPanelProps {
  loading: boolean;
  duplicates: DeduplicationRecord[];
}

export function DuplicatesPanel({ loading, duplicates }: DuplicatesPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 rounded-xl p-3 text-neutral-800 border border-amber-200/50 flex items-start space-x-2 text-xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-0.5">중복 공고문 판별 정책</strong>
          <span>
            국가 R&D 시스템 특성상 동일한 주관부처 공고가 대국민 NTIS, 범부처 통합 IRIS, 산하기관 개별 사이트에 중복으로 공고됩니다.
            본 모듈은 캐릭터 단위의 문자 유사성 지수를 분석하여 유사성 90%이상은 동일과제를 식별하고, 우선 순위 포털 <strong>내의 것만 남긴 후 하위 순위 항목을 일괄 제거</strong>했습니다.
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {duplicates.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-200 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-neutral-500 font-medium font-noto">검출 및 보정된 중복 공고문이 없습니다.</p>
              <p className="text-[10px] text-neutral-400 mt-1 font-noto">모든 수집된 공고의 지수가 개별 고유 공고로 판명되었습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {duplicates.map((record, index) => (
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
  );
}
