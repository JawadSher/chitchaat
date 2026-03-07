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
import { getEmojiCount, getEmojiSize, isOnlyEmoji } from "@/lib/emoji";
import { IMAGES } from "@/constants/images";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const getFileIcon = (fileName: string) => {
  if (!fileName) return IMAGES.ICONS.FILE;

  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "doc":
    case "docx":
      return IMAGES.ICONS.WORD;

    case "xls":
    case "xlsx":
      return IMAGES.ICONS.EXCEL;

    case "ppt":
    case "pptx":
      return IMAGES.ICONS.PPT;

    case "zip":
    case "rar":
      return IMAGES.ICONS.ZIP;

    case "txt":
      return IMAGES.ICONS.FILE;

    case "mp4":
      return IMAGES.ICONS.VIDEO;

    case "mp3":
      return IMAGES.ICONS.AUDIO;

    default:
      return IMAGES.ICONS.FILE;
  }
};

function MessageAttachment({ m }: { m: IMessages }) {
  const files = m.file_name || [];
  const visibleFiles = files.slice(0, 4);
  const remaining = files.length - 4;

  const getGrid = () => {
    if (visibleFiles.length === 1) return "grid-cols-1";
    if (visibleFiles.length === 2) return "grid-cols-2";
    return "grid-cols-2";
  };

  return (
    <Dialog>
      <DialogTrigger
        className={`w-full h-full grid gap-1 border overflow-hidden rounded-lg ${getGrid()}`}
      >
        {visibleFiles.map((file: string, index: number) => (
          <div key={index} className="aspect-square w-full h-full">
            <Image
              src={IMAGES.ICONS.IMAGE}
              alt="attachment"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </DialogTrigger>

      <DialogContent></DialogContent>
    </Dialog>
  );
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
          "rounded-full absolute right-1 top-2 z-20 bg-primary/50 cursor-pointer",
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
  const emojiCount = onlyEmoji ? getEmojiCount(m.content ?? "") : 0;

  return (
    <div
      className={[
        "flex items-end gap-2 relative",
        incoming ? "justify-start" : "justify-end",
      ].join(" ")}
    >
      <div
        className={[
          "flex max-w-[85%] sm:max-w-[72%] md:max-w-[62%] px-2 gap-2 relative",

          emojiCount < 2 && onlyEmoji
            ? "flex-col items-center"
            : incoming
              ? `rounded-e-md rounded-es-md ${
                  showTail ? "rounded-ee-md" : "rounded-md"
                }
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
              "absolute w-4 h-4 top-0",
              incoming
                ? "left-0 -translate-x-full bottom-2 bg-primary-foreground/10 dark:bg-primary-foreground/40 [clip-path:polygon(100%_0,50%_0,100%_50%)]"
                : "right-0 translate-x-full bottom-2 bg-primary-foreground dark:bg-primary-foreground [clip-path:polygon(0_0,50%_0,0_50%)]",
            ].join(" ")}
          />
        )}

        {m.message_type !== "text" && (
          <div className="w-50 h-50">
            <MessageAttachment m={m} />
          </div>
        )}

        <div className="flex items-start pb-2">
          {m.content && (
            <p
              className={[
                "whitespace-pre-wrap wrap-break-word",
                onlyEmoji && "tracking-[-4px]",
                emojiSize,
              ].join(" ")}
            >
              {m.content}
            </p>
          )}
        </div>

        {m.message_type === "text" && (
          <div className="flex items-end pb-px">
            <div
              className={`flex items-center justify-center gap-1 h-4 ${onlyEmoji && emojiCount < 2 && "bg-primary-foreground rounded-md px-2 py-3 "}`}
            >
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
        )}
      </div>
    </div>
  );
}
