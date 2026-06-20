const PAGE_GROUP_SIZE = 5;

export interface PaginationState<T> {
  totalPages: number;
  currentPage: number;
  pageStart: number;
  visibleItems: T[];
  groupStart: number;
  groupEnd: number;
  pageNumbers: number[];
}

/** 현재 페이지/검색 결과로부터 페이지네이션 표시 상태를 계산 */
export function getPaginationState<T>(
  items: T[],
  currentPage: number,
  pageSize: number
): PaginationState<T> {
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const visibleItems = items.slice(pageStart, pageStart + pageSize);
  const groupStart = Math.floor((safePage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + (PAGE_GROUP_SIZE - 1), totalPages);
  const pageNumbers = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, index) => groupStart + index
  );

  return {
    totalPages,
    currentPage: safePage,
    pageStart,
    visibleItems,
    groupStart,
    groupEnd,
    pageNumbers,
  };
}
