import {
  Camera,
  Clapperboard,
  FileText,
  Headphones,
  Image,
  Mic,
  Plus,
  Send,
  SmilePlus,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { FieldError, FieldGroup, Field, FieldLabel } from "./ui/field";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useSendMessage } from "@/hooks/react-query/mutation-message";
import { toast } from "sonner";
import { uploadFile } from "@/lib/supabase/upload-file";
import { useSession } from "@clerk/nextjs";
import { getMessageType } from "@/lib/get-message-type";

const formSchema = z
  .object({
    message: z.string().max(7000, "Message must be at most 7000 characters."),
    file: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      const hasMessage = data.message?.trim().length > 0;
      const hasFile = !!data.file;

      return hasMessage || hasFile;
    },
    {
      message: "Message or file is required.",
      path: ["message"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

function ChatForm({
  recipient_id,
  setOpen,
  setSelectedFiles,
  open,
  selectedFiles,
  setPercentage,
}: {
  recipient_id: string;
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedFiles: File[] | null;
  setSelectedFiles: (files: File[] | null) => void;
  setPercentage: (fileName: string, percentage: number) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: sendMessageFn } = useSendMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { session } = useSession();

  const form = useForm({
    defaultValues: { message: "", file: undefined } as FormValues,
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }: { value: FormValues }) => {
      const uploadedFiles: string[] = [];
      if (selectedFiles) {
        for (const file of selectedFiles) {
          const res = await uploadFile({ file, session, setPercentage });
          uploadedFiles.push(res as string);
        }
      }

      sendMessageFn({
        message_type: getMessageType(value.message, uploadedFiles),
        content: value.message ?? null,
        recipient_id,
        file_name: uploadedFiles,
        file_size: [...(selectedFiles?.map((file: any) => file.size) || [])],
      });
      setOpen(false);
      setSelectedFiles(null);
      form.reset();
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const handleEmojiClick = (emoji: string) => {
    const currentMessage = form.getFieldValue("message") || "";
    form.setFieldValue("message", currentMessage + emoji);
    setIsOpen(false);
  };

  return (
    <footer className="shrink-0 w-full p-2 flex items-center bg-accent/10">
      <form
        id="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex items-center w-full bg-input/30 p-2 rounded-4xl"
      >
        <div className="flex items-center justify-center px-4 gap-4">
          <FieldGroup className="relative flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="absolute rounded-full 
          cursor-pointer bg-transparent w-7 h-7 dark:text-white"
                  type="button"
                >
                  <Plus className=" size-5 " strokeWidth={1.89} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-semibold">
                <DropdownMenuItem
                  className="flex items-center justify-start gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText
                    className="size-5"
                    strokeWidth={1.89}
                    color="#934bec"
                  />
                  <span>Document</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-start gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image
                    color="#0869e7"
                    className="size-5"
                    strokeWidth={1.89}
                  />
                  <span>Photos</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-start gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Clapperboard
                    color="#5392e4"
                    className="size-5"
                    strokeWidth={1.89}
                  />
                  <span>Videos</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-start gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Headphones
                    color="#f08000"
                    className="size-5"
                    strokeWidth={1.89}
                  />
                  <span>Audio</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-start gap-2">
                  <Camera
                    color="#ff0095"
                    className="size-5"
                    strokeWidth={1.89}
                  />
                  <span>Camera</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <form.Field name="file">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.files?.[0]);

                        const files = e.target.files;

                        if (!files || files.length === 0) {
                          toast.error("No file selected or file is empty.");
                          return;
                        }

                        const newFiles = Array.from(files);
                        const duplicates = newFiles.some((file) =>
                          selectedFiles?.some(
                            (selected) => selected.name === file.name,
                          ),
                        );

                        if (duplicates) {
                          toast.error("This file is already imported.");
                          return;
                        }

                        setSelectedFiles([
                          ...(selectedFiles || []),
                          ...newFiles,
                        ]);
                        setOpen(true);
                        e.target.value = "";
                      }}
                      className="hidden"
                      accept="image/*, application/*"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <DropdownMenu
            open={isOpen}
            onOpenChange={() => setIsOpen((prev) => !prev)}
          >
            <DropdownMenuTrigger asChild>
              <Button
                className="cursor-pointer w-7 h-7 bg-transparent rounded-full"
                type="button"
              >
                <SmilePlus
                  strokeWidth={1.89}
                  className="size-5 dark:text-white"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <EmojiPicker
                emojiStyle={EmojiStyle.GOOGLE}
                searchPlaceHolder="Search your emoji..."
                theme={Theme.AUTO}
                className="z-10"
                onEmojiClick={({ emoji }) => handleEmojiClick(emoji)}
                open={isOpen}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <FieldGroup className="flex-1">
          <form.Field name="message">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    Message
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full border-none outline-none focus-visible:ring-0 px-4 py-2 bg-transparent dark:bg-transparent min-h-full max-h-50 resize-none"
                    autoComplete="off"
                    maxLength={7000}
                    minLength={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit();
                      }
                    }}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <form.Subscribe selector={(state) => state.values.message}>
          {(messageValue) => (
            <Button
              className="rounded-full h-10 w-10 flex items-center justify-center"
              type="submit"
            >
              {selectedFiles?.length || messageValue ? (
                <Send className="size-5" strokeWidth={1.89} />
              ) : (
                <Mic className="size-5" strokeWidth={1.89} />
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </footer>
  );
}

export default ChatForm;
