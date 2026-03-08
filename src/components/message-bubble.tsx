import { IMessages } from "@/types/messages";
import Image from "next/image";
import { DoubleTick, formatTime } from "./chats-main";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DownloadCloud, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDeleteMessage } from "@/hooks/react-query/mutation-message";
import { Loader } from "./loader";
import { getEmojiCount, getEmojiSize, isOnlyEmoji } from "@/lib/emoji";
import { IMAGES } from "@/constants/images";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { usePreviewAttachement } from "@/hooks/react-query/query-messages";
import { toast } from "sonner";
import { Button } from "./ui/button";

const getFileIcon = (fileName: string) => {
  if (!fileName) return IMAGES.ICONS.FILE;

  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    // Documents
    case "doc":
    case "docx":
      return IMAGES.ICONS.WORD;

    case "xls":
    case "xlsx":
    case "csv":
      return IMAGES.ICONS.EXCEL;

    case "ppt":
    case "pptx":
      return IMAGES.ICONS.PPT;

    // Archives
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return IMAGES.ICONS.ZIP;

    // Text
    case "txt":
    case "md":
    case "pdf":
      return IMAGES.ICONS.FILE;

    // Images
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
    case "bmp":
    case "ico":
    case "tiff":
    case "avif":
      return IMAGES.ICONS.IMAGE;

    // Video
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
    case "webm":
    case "flv":
      return IMAGES.ICONS.VIDEO;

    // Audio
    case "mp3":
    case "wav":
    case "ogg":
    case "aac":
    case "flac":
    case "m4a":
      return IMAGES.ICONS.AUDIO;

    default:
      return IMAGES.ICONS.FILE;
  }
};

function MessageAttachment({
  m,
  data,
  incoming,
}: {
  m: IMessages;
  data: any[];
  error: any;
  incoming: boolean;
}) {
  const files = m.file_name || [];
  const visibleFiles = files.slice(0, 4);
  const remaining = files.length - 4;

  const getGridClass = () => {
    if (visibleFiles.length === 1) return "grid-cols-1";
    if (visibleFiles.length === 2) return "grid-cols-2";
    return "grid-cols-2";
  };

  const getItemHeight = (index: number) => {
    if (visibleFiles.length === 1) return "h-30";
    if (visibleFiles.length === 2) return "h-25";
    if (visibleFiles.length === 3 && index === 0) return "col-span-2 h-40";
    return "h-36";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`grid gap-0.5 overflow-hidden h-fit cursor-pointer w-full ${getGridClass()}`}
        >
          {visibleFiles.map((file: string, index: number) => {
            const isLastVisible = index === visibleFiles.length - 1;
            const showOverlay = isLastVisible && remaining > 0;

            return (
              <div
                key={index}
                className={`relative overflow-hidden group rounded-md aspect-square  ${data.length && incoming && "bg-primary-foreground "} ${data.length && !incoming && "bg-[#331e0b]"} ${getItemHeight(index)}`}
              >
                <Image
                  src={data.length ? data[index].signedUrl : getFileIcon(file)}
                  alt={`attachment-${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 200px"
                />

                {!showOverlay && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                )}

                {showOverlay && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold tracking-tight">
                      +{remaining}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogTrigger>

      <DialogContent className="aspect-square p-2 border-none h-[80%] overflow-auto flex flex-col">
        <DialogTitle>Attachments</DialogTitle>
        {m?.file_name?.map((f_name: any, index: number) => {
          return (
            <div
              key={f_name}
              className="relative w-full h-full bg-primary-foreground hover:bg-primary-foreground/80 rounded-md cursor-pointer"
            >
              <Image
                src={data.length ? data[index].signedUrl : getFileIcon(f_name)}
                loading="eager"
                alt={`attachment-${index + 1}`}
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 200px"
              />
            </div>
          );
        })}

        <Button
          type="button"
          variant={"outline"}
          className="w-fit h-fit p-1 px-2 rounded-md cursor-pointer absolute top-2 right-10"
        >
          Download All
        </Button>
      </DialogContent>
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

  const { data: AttachementsData, error } = usePreviewAttachement({
    path: m.file_name?.map((name: string) => `${m.sender_id}/${name}`) ?? [],
  });

  if (error) toast.error(error.message);

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
          m.message_type !== "text" && "flex-col py-1",
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
          <div className="flex h-fit">
            <MessageAttachment
              m={m}
              data={AttachementsData ?? []}
              error={error}
              incoming={incoming}
            />
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

        <div
          className={[
            "flex items-end pb-px",
            m.message_type !== "text" && "justify-end",
          ].join(" ")}
        >
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
      </div>
    </div>
  );
}
