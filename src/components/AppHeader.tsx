import { FileSpreadsheet } from "lucide-react";

const APP_VERSION = "v1.2.0";

export function AppHeader() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" id="header-icon" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-neutral-900" id="header-title">AI 공고 추출기</h1>
            <p className="text-[10px] text-neutral-500 font-mono -mt-0.5">National R&D AI Notice Deduplicator</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src="/wmIT-logo.png"
            alt="원주의료기기산업진흥원"
            className="h-7 w-auto object-contain"
          />
          <span className="text-xs text-neutral-400 font-mono hidden md:inline">{APP_VERSION}</span>
        </div>
      </div>
    </header>
  );
}
