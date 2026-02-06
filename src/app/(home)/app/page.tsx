import Chat from "@/components/chat";
import Notification from "@/components/notification";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

function ChatPage() {
  return (
    <div className="w-full h-full overflow-auto">
      <Chat />
      <TabsContent value="call">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Generate and download detailed reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You have 5 reports ready.
          </CardContent>
        </Card>
      </TabsContent>
      <Notification />
    </div>
  );
}

export default ChatPage;
