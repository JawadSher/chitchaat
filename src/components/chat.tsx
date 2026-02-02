import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatTabSidebar from "@/components/chat-tab-sidebar";
import { TabsContent } from "@radix-ui/react-tabs";

function Chat() {
  return (
    <TabsContent value="chat" className="w-full h-full">
      <ResizablePanelGroup direction="horizontal">
        <ChatTabSidebar />
        <ResizableHandle withHandle />
        <ResizablePanel></ResizablePanel>
      </ResizablePanelGroup>
    </TabsContent>
  );
}

export default Chat;
