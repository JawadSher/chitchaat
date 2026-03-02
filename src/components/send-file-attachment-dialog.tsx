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
import { toast } from "sonner";
import FilePreview from "reactjs-file-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { IMAGES } from "@/constants/images";

function SendFileAttachementDialog({
  setOpen,
  selectFiles,
}: {
  setOpen: (open: boolean) => void;
  selectFiles: File[] | null;
}) {
  if (!selectFiles || selectFiles.length === 0) {
    toast.error("No file selected or file is empty.");
    setOpen(false);
    return null;
  }

  const previewURL = URL.createObjectURL(selectFiles[0]);

  const getPreviewClass = () => {
    const base = "w-full mx-auto h-[50vh]";

    if (selectFiles[0].type.startsWith("image")) return `${base} max-w-2xl`;

    if (selectFiles[0].type.startsWith("video")) return `${base} max-w-4xl`;

    if (selectFiles[0].type === "application/pdf") return `${base} max-w-4xl`;

    if (selectFiles[0].type.startsWith("audio"))
      return `${base} max-w-xl flex items-center justify-center`;

    return `${base} max-w-3xl`;
  };

  return (
    <div className="w-full h-full relative z-10 px-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            className="absolute cursor-pointer w-9 h-9 top-2 right-2 rounded-full bg-transparent z-10"
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

      <Tabs defaultValue={selectFiles[0].name} className="w-full h-full">
        <TabsContent value={selectFiles[0].name} className="w-full h-full">
          <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="h-full w-fit flex items-center justify-center">
              <div className={[getPreviewClass()].join(" ")}>
                <FilePreview preview={previewURL} />
                <p className="absolute text-center top-4 left-0 text-md font-normal w-full">
                  {selectFiles[0].name}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsList className="w-full min-h-fit bg-transparent border-t border-border p-2">
          <TabsTrigger
            value={selectFiles[0].name}
            className="relative max-w-13 min-h-13 overflow-hidden rounded-md"
          >
            <Image
              src={
                selectFiles[0].type === "application/pdf"
                  ? IMAGES.ICONS.PDF
                  : previewURL
              }
              alt="image"
              fill
              className="object-cover p-1 rounded-md"
            />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default SendFileAttachementDialog;
