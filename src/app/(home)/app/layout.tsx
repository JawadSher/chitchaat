"use client";

import MainHeader from "@/components/main-header";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareText, Phone } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

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

  return (
    <div className="w-full h-screen flex flex-col">
      <MainHeader />

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="flex flex-1 overflow-hidden"
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="max-w-fit bg-sidebar">
            <TabsList className="flex bg-sidebar flex-col flex-1 items-center justify-start gap-2 p-2 border-none rounded-none w-14">
              {items.map((item) => {
                const Icon = icons[item.Icon];
                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="flex items-center justify-center gap-2 rounded-full border-none h-fit p-2 cursor-pointer"
                  >
                    <Icon className="size-5" strokeWidth={1.89} />
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="flex-1 h-full bg-background border-l border-t rounded-tl-lg overflow-auto">
            {children}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default AppLayout;
