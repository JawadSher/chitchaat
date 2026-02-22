"use client";

import { useGetMessages } from "@/hooks/react-query/query-messages";
import { IMessages } from "@/types/messages";
import React, { useEffect, useMemo, useRef } from "react";
import { MessagesSkeleton } from "./skeletons/messages-skeleton";
import { MessageBubble } from "./message-bubble";

export function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDay(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return "Today";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function bytesToSize(bytes?: number) {
  if (!bytes || bytes <= 0) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function DoubleTick({
  status,
}: {
  status: IMessages["message_read_status"];
}) {
  const color = status === "read" ? "text-primary" : "text-muted-foreground";

  if (status === "sent") {
    return (
      <span className="inline-flex items-center">
        <svg width="16" height="16" viewBox="0 0 24 24" className={color}>
          <path
            d="M20 6L9 17l-5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center -space-x-2">
      <svg width="16" height="16" viewBox="0 0 24 24" className={color}>
        <path
          d="M20 6L9 17l-5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" className={color}>
        <path
          d="M20 6L9 17l-5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ChatsMain({
  recipient_id,
  user_id,
}: {
  recipient_id: string;
  user_id: string;
}) {
  const { data, error, isLoading } = useGetMessages({ recipient_id });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => {
    const d: any = data;

    if (Array.isArray(d)) return d as IMessages[];

    if (Array.isArray(d?.data)) return d.data as IMessages[];

    if (Array.isArray(d?.items)) return d.items as IMessages[];
    if (Array.isArray(d?.messages)) return d.messages as IMessages[];

    if (Array.isArray(d?.pages)) {
      return d.pages.flatMap((p: any) => {
        if (Array.isArray(p?.items)) return p.items;
        if (Array.isArray(p?.data)) return p.data;
        if (Array.isArray(p?.messages)) return p.messages;
        return [];
      }) as IMessages[];
    }

    return [] as IMessages[];
  }, [data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (error) {
    return (
      <main className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            Failed to load messages
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
      <div className="mx-auto max-w-3xl">
        {isLoading ? (
          <MessagesSkeleton />
        ) : messages.length === 0 ? (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm font-semibold text-foreground">
                No messages yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send a message to start the conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m, idx) => {
              const incoming = m.sender_id === recipient_id;

              const prev = messages[idx - 1];
              const showDay =
                !!m.created_at &&
                (!prev?.created_at ||
                  formatDay(prev.created_at) !== formatDay(m.created_at));

              return (
                <React.Fragment key={m.id}>
                  {showDay ? (
                    <DayDivider label={formatDay(m.created_at)} />
                  ) : null}
                  <MessageBubble m={m} incoming={incoming} />
                </React.Fragment>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </main>
  );
}

export default ChatsMain;
