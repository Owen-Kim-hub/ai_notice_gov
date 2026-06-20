import { PORTALS, type ScrapedAnnouncement } from "./portals.js";

export const DUPLICATE_TITLE_SIMILARITY_THRESHOLD = 0.9;

export interface AnnouncementItem extends ScrapedAnnouncement {
  priorityIndex?: number;
}

export interface KeepDeleteRecord {
  title: string;
  portal: string;
  priority: number;
  date: string;
  url: string;
}

export interface DuplicateRecord {
  kept: KeepDeleteRecord;
  deleted: KeepDeleteRecord;
  reason: string;
}

/** 두 공고 제목의 문자 단위 자카드 유사도(0~1)를 계산 */
export function getTitleSimilarity(t1: string, t2: string): number {
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

/** 포털 이름으로 PORTALS 내 우선순위 인덱스를 찾는다. 없으면 999 */
export function getPortalPriorityIndex(portalName: string): number {
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

function toKeepDeleteRecord(item: AnnouncementItem): KeepDeleteRecord {
  return {
    title: item.title,
    portal: item.portal,
    priority: (item.priorityIndex ?? 999) + 1,
    date: item.date,
    url: item.url,
  };
}

/**
 * 우선순위(낮은 인덱스 = 고순위) → 최신순으로 정렬한 뒤,
 * 제목 유사도가 임계값 이상인 항목을 중복으로 보고 고순위만 남긴다.
 */
export function deduplicateByTitle(items: AnnouncementItem[]): {
  kept: AnnouncementItem[];
  duplicates: DuplicateRecord[];
} {
  const kept: AnnouncementItem[] = [];
  const duplicates: DuplicateRecord[] = [];

  const sorted = [...items].sort((a, b) => {
    const priorityA = a.priorityIndex ?? 999;
    const priorityB = b.priorityIndex ?? 999;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return b.date.localeCompare(a.date);
  });

  for (const item of sorted) {
    let duplicateOf: AnnouncementItem | null = null;

    for (const existing of kept) {
      const similarity = getTitleSimilarity(item.title, existing.title);
      if (similarity >= DUPLICATE_TITLE_SIMILARITY_THRESHOLD) {
        duplicateOf = existing;
        break;
      }
    }

    if (duplicateOf) {
      const similarityPercent = Math.round(
        getTitleSimilarity(item.title, duplicateOf.title) * 100
      );
      duplicates.push({
        kept: toKeepDeleteRecord(duplicateOf),
        deleted: toKeepDeleteRecord(item),
        reason: `제목 유사도 기준 (${similarityPercent}%). 고순위 포털 [${duplicateOf.portal}] 공고 보존 및 [${item.portal}] 공고 필터`,
      });
    } else {
      kept.push(item);
    }
  }

  return { kept, duplicates };
}
