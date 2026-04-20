export interface Call {
  id: number;
  call_type: "video" | "audio";
  group_id: number;
  status: "ringing" | "ongoing" | "ended" | "missed" | "rejected";
  started_at: Date | number;
  ended_at: Date | number;
  duration: number;
  is_deleted: boolean;
  caller_id: number;
  participant_id: number;
  call_mode: "direct" | "group";
  created_at: Date | number;
  updated_at: Date | number;
}
