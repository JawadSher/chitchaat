"use client";
import "@livekit/components-styles";
import { TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";

function Calls() {
  const openCallWindow = () => {
    window.open(
      "/call/abc",
      "CallWindow",
      "width=420,height=720,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no"
    );
  };

  return (
    <TabsContent value="call" className="h-full p-0">
      <Button type="button" onClick={openCallWindow}>
        open
      </Button>
    </TabsContent>
  );
}

export default Calls;