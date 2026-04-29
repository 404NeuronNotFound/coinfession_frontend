export interface APIKeyRecord {
  id: number;
  provider: string;
  key_suffix: string;
  plan: string;
  last_used: string | null;
  created_at: string;
  is_connected: boolean;
}

export interface APIKeySaveResponse {
  id: number;
  provider: string;
  key_suffix: string;
  plan: string;
  created_at: string;
  full_key: string;
  warning: string;
}

export interface APIKeyWritePayload {
  provider: string;
  key: string;
}

export interface APIKeyPingResult {
  ok: boolean;
  latency_ms?: number;
  error?: string;
}
