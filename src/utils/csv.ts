import { Announcement } from "../types";
import { PORTALS_LIST } from "../constants";

const CSV_HEADERS = [
  "공고일자",
  "공고 포털",
  "연동 순위",
  "부처/기관",
  "공고문 제목",
  "요약 설명",
  "공고 주소",
];

function escapeCsvCell(value: string): string {
  return `"${(value || "").replace(/"/g, '""')}"`;
}

/** 결과 목록을 Excel 호환(UTF-8 BOM) CSV 문자열로 직렬화 */
export function buildAnnouncementsCsv(results: Announcement[]): string {
  const BOM = "﻿";
  const lines: string[] = [];

  lines.push(CSV_HEADERS.map(escapeCsvCell).join(","));

  results.forEach((item) => {
    const portalIndex = PORTALS_LIST.findIndex((p) => p.name === item.portal);
    const rankInfo = portalIndex !== -1 ? `${portalIndex + 1}위` : "기타";

    const row = [
      item.date,
      item.portal,
      rankInfo,
      item.department,
      item.title,
      item.description,
      item.url,
    ];
    lines.push(row.map(escapeCsvCell).join(","));
  });

  return BOM + lines.join("\n") + "\n";
}

/** 결과 목록을 CSV 파일로 다운로드 */
export function downloadAnnouncementsCsv(
  results: Announcement[],
  startDate: string,
  endDate: string
): void {
  if (results.length === 0) return;

  const csvContent = buildAnnouncementsCsv(results);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `WMIT_공고추출결과_${startDate}_to_${endDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
