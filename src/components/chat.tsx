/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatTabSidebar from "@/components/chat-tab-sidebar";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs } from "./ui/tabs";
import { useState } from "react";
import ChatForm from "./chat-form";
import ChatAreaHeader from "./chat-area-header";

function Chat() {
  const [activeTab, setActiveTab] = useState<string>("empty");
  return (
    <TabsContent value="chat" className="w-full h-full">
      <Tabs
        className="w-full h-full"
        value={activeTab}
        defaultValue="empty"
        onValueChange={setActiveTab}
      >
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ChatTabSidebar />
          <ResizableHandle withHandle />
          <ResizablePanel>
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
              <TabsContent
                value={`user${index}`}
                key={index}
                className="w-full h-full flex flex-col"
              >
                {/* HEADER */}
                <ChatAreaHeader setActiveTab={setActiveTab} />

                <main className="flex-1 overflow-y-auto p-4">
                  <div className="text-sm text-muted-foreground">
                    Nothing yet.
                  </div>
                </main>

                <ChatForm />
              </TabsContent>
            ))}
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </TabsContent>
  );
}

export default Chat;
