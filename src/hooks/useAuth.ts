import { login } from "@/server-actions/auth.actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      formData,
    }: {
      formData: { email: string; password: string };
    }) => {
      return await login({ formData });
    },
    onSuccess: () => {
      toast.success("Login Successfully");
    },
  });
};
