import { PORTALS, type PortalDefinition, type ScrapedAnnouncement } from "./portals";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FETCH_HEADERS = {
  "User-Agent": USER_AGENT,
  "Accept-Language": "ko-KR,ko;q=0.9",
};
const FETCH_RETRY_DELAYS_MS = [600, 1500];
/** 개별 요청 타임아웃. 차단/지연되는 포털이 함수 시간 예산을 잡아먹지 않도록 빨리 실패시킨다. */
const FETCH_TIMEOUT_MS = 8000;
/**
 * IRIS 접수예정 탭(ancmPrg=ancmPre)은 서버측 응답이 일관되게 ~12초 걸린다(접수중은 ~1.6초).
 * 기본 8초 타임아웃으로는 항상 abort되므로 IRIS 요청에만 더 넉넉한 타임아웃을 적용한다.
 */
const IRIS_FETCH_TIMEOUT_MS = 20000;

export interface ScrapeSummary {
  announcements: ScrapedAnnouncement[];
  scrapedPortalCount: number;
  portalStats: Record<string, number>;
  errors: { portal: string; message: string }[];
}

export function appendQuery(
  url: string,
  params: Record<string, string | number | undefined>
): string {
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    parsed.searchParams.set(key, String(value));
  }
  return parsed.toString();
}

export function normalizePortalUrl(url: string, base?: string): string {
  let normalized = url.replace(/&amp;/g, "&");
  normalized = normalized.replace(/;jsessionid=[^?&#]*/gi, "");

  if (base) {
    try {
      return new URL(normalized, base).toString();
    } catch {
      return normalized;
    }
  }

  try {
    return new URL(normalized).toString();
  } catch {
    return normalized;
  }
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function decodeJsEscaped(text: string): string {
  try {
    return decodeURIComponent(text.replace(/\+/g, "%20"));
  } catch {
    return text;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeDate(value: string): string {
  const match = value.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!match) return value.trim();
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function inDateRange(date: string, startDate: string, endDate: string): boolean {
  const normalized = normalizeDate(date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return true;
  return normalized >= startDate && normalized <= endDate;
}

function matchesKeyword(text: string, keyword: string): boolean {
  const needle = keyword.trim();
  if (!needle) return true;
  const haystack = text.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  if (haystack.includes(lowerNeedle)) return true;
  if (lowerNeedle === "ai" && /인공지능/.test(text)) return true;
  return false;
}

async function fetchHtml(
  url: string,
  init?: RequestInit,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= FETCH_RETRY_DELAYS_MS.length; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...FETCH_HEADERS,
          ...(init?.headers || {}),
        },
        redirect: "follow",
        signal: controller.signal,
      });

      if (response.ok) {
        return await response.text();
      }

      lastError = new Error(`HTTP ${response.status} for ${url}`);
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }

    const retryDelay = FETCH_RETRY_DELAYS_MS[attempt];
    if (retryDelay !== undefined) {
      await sleep(retryDelay);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Failed to fetch ${url}`);
}

function buildAnnouncement(
  portal: PortalDefinition,
  title: string,
  url: string,
  date: string,
  description = ""
): ScrapedAnnouncement {
  return {
    title: stripHtml(title),
    portal: portal.name,
    url: normalizePortalUrl(url),
    date: normalizeDate(date),
    department: portal.department,
    description: description || stripHtml(title).slice(0, 160),
  };
}

function pushUnique(
  bucket: ScrapedAnnouncement[],
  item: ScrapedAnnouncement,
  seen: Set<string>
): void {
  const key = `${item.portal}::${item.url}`;
  if (seen.has(key)) return;
  seen.add(key);
  bucket.push(item);
}

export async function scrapeIris(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title",
  });
  const html = await fetchHtml(listUrl, undefined, IRIS_FETCH_TIMEOUT_MS);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /f_bsnsAncmBtinSituListForm_view\('([^']+)','[^']+'\)[^>]*>([\s\S]*?)<\/a>[\s\S]*?공고일자\s*:<\/em>\s*(\d{4}-\d{2}-\d{2})/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, ancmId, rawTitle, rawDate] = match;
    const title = stripHtml(rawTitle);
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    pushUnique(
      results,
      buildAnnouncement(
        portal,
        title,
        `https://www.iris.go.kr/contents/retrieveBsnsAncmView.do?ancmId=${ancmId}`,
        rawDate
      ),
      seen
    );
  }

  return results;
}

export async function scrapeNtis(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    pageNo: "1",
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /fn_view\('(\d+)'\)[\s\S]*?title="([^"]+)"[\s\S]*?접수일[^>]*>\s*([\d.]+)/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, uid, rawTitle, rawDate] = match;
    const title = stripHtml(rawTitle);
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    pushUnique(
      results,
      buildAnnouncement(
        portal,
        title,
        `https://www.ntis.go.kr/rndgate/eg/un/ra/view.do?roRndUid=${uid}&flag=rndList`,
        rawDate
      ),
      seen
    );
  }

  return results;
}

export async function scrapeKeit(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title",
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /f_detail\('([^']+)',\s*'(\d{4})'\)[\s\S]*?<span class="title">([\s\S]*?)<\/span>[\s\S]*?등록일<\/span><span class="value">\s*(\d{4}-\d{2}-\d{2})/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, ancmId, bsnsYy, rawTitle, rawDate] = match;
    const title = stripHtml(rawTitle);
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = appendQuery(
      "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmInfoView.do",
      {
        prgmId: "XPG201040000",
        ancmId,
        bsnsYy,
      }
    );

    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results;
}

export async function scrapeKiat(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();
  const referer =
    "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90";

  for (let page = 1; page <= 5; page++) {
    const ajaxUrl = appendQuery(
      "https://www.kiat.or.kr/front/board/boardContentsListAjax.do",
      {
        board_id: "90",
        page: String(page),
        searchKeyword: keyword,
        searchCondition: "title",
      }
    );

    const html = await fetchHtml(ajaxUrl, {
      headers: {
        Referer: referer,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const rowPattern =
      /contentsView\('([^']+)'\)[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4}-\d{2}-\d{2})/gi;

    let match: RegExpExecArray | null;
    let pageMatches = 0;

    while ((match = rowPattern.exec(html)) !== null) {
      pageMatches++;
      const [, contentsId, rawTitle, rawDate] = match;
      const title = stripHtml(rawTitle);
      if (!matchesKeyword(title, keyword)) continue;
      if (!inDateRange(rawDate, startDate, endDate)) continue;

      const detailUrl = appendQuery(
        "https://www.kiat.or.kr/front/board/boardContentsView.do",
        {
          board_id: "90",
          contents_id: contentsId,
        }
      );

      pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
    }

    if (pageMatches === 0) break;
  }

  return results;
}

export async function scrapeSmtech(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= 8; page++) {
    const listUrl = appendQuery(portal.listUrl, { pageIndex: String(page) });
    const html = await fetchHtml(listUrl);

    const rowPattern =
      /<a href="([^"]*notice02_detail\.do[^"]*)"[^>]*class="board"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4}-\d{2}-\d{2})/gi;

    let match: RegExpExecArray | null;
    let pageMatches = 0;

    while ((match = rowPattern.exec(html)) !== null) {
      pageMatches++;
      const [, rawHref, rawTitle, rawDate] = match;
      const title = stripHtml(rawTitle);
      if (!matchesKeyword(title, keyword)) continue;
      if (!inDateRange(rawDate, startDate, endDate)) continue;

      const detailUrl = normalizePortalUrl(rawHref, "https://www.smtech.go.kr");
      pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
    }

    if (pageMatches === 0) break;
  }

  return results;
}

export async function scrapeMsit(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchOption: "title",
    searchWord: keyword,
    searchTxt: keyword,
    pageIndex: "1",
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const blockPattern = /fn_detail\((\d+)\);[\s\S]*?unescape\('([^']+)'\)/gi;
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(html)) !== null) {
    const [, nttSeqNo, escapedTitle] = match;
    const title = decodeJsEscaped(escapedTitle);
    if (!matchesKeyword(title, keyword)) continue;

    const tail = html.slice(match.index, match.index + 1200);
    const dateMatch = tail.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
    const rawDate = dateMatch ? normalizeDate(dateMatch[0]) : startDate;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = appendQuery("https://www.msit.go.kr/bbs/view.do", {
      sCode: "user",
      mPid: "121",
      mId: "311",
      bbsSeqNo: "100",
      nttSeqNo,
    });

    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results;
}

export async function scrapeMohw(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    search_type: "title",
    search_text: keyword,
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /<a href="(\/board\.es\?[^"]*act=view[^"]*)"[^>]*class="txt_title"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:data-label="등록일"[^>]*>|등록일[^>]*>)\s*([\d-]+)/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, rawHref, rawTitle, rawDate] = match;
    const title = stripHtml(rawTitle);
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = normalizePortalUrl(rawHref, "https://www.mohw.go.kr");
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results;
}

export async function scrapeMss(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchKey: "title",
    searchVal: keyword,
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /doBbsFView\('(\d+)','(\d+)'[^)]*\)[^>]*title="([^"]+)"[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, cbIdx, bcIdx, rawTitle, y, m, d] = match;
    const title = stripHtml(rawTitle);
    const rawDate = `${y}-${m}-${d}`;
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = appendQuery("https://www.mss.go.kr/site/smba/ex/bbs/View.do", {
      cbIdx,
      bcIdx,
    });

    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results;
}

export async function scrapeKhidi(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    schType: "0",
    schText: keyword,
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /<a href="(\/board\/view[^"]*)"[^>]*title="([^"]+)"[\s\S]*?<td[^>]*>\s*(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, rawHref, rawTitle, y, m, d] = match;
    const title = stripHtml(rawTitle);
    const rawDate = `${y}-${m}-${d}`;
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = normalizePortalUrl(rawHref, "https://www.khidi.or.kr");
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results;
}

export async function scrapeRiis(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title",
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /pbancDetail\.do\?pbancId=([^&"']+)[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, pbancId, rawTitle, y, m, d] = match;
    const title = stripHtml(rawTitle);
    const rawDate = `${y}-${m}-${d}`;
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = appendQuery("https://www.riis.or.kr/html/pbanc/pbancDetail.do", {
      pbancId,
    });

    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results;
}

export async function scrapeInnopolis(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    schType: "1",
    schText: keyword,
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /href="([^"]*\/newBusiness\/view[^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, rawHref, rawTitle, y, m, d] = match;
    const title = stripHtml(rawTitle);
    const rawDate = `${y}-${m}-${d}`;
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = normalizePortalUrl(rawHref, "https://www.innopolis.or.kr");
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results;
}

export async function scrapeHtdream(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchCondition: "1",
    searchKeyword: keyword,
  });
  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();

  const rowPattern =
    /(?:PubAmtDetail\.do\?pubAmtSeq=(\d+)|addPubAmtView2\.do[^"']*pubAmtSeq=(\d+))[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;

  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(html)) !== null) {
    const pubAmtSeq = match[1] || match[2];
    const rawTitle = match[3];
    const rawDate = `${match[4]}-${match[5]}-${match[6]}`;
    const title = stripHtml(rawTitle);
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = appendQuery(
      "https://www.htdream.kr/main/pubAmt/PubAmtDetail.do",
      { pubAmtSeq }
    );

    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  if (results.length === 0) {
    return scrapeGenericListPage(portal, startDate, endDate, keyword, {
      detailPattern: /(PubAmtDetail\.do\?[^"' ]+|addPubAmtView2\.do[^"' ]+)/gi,
      baseUrl: "https://www.htdream.kr/main/pubAmt/",
    });
  }

  return results;
}

export async function scrapeGenericListPage(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string,
  options?: {
    detailPattern?: RegExp;
    baseUrl?: string;
    searchParams?: Record<string, string>;
  }
): Promise<ScrapedAnnouncement[]> {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title",
    searchKey: "title",
    searchVal: keyword,
    searchWord: keyword,
    schText: keyword,
    ...(options?.searchParams || {}),
  });

  const html = await fetchHtml(listUrl);
  const results: ScrapedAnnouncement[] = [];
  const seen = new Set<string>();
  const base = options?.baseUrl || new URL(portal.listUrl).origin;
  const detailPattern =
    options?.detailPattern ||
    /href="([^"]*(?:view|detail|View|Detail)[^"]*)"/gi;

  let match: RegExpExecArray | null;
  while ((match = detailPattern.exec(html)) !== null) {
    const href = match[1] || match[0];
    if (!href || /#|javascript:|mailto:/i.test(href)) continue;

    const hrefIndex = match.index;
    const contextStart = Math.max(0, hrefIndex - 250);
    const contextEnd = Math.min(html.length, hrefIndex + 500);
    const context = html.slice(contextStart, contextEnd);
    const titleMatch = context.match(/>([^<]{8,200})</);
    const title = titleMatch ? stripHtml(titleMatch[1]) : "";
    if (!title || !matchesKeyword(title, keyword)) continue;

    const dateMatch = context.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
    const rawDate = dateMatch ? normalizeDate(dateMatch[0]) : startDate;
    if (!inDateRange(rawDate, startDate, endDate)) continue;

    const detailUrl = normalizePortalUrl(href, base);
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }

  return results.slice(0, 40);
}

async function scrapePortal(
  portal: PortalDefinition,
  startDate: string,
  endDate: string,
  keyword: string
): Promise<ScrapedAnnouncement[]> {
  const domain = portal.domains[0];

  switch (domain) {
    case "iris.go.kr":
      return scrapeIris(portal, startDate, endDate, keyword);
    case "ntis.go.kr":
      return scrapeNtis(portal, startDate, endDate, keyword);
    case "keit.re.kr":
    case "srome.keit.re.kr":
      return scrapeKeit(portal, startDate, endDate, keyword);
    case "kiat.or.kr":
      return scrapeKiat(portal, startDate, endDate, keyword);
    case "smtech.go.kr":
      return scrapeSmtech(portal, startDate, endDate, keyword);
    case "msit.go.kr":
      return scrapeMsit(portal, startDate, endDate, keyword);
    case "mohw.go.kr":
      return scrapeMohw(portal, startDate, endDate, keyword);
    case "mss.go.kr":
      return scrapeMss(portal, startDate, endDate, keyword);
    case "khidi.or.kr":
      return scrapeKhidi(portal, startDate, endDate, keyword);
    case "riis.or.kr":
      return scrapeRiis(portal, startDate, endDate, keyword);
    case "innopolis.or.kr":
      return scrapeInnopolis(portal, startDate, endDate, keyword);
    case "htdream.kr":
      return scrapeHtdream(portal, startDate, endDate, keyword);
    default:
      return scrapeGenericListPage(portal, startDate, endDate, keyword);
  }
}

export async function scrapeAllPortals(
  startDate: string,
  endDate: string,
  keyword = "AI"
): Promise<ScrapeSummary> {
  const announcements: ScrapedAnnouncement[] = [];
  const portalStats: Record<string, number> = {};
  const errors: { portal: string; message: string }[] = [];
  const globalSeen = new Set<string>();

  // 포털은 순차로 수집한다. 일부 정부 포털이 동시 요청 시 검색 결과를 빈 페이지로
  // 돌려주는(소프트 차단) 문제가 있어, 안정성을 위해 한 번에 하나씩 호출한다.
  for (const portal of PORTALS) {
    try {
      const scraped = await scrapePortal(portal, startDate, endDate, keyword);
      portalStats[portal.name] = scraped.length;

      for (const item of scraped) {
        const key = `${item.portal}::${item.url}`;
        if (globalSeen.has(key)) continue;
        globalSeen.add(key);
        announcements.push(item);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ portal: portal.name, message });
      portalStats[portal.name] = 0;
    }
  }

  announcements.sort((a, b) => b.date.localeCompare(a.date));

  return {
    announcements,
    scrapedPortalCount: Object.values(portalStats).filter((count) => count > 0).length,
    portalStats,
    errors,
  };
}
