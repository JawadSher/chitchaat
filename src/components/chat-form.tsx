import { Mic, Plus, Send, SmilePlus, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { FieldError, FieldGroup, Field, FieldLabel } from "./ui/field";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useSendMessage } from "@/hooks/react-query/mutation-message";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message must be at least 1 character.")
    .max(7000, "Message must be at most 7000 characters."),
  file: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function ChatForm({ recipient_id }: { recipient_id: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: sendMessageFn, isPending } = useSendMessage();

  const form = useForm({
    defaultValues: { message: "", file: undefined } as FormValues,
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }: { value: FormValues }) => {
      console.log("Sent message:", value.message);
      if (value.file) {
        console.log("Attached file:", value.file.name);
      }

      sendMessageFn({
        message_type: "text",
        content: value.message,
        recipient_id,
      });
      form.reset();
    },
  });

  const handleEmojiClick = (emoji: string) => {
    const currentMessage = form.getFieldValue("message") || "";
    form.setFieldValue("message", currentMessage + emoji);
    setIsOpen(false);
  };

  const handleRemoveFile = () => {
    form.setFieldValue("file", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            <Button
              className="absolute rounded-full 
          cursor-pointer bg-transparent w-7 h-7 text-white"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className=" size-5 " strokeWidth={1.89} />
            </Button>
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
                      onChange={(e) => field.handleChange(e.target.files?.[0])}
                      className="hidden"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          {/* Emoji button */}
          <DropdownMenu
            open={isOpen}
            onOpenChange={() => setIsOpen((prev) => !prev)}
          >
            <DropdownMenuTrigger asChild>
              <Button
                className="cursor-pointer w-7 h-7 bg-transparent rounded-full"
                type="button"
              >
                <SmilePlus strokeWidth={1.89} className="size-5 text-white" />
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
              {messageValue ? (
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
