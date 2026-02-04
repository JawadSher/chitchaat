import { findContact } from "@/server-actions/contact";
import { useQuery } from "@tanstack/react-query";

export const useFindContact = ({userName, enabled}:{userName: string, enabled: boolean}) => {
  return useQuery({
    queryKey: ["find-contact", userName],
    queryFn: async () => {
      return await findContact({ userName });
    },
    staleTime: 60_000,
    enabled: enabled && !!userName
  });
};
