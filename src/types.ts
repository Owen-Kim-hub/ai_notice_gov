export interface Announcement {
  title: string;
  portal: string;
  url: string;
  date: string;
  department: string;
  description: string;
  priorityIndex?: number;
}

export interface KeepDeleteRecord {
  title: string;
  portal: string;
  priority: number;
  date: string;
  url: string;
}

export interface DeduplicationRecord {
  kept: KeepDeleteRecord;
  deleted: KeepDeleteRecord;
  reason: string;
}

export interface ExtractResponse {
  results: Announcement[];
  duplicatesFiltered: DeduplicationRecord[];
  portalCount: number;
  originalCount: number;
  finalCount: number;
  warning?: string;
  isFallback?: boolean;
  portalStats?: Record<string, number>;
}
