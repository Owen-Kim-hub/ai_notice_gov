import { ExternalLink } from "lucide-react";
import { PORTALS_LIST } from "../constants";

/**
 * 포털명을 본문과 상태표기로 분리한다. 이름 끝의 "(추출 제외 …)"처럼 추출/제외를
 * 담은 괄호 표기는 별도 줄로 내려 보여주고, "(IRIS)" 같은 약어는 본문에 그대로 둔다.
 */
function splitPortalName(name: string): { main: string; note: string | null } {
  const m = name.match(/^(.*?)\s*(\([^()]*(?:추출|제외)[^()]*\))\s*$/);
  return m ? { main: m[1], note: m[2] } : { main: name, note: null };
}

export function PortalList() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
      <h3 className="font-semibold text-xs text-neutral-400 uppercase tracking-wider mb-3">연동 및 보정 포털 리스트</h3>
      <div className="space-y-1.5 text-xs">
        {PORTALS_LIST.map((p) => {
          const { main, note } = splitPortalName(p.name);
          return (
          <div key={p.rank} className="flex items-start justify-between py-1 border-b border-neutral-50/50 last:border-0 hover:bg-neutral-50 px-1 rounded">
            <div className="flex items-start space-x-2 min-w-0">
              <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 bg-neutral-100 text-neutral-600 mt-0.5">
                {p.rank}
              </span>
              <span className="whitespace-normal break-keep text-neutral-700 font-medium" title={p.name}>
                {main}
                {note && <span className="block font-normal text-neutral-400">{note}</span>}
              </span>
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
          );
        })}
      </div>
    </div>
  );
}
