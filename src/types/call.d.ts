export interface Call {
  id: number;
  call_type: "video" | "audio";
  group_id: number;
  status: "ringing" | "ongoing" | "ended" | "missed" | "rejected" | "accepted";
  started_at: Date | number;
  ended_at: Date | number;
  duration: number;
  is_deleted?: boolean;
  caller_id?: number;
  participant_id?: number;
  call_mode: "direct" | "group";
  created_at: Date | number;
  participants?: [
    {
      id?: number;
      created_at?: Date | number;
      updated_at?: Date | number;
      call_id?: string;
      callee_id: string;
      is_delete?: boolean;
    },
  ];
}
