// ─────────────────────────────────────────────────────────
// types/dangerZone.types.ts
//
// TypeScript interfaces for Danger Zone API responses.
// ─────────────────────────────────────────────────────────

export interface DangerZoneStatus {
  trade_count: number;
  snapshot_count: number;
  report_count: number;
  ai_feedback_count: number;
  trade_emotion_count: number;
}

export interface DangerZoneActionResponse {
  message: string;
  deleted_count?: number;
  trades_deleted?: number;
  snapshots_deleted?: number;
}

export interface ResetSnapshotsResponse extends DangerZoneActionResponse {
  deleted_count: number;
}

export interface ClearReportsResponse extends DangerZoneActionResponse {
  deleted_count: number;
}

export interface DeleteAIFeedbackResponse extends DangerZoneActionResponse {
  deleted_count: number;
}

export interface DeleteTradesResponse {
  message: string;
  trades_deleted: number;
  snapshots_deleted: number;
}

export interface DeleteAccountResponse {
  message: string;
}

export interface DangerZoneError {
  error: string;
}
