import { ExternalLink } from "lucide-react";
import { PORTALS_LIST } from "../constants";

export function PortalList() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
      <h3 className="font-semibold text-xs text-neutral-400 uppercase tracking-wider mb-3">연동 및 보정 포털 리스트</h3>
      <div className="space-y-1.5 text-xs">
        {PORTALS_LIST.map((p) => (
          <div key={p.rank} className="flex items-center justify-between py-1 border-b border-neutral-50/50 last:border-0 hover:bg-neutral-50 px-1 rounded">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 bg-neutral-100 text-neutral-600">
                {p.rank}
              </span>
              <span className="truncate text-neutral-700 font-medium" title={p.name}>{p.name}</span>
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-indigo-600 shrink-0 ml-1"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
