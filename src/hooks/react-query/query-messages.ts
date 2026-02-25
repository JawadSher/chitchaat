import { useSupabase } from "@/providers/supabase-provider";
import { getMessages } from "@/services/message.service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useGetMessages = ({ recipient_id, limit = 100 }: { recipient_id: string, limit?: number }) => {
  const supabase = useSupabase();
  const { user } = useUser();
  return useQuery({
    queryKey: ["messages", recipient_id],
    queryFn: async () => {
      return await getMessages(supabase, { user_id: user?.id!, recipient_id });
    },
    enabled: !!user?.id && !!recipient_id,
    staleTime: 1000 * 60,
  });
};
