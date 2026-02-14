import { useSupabase } from "@/providers/supabase-provider";
import { getNotifications } from "@/services/notification.service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useNotification = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return await getNotifications(supabase, user?.id!);
    },
    staleTime: 60_000,
  });
};
