"use client";

import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/useAuth";
import { Loader } from "@/components/loader";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Password must be at least 8 characters long, include uppercase, lowercase, and a number",
    ),
});

export default function SignInPage() {
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);
  const { mutate: loginFn, isPending } = useLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      hasShownToast.current = false;
      loginFn({
        formData: {
          email: value.email,
          password: value.password,
        },
      });
    },
  });

 useEffect(() => {
  const code = searchParams.get("CODE");

  if (code === "invalid_credentials" && !hasShownToast.current) {
    toast.error("Invalid email or password");
    hasShownToast.current = true;
  }
}, [searchParams]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-background shadow-xl grid grid-cols-1 md:grid-cols-2">
        <Card className="rounded-none border-0 shadow-none flex flex-col justify-center">
          <CardHeader className="space-y-4">
            <Logo />

            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold">
                Welcome back 👋
              </CardTitle>
              <CardDescription>
                Sign in to continue to your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form
              id="login-form"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel>Email address</FieldLabel>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={isInvalid}
                        type="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel>Email address</FieldLabel>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="**************"
                        autoComplete="password"
                        aria-invalid={isInvalid}
                        type="password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              disabled={isPending}
              type="submit"
              form="login-form"
              className="w-full h-11 text-base rounded-md cursor-pointer"
            >
              {isPending && <Loader className="size-5" />} Continue with email
            </Button>

            {/* OR separator */}
            <div className="relative w-full flex items-center">
              <Separator className="flex-1" />
              <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
              disabled={isPending}
            >
              <Image
                src={IMAGES.ICONS.GOOGLE}
                height={17}
                width={17}
                alt="google"
              />
              Continue with Google
            </Button>
          </CardFooter>
        </Card>

        <div className="hidden md:flex items-center justify-center bg-muted p-8 relative">
          <div className="relative w-full h-full max-w-md">
            <Image
              src={IMAGES.SVGS.LOGIN}
              alt="Login Illustration"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
