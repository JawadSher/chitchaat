import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

function SendFileAttachementDialog({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="w-full h-full relative z-10 px-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            className="absolute cursor-pointer w-9 h-9 top-2 right-2 rounded-full bg-transparent"
          >
            <X className="size-5" strokeWidth={1.89} />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="bg-destructive/10 p-3 rounded-full mb-3">
              <AlertTriangle className="size-6 text-primary" />
            </div>

            <DialogTitle>Close this tab?</DialogTitle>

            <DialogDescription>
              If you close this tab, any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2 sm:justify-center">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <DialogClose asChild>
              <Button variant={"default"} onClick={() => setOpen(false)}>
                Discard
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full h-full">
        <div className="h-full w-full flex items-center justify-center">
          No preview yet
        </div>
        <div className="h-20 flex items-center justify-center gap-3 border-t border-border">
          <Button className="h-13 w-13">1</Button>
          <Button className="h-13 w-13">2</Button>
          <Button className="h-13 w-13">+</Button>
        </div>
      </div>
    </div>
  );
}

export default SendFileAttachementDialog;
