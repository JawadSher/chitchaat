export interface ISendMessageProps {
  sender_id?: string;
  message_type: "text" | "image" | "video" | "audio" | "file" | "voice_note";
  content: string;
  media_url?: string;
  file_name?: string;
  file_size?: number;
  duration?: number;
  reply_to_message_id?: string;
  recipient_id?: string;
}
