import { motion } from "motion/react";
import { ExternalLink, Copy, Check, Search } from "lucide-react";
import { Announcement } from "../types";
import { PORTALS_LIST } from "../constants";
import { getAnnouncementOpenLink } from "../utils/openLink";

interface ResultCardProps {
  item: Announcement;
  index: number;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export function ResultCard({ item, index, copiedId, onCopy }: ResultCardProps) {
  const portalInfo = PORTALS_LIST.find((p) => p.name === item.portal);
  const pRank = portalInfo ? portalInfo.rank : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
      className="py-4 first:pt-0 last:pb-0 hover:bg-neutral-50/70 rounded-lg px-2 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 max-w-full">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-mono text-neutral-500 shrink-0 bg-neutral-100 px-1.5 py-0.5 rounded">
              {item.date}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
              pRank === 1
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : pRank && pRank <= 3
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-neutral-100 text-neutral-700 border-neutral-200"
            }`}>
              {item.portal}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium truncate">
              {item.department}
            </span>
          </div>

          <a
            href={getAnnouncementOpenLink(item.url)}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="group/title block cursor-pointer"
          >
            <h4 className="text-sm font-bold text-neutral-900 tracking-tight leading-snug mb-1 group-hover/title:text-indigo-600 transition-colors flex items-center flex-wrap gap-1">
              {item.title}
            </h4>
          </a>
          <p className="text-xs text-neutral-500 leading-relaxed mb-2 max-w-3xl line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Action items: direct login or connection */}
        <div className="shrink-0 flex flex-wrap sm:flex-col items-stretch justify-start gap-1.5 min-w-[130px] w-full sm:w-auto mt-2 sm:mt-0">
          {/* 1. Direct Access via Referer-safe gateway */}
          <a
            href={getAnnouncementOpenLink(item.url)}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-2.5 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
            title="Referer 차단을 우회하여 공고문 상세 페이지로 이동합니다"
          >
            <span>공고문 바로접속</span>
            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
          </a>

          {/* 2. Copy Deep URL */}
          <button
            onClick={() => onCopy(item.url, `url-${index}`)}
            className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
              copiedId === `url-${index}`
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs animate-pulse"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200"
            }`}
            title="상세한 개별 공고문 다이렉트 URL 주소를 고스란히 복사하여 새 주소창에 직접 붙여넣으십시요"
          >
            {copiedId === `url-${index}` ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>주소 복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                <span>세부 URL 복사</span>
              </>
            )}
          </button>

          {/* 3. Title copy and Search portal */}
          <button
            onClick={() => {
              onCopy(item.title, `title-${index}`);
              window.open(portalInfo ? portalInfo.url : item.url, "_blank", "noopener,noreferrer");
            }}
            className={`text-[10px] font-medium px-2 py-1 rounded-lg flex items-center justify-center space-x-1 border transition-all cursor-pointer ${
              copiedId === `title-${index}`
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                : "bg-white text-neutral-500 hover:bg-neutral-50 border-neutral-200"
            }`}
            title="제목을 클립보드에 복사하고 해당 포털의 정식 공지사항 목록 게시판으로 바로 갑니다"
          >
            {copiedId === `title-${index}` ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>제목 복사됨!</span>
              </>
            ) : (
              <>
                <Search className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                <span>홈페이지</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
