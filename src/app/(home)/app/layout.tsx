"use client";

import MainHeader from "@/components/main-header";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareText, Phone } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SplashScreen from "@/components/splash-screen";

type TabItem = {
  Icon: keyof typeof icons;
  value: string;
};

const icons = {
  MessageSquareText,
  Phone,
};

function AppLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const items: TabItem[] = [
    { Icon: "MessageSquareText", value: "chat" },
    { Icon: "Phone", value: "call" },
  ];

  const currentTab = searchParams.get("tab") || "chat";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
  };

  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <SplashScreen />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <MainHeader />

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
                    className="flex items-center justify-center gap-2 rounded-full border-none max-h-9 min-w-9 p-2 cursor-pointer"
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

          <div className="flex-1 h-full bg-background border-primary-foreground border-r-0 border border-l border-t rounded-tl-lg overflow-clip">
            {children}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default AppLayout;
