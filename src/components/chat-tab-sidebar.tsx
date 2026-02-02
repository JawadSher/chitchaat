import { EllipsisVertical, Search, SquarePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ResizablePanel } from "./ui/resizable";
import { Input } from "./ui/input";

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
          <Input className="rounded-full border-none pl-8" placeholder="Search your friends list..." />
          <Search
            className="size-4 absolute top-1/2 left-2 -translate-y-1/2 text-foreground"
            strokeWidth={1.89}
          />
          
        </div>
      </div>
    </ResizablePanel>
  );
}

export default ChatTabSidebar;
