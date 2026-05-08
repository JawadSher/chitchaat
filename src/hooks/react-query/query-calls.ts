import { useSupabase } from "@/providers/supabase-provider";
import { getCalls } from "@/services/call.service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useGetCalls = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  return useQuery({
    queryKey: ["get-calls"],
    queryFn: async () => {
      return await getCalls(supabase, { userId: user?.id! });
    },
    staleTime: 1000 * 60,
  });
};
