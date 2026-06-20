/** KST(한국 표준시) 기준으로 날짜를 YYYY-MM-DD 문자열로 변환 */
export function formatDateKST(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** 주어진 날짜에서 days일 이전 날짜를 반환 */
export function getDateDaysBefore(date: Date, days: number): Date {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}
