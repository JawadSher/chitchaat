import { IMessages } from "@/types/messages";
import Image from "next/image";
import { bytesToSize, DoubleTick, formatTime } from "./chats-main";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Trash } from "lucide-react";
import { useState } from "react";
import { useDeleteMessage } from "@/hooks/react-query/mutation-message";
import { Loader } from "./loader";
import { getEmojiSize, isOnlyEmoji } from "@/lib/emoji";

function MessageAttachment({ m }: { m: IMessages }) {
  if (m.message_type === "image" && m.media_url) {
    return (
      <a
        href={m.media_url}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-xl border border-border bg-background"
      >
        <Image
          src={m.media_url}
          alt={m.file_name ?? "Image"}
          width={900}
          height={900}
          className="h-auto w-full max-w-[320px] object-cover"
        />
      </a>
    );
  }

  if (m.message_type === "file") {
    return (
      <a
        href={m.media_url || "#"}
        target="_blank"
        rel="noreferrer"
        className="block rounded-xl border border-border bg-background p-3 hover:bg-accent transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {m.file_name ?? "File"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {bytesToSize(m.file_size) || "Download"}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-card px-2 py-1 text-xs text-muted-foreground">
            File
          </span>
        </div>
      </a>
    );
  }

  if (m.message_type !== "text") {
    return (
      <div className="rounded-xl border border-border bg-background p-3">
        <p className="text-sm text-muted-foreground">
          {m.message_type.toUpperCase()} message
        </p>
        {m.content && (
          <p className="mt-1 text-sm text-foreground whitespace-pre-wrap break-words">
            {m.content}
          </p>
        )}
      </div>
    );
  }

  return null;
}

export function OptionsMenu({
  showOptions,
  m,
  isOnlyEmoji,
}: {
  showOptions: boolean;
  m: IMessages;
  isOnlyEmoji: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: deleteMessageFn, isPending } = useDeleteMessage({
    setOpen,
    recipient_id: m.recipient_id,
  });
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={[
          "rounded-full absolute right-1 z-20 bg-primary/50 cursor-pointer",
          isOnlyEmoji && "top-1",
          showOptions ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <ChevronDown className="size-4.5" strokeWidth={1.89} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuLabel>Message options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex gap-2 cursor-pointer"
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              deleteMessageFn({ message_id: m.id });
            }}
            disabled={isPending}
          >
            <Trash className="size-4" strokeWidth={1.89} />
            <span>{isPending ? "Deleting..." : "Delete"}</span>
            {isPending && <Loader />}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MessageBubble({
  m,
  incoming,
  showTail,
}: {
  m: IMessages;
  incoming: boolean;
  showTail?: boolean;
}) {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const onlyEmoji = isOnlyEmoji(m.content ?? "");
  const emojiSize = onlyEmoji ? getEmojiSize(m.content ?? "") : "text-sm";

  return (
    <div
      className={[
        "flex items-end gap-2 relative",
        incoming ? "justify-start" : "justify-end",
      ].join(" ")}
    >
      <div
        className={[
          "flex max-w-[85%] sm:max-w-[72%] md:max-w-[62%]",
          "px-2 gap-2 relative",

          onlyEmoji
            ? "bg-transparent shadow-none p-0 flex-col"
            : incoming
              ? `rounded-e-md rounded-es-md ${
                  showTail ? "rounded-ee-md" : "rounded-md"
                } py-1 
              bg-primary-foreground/10 dark:bg-primary-foreground/40 
              text-foreground`
              : `rounded-s-md rounded-ee-md ${
                  showTail ? "rounded-es-md" : "rounded-e-md"
                } 
              bg-primary-foreground dark:bg-primary-foreground 
              dark:text-foreground text-white`,
        ].join(" ")}
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {showTail && !onlyEmoji && (
          <div
            className={[
              "absolute w-3 h-3 top-0",
              incoming
                ? "left-0 -translate-x-full bottom-2 bg-primary-foreground/10 dark:bg-primary-foreground/40 [clip-path:polygon(100%_0,50%_0,100%_50%)]"
                : "right-0 translate-x-full bottom-2 bg-primary-foreground dark:bg-primary-foreground [clip-path:polygon(0_0,50%_0,0_50%)]",
            ].join(" ")}
          />
        )}

        {m.message_type !== "text" && (
          <div className="mb-2">
            <MessageAttachment m={m} />
          </div>
        )}

        {m.content && (
          <p
            className={["whitespace-pre-wrap break-words", emojiSize].join(" ")}
          >
            {m.content}
          </p>
        )}

        <div className="mt-1 flex items-center justify-end gap-2">
          {m.is_edited && (
            <span className="text-[11px] opacity-70">edited</span>
          )}

          {m.created_at && (
            <span className="text-[11px] tabular-nums opacity-70">
              {formatTime(m.created_at)}
            </span>
          )}

          {!incoming && (
            <OptionsMenu
              isOnlyEmoji={onlyEmoji}
              m={m}
              showOptions={showOptions}
            />
          )}

          {!incoming && (
            <span className="translate-y-px">
              <DoubleTick status={m.message_read_status} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
