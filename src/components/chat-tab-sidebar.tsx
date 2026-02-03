/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisVertical, Search, SquarePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ResizablePanel } from "./ui/resizable";
import { Input } from "./ui/input";
import { TabsList, TabsTrigger } from "./ui/tabs";
import Image from "next/image";

function ChatTabSidebar() {
  return (
    <ResizablePanel
      defaultSize={20}
      minSize={16}
      maxSize={40}
      className="p-2 flex flex-1 w-full flex-col items-start gap-2"
    >
      <div className="w-full flex items-center justify-between">
        <Label className="font-normal text-lg">Chats</Label>
        <div className="flex items-center gap-2">
          <Button className="p-0 h-8 w-8 rounded-full bg-accent hover:bg-primary-foreground cursor-pointer">
            <SquarePlus className="size-4 text-primary" strokeWidth={1.89} />
          </Button>
          <Button className="p-0 h-8 w-8 rounded-full bg-accent hover:bg-primary-foreground cursor-pointer">
            <EllipsisVertical
              className="size-4 text-primary"
              strokeWidth={1.89}
            />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full h-fit relative">
          <Input
            className="rounded-full border-none pl-8"
            placeholder="Search your friends list..."
          />
          <Search
            className="size-4 absolute top-1/2 left-2 -translate-y-1/2 text-foreground"
            strokeWidth={1.89}
          />
        </div>
      </div>
      <div className="w-full h-full">
        <TabsList className="flex flex-col justify-start w-full min-h-full bg-transparent gap-1">
          {Array.from({ length: 5 }).map((_, index: number) => {
            return (
              <TabsTrigger
                key={index}
                value={`user${index}`}
                className="flex items-center justify-start gap-2 rounded-md border-none w-full max-h-fit p-2 cursor-pointer
    hover:bg-accent/60 dark:data-[state=active]:bg-accent/60 data-[state=active]:text-foreground transition-colors"
              >
                <div className="rounded-full min-w-10 min-h-10 border"></div>

                <div className="flex flex-col items-start justify-center overflow-hidden min-w-0">
                  <h2 className="text-sm font-medium">User {index}</h2>
                  <span className="text-xs text-muted-foreground">
                    This is the last message we did.
                  </span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </ResizablePanel>
  );
}

export default ChatTabSidebar;
