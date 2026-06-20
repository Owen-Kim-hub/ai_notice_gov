// server/portals.ts
var PORTALS = [
  {
    name: "\uBC94\uBD80\uCC98\uD1B5\uD569\uC5F0\uAD6C\uC9C0\uC6D0\uC2DC\uC2A4\uD15C (IRIS)",
    domains: ["iris.go.kr"],
    listUrl: "https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do",
    department: "\uACFC\uD559\uAE30\uC220\uC815\uBCF4\uD1B5\uC2E0\uBD80"
  },
  {
    name: "\uAD6D\uAC00\uACFC\uD559\uAE30\uC220\uC9C0\uC2DD\uC815\uBCF4\uC11C\uBE44\uC2A4 (NTIS)",
    domains: ["ntis.go.kr"],
    listUrl: "https://www.ntis.go.kr/rndgate/eg/un/ra/mng.do",
    department: "\uACFC\uD559\uAE30\uC220\uC815\uBCF4\uD1B5\uC2E0\uBD80"
  },
  {
    name: "\uD55C\uAD6D\uC0B0\uC5C5\uAE30\uC220\uAE30\uD68D\uD3C9\uAC00\uC6D0 (KEIT)",
    domains: ["keit.re.kr", "srome.keit.re.kr"],
    listUrl: "https://srome.keit.re.kr/srome/biz/perform/opnnPrpsl/retrieveTaskAnncmListView.do?prgmId=XPG201040000",
    department: "\uC0B0\uC5C5\uD1B5\uC0C1\uC790\uC6D0\uBD80"
  },
  {
    name: "\uD55C\uAD6D\uC0B0\uC5C5\uAE30\uC220\uC9C4\uD765\uC6D0 (KIAT)",
    domains: ["kiat.or.kr"],
    listUrl: "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90",
    department: "\uC0B0\uC5C5\uD1B5\uC0C1\uC790\uC6D0\uBD80"
  },
  {
    name: "\uD55C\uAD6D\uBCF4\uAC74\uC0B0\uC5C5\uC9C4\uD765\uC6D0 (KHIDI)",
    domains: ["khidi.or.kr"],
    listUrl: "https://www.khidi.or.kr/board?menuId=MENU01108",
    department: "\uBCF4\uAC74\uBCF5\uC9C0\uBD80"
  },
  {
    name: "\uC911\uC18C\uAE30\uC5C5 \uAE30\uC220\uAC1C\uBC1C\uC0AC\uC5C5 \uC885\uD569\uAD00\uB9AC\uC2DC\uC2A4\uD15C (smtech)",
    domains: ["smtech.go.kr"],
    listUrl: "https://www.smtech.go.kr/front/ifg/no/notice02_list.do",
    department: "\uC911\uC18C\uBCA4\uCC98\uAE30\uC5C5\uBD80"
  },
  {
    name: "\uBC94\uBD80\uCC98\uC804\uC8FC\uAE30\uC758\uB8CC\uAE30\uAE30\uC5F0\uAD6C\uAC1C\uBC1C\uC0AC\uC5C5\uB2E8",
    domains: ["kmdf.org"],
    listUrl: "https://kmdf.org/official",
    department: "\uBCF4\uAC74\uBCF5\uC9C0\uBD80"
  },
  {
    name: "\uC758\uB8CC\uAE30\uAE30\uC0B0\uC5C5 \uC885\uD569\uC815\uBCF4\uC2DC\uC2A4\uD15C",
    domains: ["khidi.or.kr"],
    listUrl: "https://www.khidi.or.kr/board?menuId=MENU01484&siteId=SITE00039",
    department: "\uBCF4\uAC74\uBCF5\uC9C0\uBD80"
  },
  {
    name: "\uC0B0\uC5C5\uD1B5\uC0C1\uC790\uC6D0\uBD80",
    domains: ["motir.go.kr", "motie.go.kr"],
    listUrl: "https://www.motir.go.kr/kor/article/ATCL2826a2625",
    department: "\uC0B0\uC5C5\uD1B5\uC0C1\uC790\uC6D0\uBD80"
  },
  {
    name: "\uBCF4\uAC74\uBCF5\uC9C0\uBD80",
    domains: ["mohw.go.kr"],
    listUrl: "https://www.mohw.go.kr/board.es?mid=a10501010200&bid=0003&cg_code=C01",
    department: "\uBCF4\uAC74\uBCF5\uC9C0\uBD80"
  },
  {
    name: "\uACFC\uD559\uAE30\uC220\uC815\uBCF4\uD1B5\uC2E0\uBD80",
    domains: ["msit.go.kr"],
    listUrl: "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=121&mId=311",
    department: "\uACFC\uD559\uAE30\uC220\uC815\uBCF4\uD1B5\uC2E0\uBD80"
  },
  {
    name: "\uBCF4\uAC74\uC758\uB8CC\uAE30\uC220 \uC885\uD569\uC815\uBCF4\uC2DC\uC2A4\uD15C (HTDream)",
    domains: ["htdream.kr"],
    listUrl: "https://www.htdream.kr/main/pubAmt/PubAmtList.do",
    department: "\uBCF4\uAC74\uBCF5\uC9C0\uBD80"
  },
  {
    name: "\uAC15\uC6D0\uC5F0\uAD6C\uAC1C\uBC1C\uD2B9\uAD6C",
    domains: ["innopolis.or.kr"],
    listUrl: "https://www.innopolis.or.kr/newBusiness?menuId=MENU01028",
    department: "\uC5F0\uAD6C\uAC1C\uBC1C\uD2B9\uAD6C\uC9C4\uD765\uC7AC\uB2E8"
  },
  {
    name: "(\uCC38\uACE0) \uAC15\uC6D0\uC9C0\uC5ED\uC0B0\uC5C5\uC9C4\uD765\uC6D0",
    domains: ["riis.or.kr"],
    listUrl: "https://www.riis.or.kr/html/pbanc/pbancList.do",
    department: "\uAC15\uC6D0\uC9C0\uC5ED\uC0B0\uC5C5\uC9C4\uD765\uC6D0"
  },
  {
    name: "\uC911\uC18C\uBCA4\uCC98\uAE30\uC5C5\uBD80",
    domains: ["mss.go.kr"],
    listUrl: "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310",
    department: "\uC911\uC18C\uBCA4\uCC98\uAE30\uC5C5\uBD80"
  }
];

// server/portalScraper.ts
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var FETCH_HEADERS = {
  "User-Agent": USER_AGENT,
  "Accept-Language": "ko-KR,ko;q=0.9"
};
var FETCH_RETRY_DELAYS_MS = [600, 1500];
var FETCH_TIMEOUT_MS = 8e3;
function appendQuery(url, params) {
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value === void 0 || value === "") continue;
    parsed.searchParams.set(key, String(value));
  }
  return parsed.toString();
}
function normalizePortalUrl(url, base) {
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
function stripHtml(html) {
  return decodeHtmlEntities(
    html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
  );
}
function decodeHtmlEntities(text) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
}
function decodeJsEscaped(text) {
  try {
    return decodeURIComponent(text.replace(/\+/g, "%20"));
  } catch {
    return text;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function normalizeDate(value) {
  const match = value.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!match) return value.trim();
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}
function inDateRange(date, startDate, endDate) {
  const normalized = normalizeDate(date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return true;
  return normalized >= startDate && normalized <= endDate;
}
function matchesKeyword(text, keyword) {
  const needle = keyword.trim();
  if (!needle) return true;
  const haystack = text.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  if (haystack.includes(lowerNeedle)) return true;
  if (lowerNeedle === "ai" && /인공지능/.test(text)) return true;
  return false;
}
async function fetchHtml(url, init) {
  let lastError;
  for (let attempt = 0; attempt <= FETCH_RETRY_DELAYS_MS.length; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...FETCH_HEADERS,
          ...init?.headers || {}
        },
        redirect: "follow",
        signal: controller.signal
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
    if (retryDelay !== void 0) {
      await sleep(retryDelay);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`Failed to fetch ${url}`);
}
function buildAnnouncement(portal, title, url, date, description = "") {
  return {
    title: stripHtml(title),
    portal: portal.name,
    url: normalizePortalUrl(url),
    date: normalizeDate(date),
    department: portal.department,
    description: description || stripHtml(title).slice(0, 160)
  };
}
function pushUnique(bucket, item, seen) {
  const key = `${item.portal}::${item.url}`;
  if (seen.has(key)) return;
  seen.add(key);
  bucket.push(item);
}
async function scrapeIris(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title"
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /f_bsnsAncmBtinSituListForm_view\('([^']+)','[^']+'\)[^>]*>([\s\S]*?)<\/a>[\s\S]*?공고일자\s*:<\/em>\s*(\d{4}-\d{2}-\d{2})/gi;
  let match;
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
async function scrapeNtis(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    pageNo: "1"
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /fn_view\('(\d+)'\)[\s\S]*?title="([^"]+)"[\s\S]*?접수일[^>]*>\s*([\d.]+)/gi;
  let match;
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
async function scrapeKeit(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title"
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /f_detail\('([^']+)',\s*'(\d{4})'\)[\s\S]*?<span class="title">([\s\S]*?)<\/span>[\s\S]*?등록일<\/span><span class="value">\s*(\d{4}-\d{2}-\d{2})/gi;
  let match;
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
        bsnsYy
      }
    );
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }
  return results;
}
async function scrapeKiat(portal, startDate, endDate, keyword) {
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const referer = "https://www.kiat.or.kr/front/board/boardContentsListPage.do?board_id=90";
  for (let page = 1; page <= 5; page++) {
    const ajaxUrl = appendQuery(
      "https://www.kiat.or.kr/front/board/boardContentsListAjax.do",
      {
        board_id: "90",
        page: String(page),
        searchKeyword: keyword,
        searchCondition: "title"
      }
    );
    const html = await fetchHtml(ajaxUrl, {
      headers: {
        Referer: referer,
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    const rowPattern = /contentsView\('([^']+)'\)[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4}-\d{2}-\d{2})/gi;
    let match;
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
          contents_id: contentsId
        }
      );
      pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
    }
    if (pageMatches === 0) break;
  }
  return results;
}
async function scrapeSmtech(portal, startDate, endDate, keyword) {
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (let page = 1; page <= 8; page++) {
    const listUrl = appendQuery(portal.listUrl, { pageIndex: String(page) });
    const html = await fetchHtml(listUrl);
    const rowPattern = /<a href="([^"]*notice02_detail\.do[^"]*)"[^>]*class="board"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4}-\d{2}-\d{2})/gi;
    let match;
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
async function scrapeMsit(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    searchOption: "title",
    searchWord: keyword,
    searchTxt: keyword,
    pageIndex: "1"
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const blockPattern = /fn_detail\((\d+)\);[\s\S]*?unescape\('([^']+)'\)/gi;
  let match;
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
      nttSeqNo
    });
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }
  return results;
}
async function scrapeMohw(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    search_type: "title",
    search_text: keyword
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /<a href="(\/board\.es\?[^"]*act=view[^"]*)"[^>]*class="txt_title"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:data-label="등록일"[^>]*>|등록일[^>]*>)\s*([\d-]+)/gi;
  let match;
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
async function scrapeMss(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    searchKey: "title",
    searchVal: keyword
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /doBbsFView\('(\d+)','(\d+)'[^)]*\)[^>]*title="([^"]+)"[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;
  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, cbIdx, bcIdx, rawTitle, y, m, d] = match;
    const title = stripHtml(rawTitle);
    const rawDate = `${y}-${m}-${d}`;
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;
    const detailUrl = appendQuery("https://www.mss.go.kr/site/smba/ex/bbs/View.do", {
      cbIdx,
      bcIdx
    });
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }
  return results;
}
async function scrapeKhidi(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    schType: "0",
    schText: keyword
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /<a href="(\/board\/view[^"]*)"[^>]*title="([^"]+)"[\s\S]*?<td[^>]*>\s*(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;
  let match;
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
async function scrapeRiis(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title"
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /pbancDetail\.do\?pbancId=([^&"']+)[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;
  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const [, pbancId, rawTitle, y, m, d] = match;
    const title = stripHtml(rawTitle);
    const rawDate = `${y}-${m}-${d}`;
    if (!matchesKeyword(title, keyword)) continue;
    if (!inDateRange(rawDate, startDate, endDate)) continue;
    const detailUrl = appendQuery("https://www.riis.or.kr/html/pbanc/pbancDetail.do", {
      pbancId
    });
    pushUnique(results, buildAnnouncement(portal, title, detailUrl, rawDate), seen);
  }
  return results;
}
async function scrapeInnopolis(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    schType: "1",
    schText: keyword
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /href="([^"]*\/newBusiness\/view[^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;
  let match;
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
async function scrapeHtdream(portal, startDate, endDate, keyword) {
  const listUrl = appendQuery(portal.listUrl, {
    searchCondition: "1",
    searchKeyword: keyword
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const rowPattern = /(?:PubAmtDetail\.do\?pubAmtSeq=(\d+)|addPubAmtView2\.do[^"']*pubAmtSeq=(\d+))[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/gi;
  let match;
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
      baseUrl: "https://www.htdream.kr/main/pubAmt/"
    });
  }
  return results;
}
async function scrapeGenericListPage(portal, startDate, endDate, keyword, options) {
  const listUrl = appendQuery(portal.listUrl, {
    searchKeyword: keyword,
    searchCondition: "title",
    searchKey: "title",
    searchVal: keyword,
    searchWord: keyword,
    schText: keyword,
    ...options?.searchParams || {}
  });
  const html = await fetchHtml(listUrl);
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  const base = options?.baseUrl || new URL(portal.listUrl).origin;
  const detailPattern = options?.detailPattern || /href="([^"]*(?:view|detail|View|Detail)[^"]*)"/gi;
  let match;
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
async function scrapePortal(portal, startDate, endDate, keyword) {
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
async function scrapeAllPortals(startDate, endDate, keyword = "AI") {
  const announcements = [];
  const portalStats = {};
  const errors = [];
  const globalSeen = /* @__PURE__ */ new Set();
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
    errors
  };
}

// server/deduplication.ts
var DUPLICATE_TITLE_SIMILARITY_THRESHOLD = 0.9;
function getTitleSimilarity(t1, t2) {
  const clean = (value) => value.replace(/[\s()[\]\-_,.:/\d년월일상반기하반기공고재공고선정결과신규과제]/g, "").trim();
  const c1 = clean(t1);
  const c2 = clean(t2);
  if (!c1 || !c2) return 0;
  if (c1 === c2) return 1;
  const set1 = new Set(c1);
  const set2 = new Set(c2);
  const intersection = new Set([...set1].filter((char) => set2.has(char)));
  const union = /* @__PURE__ */ new Set([...set1, ...set2]);
  return intersection.size / union.size;
}
function getPortalPriorityIndex(portalName) {
  const normalized = portalName.replace(/\s+/g, "").toLowerCase();
  for (let index = 0; index < PORTALS.length; index++) {
    const portal = PORTALS[index];
    const portalNormalized = portal.name.replace(/\s+/g, "").toLowerCase();
    if (normalized.includes(portalNormalized) || portalNormalized.includes(normalized)) {
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
function toKeepDeleteRecord(item) {
  return {
    title: item.title,
    portal: item.portal,
    priority: (item.priorityIndex ?? 999) + 1,
    date: item.date,
    url: item.url
  };
}
function deduplicateByTitle(items) {
  const kept = [];
  const duplicates = [];
  const sorted = [...items].sort((a, b) => {
    const priorityA = a.priorityIndex ?? 999;
    const priorityB = b.priorityIndex ?? 999;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return b.date.localeCompare(a.date);
  });
  for (const item of sorted) {
    let duplicateOf = null;
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
        reason: `\uC81C\uBAA9 \uC720\uC0AC\uB3C4 \uAE30\uC900 (${similarityPercent}%). \uACE0\uC21C\uC704 \uD3EC\uD138 [${duplicateOf.portal}] \uACF5\uACE0 \uBCF4\uC874 \uBC0F [${item.portal}] \uACF5\uACE0 \uD544\uD130`
      });
    } else {
      kept.push(item);
    }
  }
  return { kept, duplicates };
}

// server/extractLogic.ts
function normalizeKeywords(body) {
  const values = Array.isArray(body.keywords) ? body.keywords : [body.keyword || ""];
  return values.map((value) => value.trim()).filter(Boolean).slice(0, 3);
}
function announcementMatchesKeywords(item, keywords) {
  if (keywords.length === 0) return true;
  const haystack = [item.title, item.description, item.department, item.portal].join(" ").toLowerCase();
  return keywords.every((keyword) => haystack.includes(keyword.toLowerCase()));
}
function buildAnnouncementPool(announcements, keywords) {
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  for (const item of announcements) {
    const key = `${item.portal}::${item.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique.map((item) => ({ ...item, priorityIndex: getPortalPriorityIndex(item.portal) })).filter((item) => announcementMatchesKeywords(item, keywords));
}
function buildWarning(errors, finalCount) {
  let warning;
  if (errors.length > 0) {
    const failed = [...new Set(errors.map((error) => error.portal))].join(", ");
    warning = `\uC77C\uBD80 \uD3EC\uD138(${failed})\uC5D0\uC11C \uACF5\uACE0\uB97C \uAC00\uC838\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB098\uBA38\uC9C0 \uD3EC\uD138 \uACB0\uACFC\uB294 \uC815\uC0C1 \uBC18\uC601\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`;
  }
  if (finalCount === 0) {
    warning = warning ? `${warning} \uC870\uAC74\uC5D0 \uB9DE\uB294 \uACF5\uACE0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.` : "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uACF5\uACE0\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAC80\uC0C9 \uAE30\uAC04\uC774\uB098 \uD0A4\uC6CC\uB4DC\uB97C \uC870\uC815\uD574 \uBCF4\uC138\uC694.";
  }
  return warning;
}
async function handleExtract(req, res) {
  const body = req.body || {};
  const { startDate, endDate } = body;
  const keywords = normalizeKeywords(body);
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate\uC640 endDate\uB294 \uD544\uC218 \uC785\uB825 \uD56D\uBAA9\uC785\uB2C8\uB2E4." });
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
    warning: buildWarning(summary.errors, results.length),
    isFallback: false
  });
}

// scripts/vercel-extract-entry.ts
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  return handleExtract(req, res);
}
export {
  handler as default
};
