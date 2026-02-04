import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";

function AddFriend({
  showOverlay,
  setShowOverlay,
}: {
  showOverlay: boolean;
  setShowOverlay: (e: boolean) => void;
}) {
  return (
    <div
      className={`absolute inset-0 bg-background/95 backdrop-blur-sm z-50 p-4 flex flex-col transition-transform duration-300 ease-in-out ${
        showOverlay ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="w-full flex items-center justify-between mb-4">
        <Label className="font-semibold text-lg">Find friends</Label>
        <Button
          className="p-0 h-8 w-8 rounded-full bg-transparent hover:bg-primary-foreground cursor-pointer"
          onClick={() => setShowOverlay(false)}
        >
          <X className="size-5 text-primary" strokeWidth={1.89} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <Input
          className="w-full border-none rounded-full focus-visible:ring-1"
          placeholder="Enter your friends username..."
        ></Input>
      </div>
    </div>
  );
}

export default AddFriend;
