"use client";

import MainHeader from "@/components/main-header";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellRing, MessageSquareText, Phone, UsersRound } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useSession,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SplashScreen from "@/components/splash-screen";
import { getSupabaseClient } from "@/lib/supabase/createBrowserClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { useQueryClient } from "@tanstack/react-query";

type TabItem = {
  Icon: keyof typeof icons;
  value: string;
};

const icons = {
  MessageSquareText,
  Phone,
  BellRing,
  UsersRound,
};

const items: TabItem[] = [
  { Icon: "MessageSquareText", value: "chat" },
  { Icon: "Phone", value: "call" },
  { Icon: "BellRing", value: "notification" },
  { Icon: "UsersRound", value: "my-network" },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { session } = useSession();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const client = useQueryClient();

  const channelRef = useRef<RealtimeChannel | null>(null);

  const currentTab = searchParams.get("tab") || "chat";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    if (!user?.id || !session) return;

    let isMounted = true;

    const setupRealtime = async () => {
      try {
        const token = await session.getToken({ template: "supabase" });
        if (!isMounted || !token) return;

        await supabase.realtime.setAuth(token);

        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        const notificationChannel = supabase
          .channel(`notifications:${user.id}`, {
            config: {
              private: true,
            },
          })
          .on("broadcast", { event: "INSERT" }, (payload) => {
            client.invalidateQueries({
              queryKey: ["get-invitations", user?.id],
            });
            client.invalidateQueries({
              queryKey: ["notifications", user?.id],
            });
            toast(payload.payload.title, {
              action: {
                label: "View",
                onClick: () => router.push(ROUTES.NOTIFICATIONS),
              },
              description: payload.payload.body,
              className:
                "bg-secondary text-secondary-foreground border-none py-0",
            });
          })
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("Successfully subscribed to notifications channel");
            } else if (status === "CHANNEL_ERROR") {
              console.error("Error subscribing to channel");
            } else if (status === "TIMED_OUT") {
              console.error("Subscription timed out");
            } else if (status === "CLOSED") {
              console.log("Channel closed");
            }
          });

        channelRef.current = notificationChannel;
      } catch (error) {
        console.error("Error setting up Realtime:", error);
      }
    };

    const refreshAuth = async () => {
      try {
        const token = await session.getToken({ template: "supabase" });
        if (!isMounted || !token) return;
        await supabase.realtime.setAuth(token);
      } catch (error) {
        console.error("Error refreshing auth:", error);
      }
    };

    setupRealtime();

    const refreshInterval = setInterval(refreshAuth, 50_000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, session, supabase]);

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="flex flex-1 overflow-hidden"
    >
      <div className="flex flex-1 overflow-hidden">
        <div className="max-w-fit bg-sidebar flex flex-col justify-between">
          <TabsList className="flex bg-sidebar flex-col flex-1 items-center justify-start gap-2 p-2 border-none rounded-none w-14">
            {items.map((item) => {
              const Icon = icons[item.Icon];
              return (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="flex items-center justify-center dark:data-[state=active]:bg-primary-foreground gap-2 rounded-full border-none max-h-9 min-w-9 p-2 cursor-pointer"
                >
                  <Icon className="size-5" strokeWidth={1.89} />
                </TabsTrigger>
              );
            })}
          </TabsList>
          <div className="w-full h-fit flex flex-col items-center gap-2 p-2">
            <ModeToggle />
            <SignedOut>
              <SignInButton>
                <Button className="bg-primary rounded-full font-medium text-sm sm:text-base px-4 sm:px-5 cursor-pointer">
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "min-w-9 min-h-9 border-2 border-red",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>

        <div className="flex-1 h-full bg-background border-primary border-r-0  border-l border-t rounded-tl-lg overflow-clip">
          {children}
        </div>
      </div>
    </Tabs>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <SplashScreen />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <MainHeader />
      <Suspense fallback={<SplashScreen />}>
        <AppLayoutContent>{children}</AppLayoutContent>
      </Suspense>
    </div>
  );
}

export default AppLayout;
