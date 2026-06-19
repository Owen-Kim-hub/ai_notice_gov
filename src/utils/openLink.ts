/** Referer 차단을 우회하는 서버 게이트웨이 경유 공고문 링크 */
export function getAnnouncementOpenLink(url: string): string {
  if (!url) return "#";
  return `/api/open?url=${encodeURIComponent(url)}`;
}
