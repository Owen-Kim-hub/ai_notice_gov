import { PORTALS } from "./portals";
import { scrapeAllPortals } from "./portalScraper";

export type ApiRequest = { body?: unknown; query?: Record<string, unknown> };
export type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  send: (body: string) => void;
  json: (body: unknown) => void;
};

interface ExtractBody {
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

interface AnnouncementItem {
  title: string;
  portal: string;
  url: string;
  date: string;
  department: string;
  description: string;
  priorityIndex?: number;
}

interface KeepDeleteRecord {
  title: string;
  portal: string;
  priority: number;
  date: string;
  url: string;
}

function getTitleSimilarity(t1: string, t2: string): number {
  const clean = (value: string) =>
    value
      .replace(/[\s()[\]\-_,.:/\d년월일상반기하반기공고재공고선정결과신규과제]/g, "")
      .trim();

  const c1 = clean(t1);
  const c2 = clean(t2);
  if (!c1 || !c2) return 0;
  if (c1 === c2) return 1;

  const set1 = new Set(c1);
  const set2 = new Set(c2);
  const intersection = new Set([...set1].filter((char) => set2.has(char)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function getPortalPriorityIndex(portalName: string): number {
  const normalized = portalName.replace(/\s+/g, "").toLowerCase();

  for (let index = 0; index < PORTALS.length; index++) {
    const portal = PORTALS[index];
    const portalNormalized = portal.name.replace(/\s+/g, "").toLowerCase();

    if (
      normalized.includes(portalNormalized) ||
      portalNormalized.includes(normalized)
    ) {
      return index;
    }

    for (const domain of portal.domains) {
      if (normalized.includes(domain.replace(/\./g, ""))) {
        return index;
      }
    }
  }

  return 999;
}

export async function handleExtract(req: ApiRequest, res: ApiResponse) {
  const body = (req.body || {}) as ExtractBody;
  const startDate = body.startDate;
  const endDate = body.endDate;
  const keyword = body.keyword || "AI";

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate와 endDate는 필수 입력 항목입니다." });
  }

  console.log(`[Extracting] Period: ${startDate} ~ ${endDate}, Keyword: ${keyword}`);

  const summary = await scrapeAllPortals(startDate, endDate, keyword);
  const rawPool: AnnouncementItem[] = summary.announcements.map((item) => ({
    ...item,
    priorityIndex: getPortalPriorityIndex(item.portal),
  }));

  const finalPool: AnnouncementItem[] = [];
  const duplicatesLogged: {
    kept: KeepDeleteRecord;
    deleted: KeepDeleteRecord;
    reason: string;
  }[] = [];

  const sortedRawPool = [...rawPool].sort((a, b) => {
    const priorityA = a.priorityIndex ?? 999;
    const priorityB = b.priorityIndex ?? 999;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return b.date.localeCompare(a.date);
  });

  for (const item of sortedRawPool) {
    let isDuplicate = false;
    let duplicateOf: AnnouncementItem | null = null;

    for (const existing of finalPool) {
      const similarity = getTitleSimilarity(item.title, existing.title);
      if (similarity >= 0.7) {
        isDuplicate = true;
        duplicateOf = existing;
        break;
      }
    }

    if (isDuplicate && duplicateOf) {
      duplicatesLogged.push({
        kept: {
          title: duplicateOf.title,
          portal: duplicateOf.portal,
          priority: (duplicateOf.priorityIndex ?? 999) + 1,
          date: duplicateOf.date,
          url: duplicateOf.url,
        },
        deleted: {
          title: item.title,
          portal: item.portal,
          priority: (item.priorityIndex ?? 999) + 1,
          date: item.date,
          url: item.url,
        },
        reason: `제목 유사도 기준 (${Math.round(
          getTitleSimilarity(item.title, duplicateOf.title) * 100
        )}%). 고순위 포털 [${duplicateOf.portal}] 공고 보존 및 [${item.portal}] 공고 필터`,
      });
    } else {
      finalPool.push(item);
    }
  }

  const sortedFinalPool = finalPool.sort((a, b) => b.date.localeCompare(a.date));

  let warning: string | undefined;
  if (summary.errors.length > 0) {
    const failed = summary.errors.map((error) => error.portal).join(", ");
    warning = `일부 포털(${failed})에서 공고를 가져오지 못했습니다. 나머지 포털 결과는 정상 반영되었습니다.`;
  }

  if (sortedFinalPool.length === 0) {
    warning = warning
      ? `${warning} 조건에 맞는 공고가 없습니다.`
      : "조건에 맞는 공고를 찾지 못했습니다. 검색 기간이나 키워드를 조정해 보세요.";
  }

  return res.json({
    results: sortedFinalPool,
    duplicatesFiltered: duplicatesLogged,
    portalCount: PORTALS.length,
    originalCount: rawPool.length,
    finalCount: sortedFinalPool.length,
    portalStats: summary.portalStats,
    warning,
    isFallback: false,
  });
}
