import { IMessages } from "@/types/messages";
import Image from "next/image";
import { bytesToSize, DoubleTick, formatTime } from "./chats-main";

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
        {m.content ? (
          <p className="mt-1 text-sm text-foreground whitespace-pre-wrap wrap-break-word">
            {m.content}
          </p>
        ) : null}
      </div>
    );
  }

  return null;
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
          incoming
            ? `flex rounded-e-md rounded-es-md ${showTail ? "rounded-ee-md" : "rounded-e-md"} py-1 bg-primary-foreground/40 text-foreground`
            : `bg-primary-foreground rounded-s-md rounded-ee-md ${showTail ? "rounded-es-md" : "rounded-e-md"} text-foreground`,
        ].join(" ")}
      >
        {showTail && (
          <div
            className={[
              "absolute w-3 h-3 top-0",
              incoming
                ? "left-0 -translate-x-full bottom-2 bg-primary-foreground/40 [clip-path:polygon(100%_0,50%_0%,100%_50%)]"
                : "right-0 translate-x-full bottom-2 bg-primary-foreground  [clip-path:polygon(0_0,50%_0,0_50%)]",
            ].join(" ")}
          />
        )}

        {m.message_type !== "text" && (
          <div className="mb-2">
            <MessageAttachment m={m} />
          </div>
        )}

        {m.content && (
          <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
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
            <span className="translate-y-px">
              <DoubleTick status={m.message_read_status} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
