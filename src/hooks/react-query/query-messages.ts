import { useSupabase } from "@/providers/supabase-provider";
import { getMessages } from "@/services/message.service";
import { useUser } from "@clerk/nextjs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetMessages = ({ recipient_id, limit = 20 }: { recipient_id: string, limit?: number }) => {
  const supabase = useSupabase();
  const { user } = useUser();
  return useInfiniteQuery({
    queryKey: ["messages", recipient_id],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await getMessages(supabase, { user_id: user?.id!, recipient_id, limit, page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }

      return undefined;
    },
    enabled: !!user?.id && !!recipient_id,
    staleTime: 1000 * 60,
  });
};
