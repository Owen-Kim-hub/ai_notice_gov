import { useCallback, useState } from "react";

interface CopyState {
  /** 최근 복사에 성공한 항목의 식별자 (없으면 null) */
  copiedId: string | null;
  /** 텍스트를 복사하고 지정한 id를 일정 시간 동안 "복사됨" 상태로 표시 */
  copy: (text: string, id: string) => void;
}

const COPIED_FEEDBACK_MS = 2000;

export function useCopyToClipboard(): CopyState {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), COPIED_FEEDBACK_MS);
    });
  }, []);

  return { copiedId, copy };
}
