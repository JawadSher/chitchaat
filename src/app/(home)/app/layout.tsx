/* eslint-disable @typescript-eslint/no-explicit-any */
import MainHeader from "@/components/main-header";
import React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareText, Phone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function AppLayout({ children }: { children: React.ReactNode }) {
  const icons: Record<string, React.ElementType> = {
    MessageSquareText,
    Phone,
  };

  const items = [
    {
      Icon: "MessageSquareText",
      value: "chats",
    },
    {
      Icon: "Phone",
      value: "calls",
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      <MainHeader />

      <Tabs defaultValue="chats" className="flex flex-1">
        <div className="flex w-full flex-1 h-screen">
          <div className="max-w-fit bg-sidebar">
            <TabsList className="flex bg-sidebar flex-col flex-1 items-center justify-start gap-2 p-2 border-none rounded-none w-14">
              {items.map((item: any) => {
                const Icon = icons[item.Icon];
                return (
                  <Tooltip key={item.value}>
                    <TooltipTrigger>
                      <TabsTrigger
                        className="flex items-center justify-center gap-2 rounded-full border-none h-fit p-2 cursor-pointer"
                        value={item.value}
                        key={item.value}
                      >
                        <Icon className="size-5" strokeWidth={1.89} />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.value}</TooltipContent>
                  </Tooltip>
                );
              })}
            </TabsList>
          </div>

          <div className="h-full w-full bg-sidebar">
            <div className="border-l border-t rounded-tl-lg h-full  bg-background">
              {/* {children} */}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default AppLayout;
