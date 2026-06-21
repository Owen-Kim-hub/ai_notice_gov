import { PORTALS, type ScrapedAnnouncement } from "./portals.js";
import { scrapeAllPortals } from "./portalScraper.js";
import type { ApiRequest, ApiResponse } from "./http.js";
import {
  type AnnouncementItem,
  deduplicateByTitle,
  getPortalPriorityIndex,
} from "./deduplication.js";

export type { ApiRequest, ApiResponse } from "./http.js";

interface ExtractBody {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  keywords?: string[];
}

type ScrapeError = { portal: string; message: string };

function normalizeKeywords(body: ExtractBody): string[] {
  const values = Array.isArray(body.keywords) ? body.keywords : [body.keyword || ""];
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function announcementMatchesKeywords(item: AnnouncementItem, keywords: string[]): boolean {
  if (keywords.length === 0) return true;

  const haystack = [item.title, item.description, item.department, item.portal]
    .join(" ")
    .toLowerCase();
  return keywords.every((keyword) => haystack.includes(keyword.toLowerCase()));
}

/** 중복 url 제거 후 우선순위 인덱스를 부여하고 키워드로 필터링한 풀을 만든다 */
function buildAnnouncementPool(
  announcements: ScrapedAnnouncement[],
  keywords: string[]
): AnnouncementItem[] {
  const seen = new Set<string>();
  const unique: ScrapedAnnouncement[] = [];

  for (const item of announcements) {
    const key = `${item.portal}::${item.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique
    .map((item) => ({ ...item, priorityIndex: getPortalPriorityIndex(item.portal) }))
    .filter((item) => announcementMatchesKeywords(item, keywords));
}

function buildWarning(
  errors: ScrapeError[],
  skipped: string[],
  finalCount: number
): string | undefined {
  const parts: string[] = [];

  if (errors.length > 0) {
    const failed = [...new Set(errors.map((error) => error.portal))].join(", ");
    parts.push(
      `일부 포털(${failed})에서 공고를 가져오지 못했습니다. 나머지 포털 결과는 정상 반영되었습니다.`
    );
  }

  if (skipped.length > 0) {
    const list = skipped.join(", ");
    parts.push(
      `수집 시간이 예산을 초과하여 우선순위 하위 포털(${list})은 이번 검색에서 수집되지 않았습니다. ` +
        `위 결과는 그 이전 단계까지 수집된 것이며, 수집 기간을 좁혀 다시 시도하면 누락된 포털도 포함됩니다.`
    );
  }

  let warning: string | undefined = parts.length > 0 ? parts.join(" ") : undefined;

  if (finalCount === 0) {
    warning = warning
      ? `${warning} 조건에 맞는 공고가 없습니다.`
      : "조건에 맞는 공고를 찾지 못했습니다. 검색 기간이나 키워드를 조정해 보세요.";
  }

  return warning;
}

export async function handleExtract(req: ApiRequest, res: ApiResponse) {
  const body = (req.body || {}) as ExtractBody;
  const { startDate, endDate } = body;
  const keywords = normalizeKeywords(body);

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate와 endDate는 필수 입력 항목입니다." });
  }

  console.log(
    `[Extracting] Period: ${startDate} ~ ${endDate}, Keywords: ${keywords.join(" AND ") || "(none)"}`
  );

  const searchTerm = keywords.length > 0 ? keywords[0] : "";
  const summary = await scrapeAllPortals(startDate, endDate, searchTerm);

  const rawPool = buildAnnouncementPool(summary.announcements, keywords);
  const { kept, duplicates } = deduplicateByTitle(rawPool);
  const results = kept.sort((a, b) => b.date.localeCompare(a.date));

  return res.json({
    results,
    duplicatesFiltered: duplicates,
    portalCount: PORTALS.length,
    originalCount: rawPool.length,
    finalCount: results.length,
    portalStats: summary.portalStats,
    warning: buildWarning(summary.errors, summary.skipped, results.length),
    isFallback: false,
  });
}
