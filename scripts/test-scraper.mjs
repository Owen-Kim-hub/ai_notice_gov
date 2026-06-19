import { scrapeAllPortals } from "../server/portalScraper.ts";

const summary = await scrapeAllPortals("2026-01-01", "2026-06-30", "AI");
console.log("total", summary.announcements.length);
console.log("portals", summary.scrapedPortalCount);
console.log("stats", summary.portalStats);
console.log("errors", summary.errors);
console.log(
  summary.announcements.slice(0, 8).map((item) => ({
    portal: item.portal,
    title: item.title.slice(0, 50),
    url: item.url,
    date: item.date,
  }))
);
