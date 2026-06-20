import { AlertCircle } from "lucide-react";

interface WarningBannerProps {
  message: string;
}

export function WarningBanner({ message }: WarningBannerProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-3xs flex items-start space-x-3 text-xs text-amber-900 leading-relaxed">
      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
      <div>
        <span className="font-bold block mb-0.5">⚠️ 공고 수집 방식 및 상태 안내</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
