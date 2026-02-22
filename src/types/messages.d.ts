export interface IMessages {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_type: "text" | "image" | "video" | "audio" | "file" | "voice_note";
  content: string;
  media_url?: string;
  file_name?: string;
  file_size?: number;
  duration?: number;
  reply_to_message_id?: string;
  is_edited: boolean;
  message_read_status: "sent" | "delivered" | "read";
  created_at?: string;
}
