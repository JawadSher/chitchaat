"use client";
import "@livekit/components-styles";
import { useCallback, useMemo } from "react";
import {
  Clock3,
  Lock,
  MessageCircle,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  Search,
  UserRoundPlus,
  Video,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { TabsContent } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import UserAvatar from "./avatar";
import { requestUserMediaAccess } from "./chat-area-header";
import { useCallRNDState } from "@/store/use-call-rnd";

type CallStatus = "Outgoing" | "Missed" | "Incoming";

type CallItem = {
  id: string;
  name: string;
  number?: string;
  date: string;
  time: string;
  duration: string;
  status: CallStatus;
};

const mockCalls: CallItem[] = [
  {
    id: "1",
    name: "+92 313 9762310",
    date: "28/04/2026",
    time: "09:42 PM",
    duration: "2 hours",
    status: "Outgoing",
  },
  {
    id: "2",
    name: "+92 313 9762310",
    date: "28/04/2026",
    time: "05:14 PM",
    duration: "2 seconds",
    status: "Missed",
  },
  {
    id: "3",
    name: "+92 313 9762310",
    date: "28/04/2026",
    time: "12:06 PM",
    duration: "1 hour",
    status: "Outgoing",
  },
  {
    id: "4",
    name: "+92 313 9762310",
    date: "18/03/2026",
    time: "11:59 PM",
    duration: "3 days",
    status: "Missed",
  },
  {
    id: "5",
    name: "Saeed",
    number: "+92 301 985 8842",
    date: "03/12/2025",
    time: "10:12 AM",
    duration: "45 minutes",
    status: "Missed",
  },
  {
    id: "6",
    name: "Saeed",
    number: "+92 301 985 8842",
    date: "01/12/2025",
    time: "01:30 PM",
    duration: "18 minutes",
    status: "Missed",
  },
  {
    id: "7",
    name: "Saeed",
    number: "+92 301 985 8842",
    date: "01/12/2025",
    time: "08:05 PM",
    duration: "2 hours",
    status: "Outgoing",
  },
];

function StatusLine({ status }: { status: CallStatus }) {
  if (status === "Missed") {
    return (
      <p className="flex items-center gap-1 text-xs text-rose-500">
        <PhoneMissed className="size-3.5" /> Missed
      </p>
    );
  }

  if (status === "Incoming") {
    return (
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <PhoneIncoming className="size-3.5" /> Incoming
      </p>
    );
  }

  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <PhoneCall className="size-3.5" /> Outgoing
    </p>
  );
}

function Calls() {
  const setEnableCallRND = useCallRNDState((state) => state.setEnableCallRND);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [callType, setCallType] = useState<"video" | "audio">("video");
  const { user } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const cachedContacts =
    (queryClient.getQueryData(["get-contacts", user?.id]) as any[]) || [];
  const initialsMap = useMemo(() => {
    return new Map(
      mockCalls.map((item) => [
        item.id,
        item.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      ]),
    );
  }, []);

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <TabsContent value="call" className="h-full p-0">
      <div className="h-full w-full overflow-hidden bg-background text-foreground">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel
            defaultSize={30}
            minSize={22}
            maxSize={42}
            className="border-r border-border bg-accent/30 p-2"
          >
            <aside className="flex h-full min-h-0 flex-col gap-4">
              <h2 className="text-lg font-semibold">Calls</h2>

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

              <Separator className="max-w-[95%] mx-auto " />

              <div className="min-h-0 flex-1 overflow-y-auto px-2">
                <h3 className="mb-4 text-lg font-semibold">Recent</h3>
                <ul className="space-y-4">
                  {mockCalls.map((item) => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <li className="flex cursor-pointer items-start justify-between gap-4 rounded-md px-1 py-1 transition-colors hover:bg-accent/60">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold tracking-wide text-foreground">
                              {initialsMap.get(item.id)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-base font-medium text-foreground">
                                {item.name}
                              </p>
                              {item.number ? (
                                <p className="truncate text-xs text-muted-foreground">
                                  {item.number}
                                </p>
                              ) : null}
                              <StatusLine status={item.status} />
                            </div>
                          </div>
                          <span className="shrink-0 pt-1 text-xs text-muted-foreground">
                            {item.date}
                          </span>
                        </li>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="start"
                        className="w-56 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-md"
                      >
                        <p className="truncate text-sm font-semibold">
                          {item.name}
                        </p>
                        {item.number ? (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {item.number}
                          </p>
                        ) : null}
                        <div className="mt-2 space-y-1.5 text-xs">
                          <p className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">
                              Status
                            </span>
                            <span>{item.status}</span>
                          </p>
                          <p className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">Date</span>
                            <span>{item.date}</span>
                          </p>
                          <p className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">Time</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="size-3" />
                              {item.time}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">
                              Duration
                            </span>
                            <span>{item.duration}</span>
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border px-6 py-4">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-4" />
                  Your personal calls are end-to-end encrypted
                </p>
              </div>
            </aside>
          </ResizablePanel>
          <ResizableHandle withHandle={false} />
          <ResizablePanel
            defaultSize={70}
            minSize={58}
            className="bg-background"
          >
            <section className="flex h-full min-h-0 items-center justify-center px-8">
              <div className="w-full max-w-md">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setCallType("video");
                      setOpenContactDialog(true);
                    }}
                    className="flex min-h-25 items-center justify-center gap-2 rounded-xl bg-accent/40 px-5 py-5 text-md font-medium text-foreground transition-colors hover:bg-accent cursor-pointer"
                  >
                    <Video className="size-6 text-primary" />
                    Video call
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setCallType("audio");
                      setOpenContactDialog(true);
                    }}
                    className="flex min-h-25 items-center justify-center gap-2 rounded-xl bg-accent/40 px-5 py-5 text-md font-medium text-foreground transition-colors hover:bg-accent cursor-pointer"
                  >
                    <PhoneCall className="size-6 text-primary" />
                    Audio call
                  </Button>
                  <Button
                    onClick={() => handleTabChange("chat")}
                    type="button"
                    className="flex min-h-25 items-center justify-center gap-2 rounded-xl bg-accent/40 px-5 py-5 text-md font-medium text-foreground transition-colors hover:bg-accent sm:col-span-2 cursor-pointer"
                  >
                    <MessageCircle className="size-6 text-primary" />
                    Message
                  </Button>
                </div>
                <div className="mt-16 flex items-center justify-center">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="size-5" />
                    Your personal calls are end-to-end encrypted
                  </p>
                </div>
              </div>
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <Dialog open={openContactDialog} onOpenChange={setOpenContactDialog}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-base font-semibold">
              {callType === "video" ? "Start Video Call" : "Start Audio Call"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select a contact to start {callType} calling.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-105 overflow-y-auto p-2">
            {cachedContacts.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No contacts found in cache.
              </div>
            ) : (
              <ul className="space-y-1 h-full">
                {cachedContacts.map((contact: any, index: number) => (
                  <li key={contact.id ?? index} className="h-15">
                    <Button
                      type="button"
                      className="flex w-full h-full items-center justify-start gap-3 rounded-md text-left transition-colors bg-accent hover:bg-accent/60 cursor-pointer"
                      variant={"default"}
                      onClick={async () => {
                        const res = await requestUserMediaAccess({
                          type: callType,
                        });
                        if (!res) return;
                        setEnableCallRND({
                          type: callType,
                          callee_id: contact?.contact_user_id,
                          callMode: "direct",
                          callDirection: "outgoing",
                        });
                        setOpenContactDialog(false);
                      }}
                    >
                      <UserAvatar
                        src={contact.info?.avatar_url}
                        alt={contact.info?.full_name || "avatar"}
                        isOnline={false}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {contact.info?.full_name || "Unknown Contact"}
                        </p>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}

export default Calls;
