import { useSupabase } from "@/providers/supabase-provider";
import { findContact } from "@/services/contact.service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useFindContact = ({
  userName,
  enabled,
}: {
  userName: string;
  enabled: boolean;
}) => {
  const supabase = useSupabase();
  const { user } = useUser();

  return useQuery({
    queryKey: ["find-contact", userName],
    queryFn: async () => {
      return await findContact(supabase, { userName, userId: user?.id });
    },
    staleTime: 60_000,
    enabled: enabled && !!userName,
  });
};
