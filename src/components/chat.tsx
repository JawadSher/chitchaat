/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatTabSidebar from "@/components/chat-tab-sidebar";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs } from "./ui/tabs";

function Chat() {
  return (
    <TabsContent value="chat" className="w-full h-full">
      <Tabs className="w-full h-full" defaultValue="empty">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ChatTabSidebar />
          <ResizableHandle withHandle />
          <ResizablePanel className="p-2">
            <TabsContent value="empty" className="h-full">
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <h2 className="text-lg font-medium">No chat selected</h2>
                  <p className="text-sm">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            </TabsContent>

            {Array.from({ length: 5 }).map((_, index: number) => (
              <TabsContent value={`user${index}`} key={index}>
                <Card>
                  <CardHeader>
                    <CardTitle>User {index}</CardTitle>
                    <CardDescription>
                      Generate and download detailed reports.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    You have 5 reports ready.
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </TabsContent>
  );
}

export default Chat;
