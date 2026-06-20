import { useCallback, useRef, useState } from "react";
import { ExtractResponse } from "../types";

export interface ExtractParams {
  startDate: string;
  endDate: string;
  keywords: string[];
}

interface ExtractionState {
  loading: boolean;
  data: ExtractResponse | null;
  error: string | null;
  extract: (params: ExtractParams) => Promise<void>;
}

/**
 * 공고 추출 API 호출과 로딩/결과/오류 상태를 관리한다.
 * 연속 요청 시 마지막 요청의 응답만 반영하도록 race-guard를 적용한다.
 */
export function useAnnouncementExtraction(): ExtractionState {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  const extract = useCallback(async ({ startDate, endDate, keywords }: ExtractParams) => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate, keywords }),
      });

      if (!response.ok) {
        throw new Error("서버로부터 공고 데이터를 추출하는 중에 오류가 발생했습니다.");
      }

      const json: ExtractResponse = await response.json();
      if (latestRequestId.current === requestId) {
        setData(json);
      }
    } catch (err: any) {
      if (latestRequestId.current === requestId) {
        setError(err?.message || "네트워크 통신 오류가 발생했습니다.");
      }
    } finally {
      if (latestRequestId.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  return { loading, data, error, extract };
}
