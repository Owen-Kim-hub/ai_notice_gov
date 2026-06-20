interface PaginationProps {
  totalPages: number;
  currentPage: number;
  groupStart: number;
  groupEnd: number;
  pageNumbers: number[];
  pageStart: number;
  visibleCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  totalPages,
  currentPage,
  groupStart,
  groupEnd,
  pageNumbers,
  pageStart,
  visibleCount,
  totalCount,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pt-4 flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {groupStart > 1 && (
          <button
            type="button"
            onClick={() => onPageChange(groupStart - 1)}
            className="min-w-8 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
          >
            이전
          </button>
        )}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`min-w-8 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              currentPage === pageNumber
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        {groupEnd < totalPages && (
          <button
            type="button"
            onClick={() => onPageChange(groupEnd + 1)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            더보기
          </button>
        )}
      </div>
      <span className="text-[10px] text-neutral-400">
        {pageStart + 1}-{pageStart + visibleCount}개 표시 중 / 총 {totalCount}개
      </span>
    </div>
  );
}
