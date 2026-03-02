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
import { useRef } from "react";
import { Input } from "./ui/input";

function SendFileAttachementDialog({
  setOpen,
  selectedFiles,
  setSelectedFiles,
}: {
  setOpen: (open: boolean) => void;
  selectedFiles: File[] | null;
  setSelectedFiles: (e: File[] | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!selectedFiles || selectedFiles.length === 0) {
    toast.error("No file selected or file is empty.");
    setOpen(false);
    return null;
  }

  const getPreviewClass = (file: File) => {
    const base = "w-full mx-auto h-[50vh]";

    if (file.type.startsWith("image")) return `${base} max-w-2xl`;

    if (file.type.startsWith("video")) return `${base} max-w-4xl`;

    if (file.type === "application/pdf") return `${base} max-w-4xl`;

    if (file.type.startsWith("audio"))
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
      
      <Tabs defaultValue={selectedFiles?.[0]?.name || undefined} className="w-full h-full">
        {selectedFiles?.map((file: File) => {
          const previewURL = URL.createObjectURL(file);

          console.log(file);

          return (
            <TabsContent
              key={file.name}
              value={file.name}
              className="w-full h-full"
            >
              <div className="flex flex-col w-full h-full justify-center items-center ">
                <div className="h-full w-fit flex items-center justify-center">
                  <div className={[getPreviewClass(file)].join(" ")}>
                    <FilePreview preview={previewURL} />
                    <p className="absolute text-center top-4 left-0 text-md font-normal w-full">
                      {file.name}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          );
        })}
        <TabsList className="w-full min-h-fit bg-transparent border-t border-border p-2 gap-2">
          {selectedFiles.map((file: File) => {
            const previewURL = URL.createObjectURL(file);

            return (
              <TabsTrigger
                key={file.name}
                value={file.name}
                className="relative max-w-13 min-h-13 overflow-hidden rounded-md"
              >
                <Image
                  src={
                    file.type === "application/pdf"
                      ? IMAGES.ICONS.PDF
                      : previewURL
                  }
                  alt="image"
                  fill
                  className="object-cover p-1 rounded-md"
                />
              </TabsTrigger>
            );
          })}
          <div className="w-fit h-fit">
            <Button
              type="button"
              variant={"outline"}
              className="w-13 h-13 rounded-md text-2xl cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              +
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                const file = e.target.files;

                if (!file || file.length === 0) {
                  toast.error("No file selected or file is empty.");
                  return;
                }

                setSelectedFiles([...selectedFiles, ...Array.from(file)]);
              }}
              className="hidden"
              accept="image/*, application/*"
            />
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default SendFileAttachementDialog;
