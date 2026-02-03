import { Mic, Plus, Send, SmilePlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { FieldError, FieldGroup, Field, FieldLabel } from "./ui/field";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message must be at least 1 character.")
    .max(7000, "Message must be at most 7000 characters."),
});

function ChatForm() {
  const form = useForm({
    defaultValues: { message: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }: any) => {
      console.log("Sent message:", value.message);
      form.reset(); 
    },
  });

  return (
    <footer className="shrink-0 w-full p-2 flex items-center bg-accent/10">
      <form
        id="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex items-center w-full gap-2 bg-input/30 p-2 rounded-full"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full h-10 w-10 flex items-center justify-center"
            >
              <Plus className="size-5" strokeWidth={1.89} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-45">
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                Attach File
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Emoji button */}
        <Button
          className="rounded-full h-10 w-10 flex items-center justify-center"
          variant="ghost"
          type="button"
        >
          <SmilePlus className="size-5" strokeWidth={1.89} />
        </Button>

        {/* Message input */}
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
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full border-none outline-none focus-visible:ring-0 px-4 py-2 bg-transparent dark:bg-transparent"
                    autoComplete="off"
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
