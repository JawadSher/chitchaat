"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState<any[]>([]);

  return (
    <TabsContent value="notification">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
    </TabsContent>
  );
}

export default Notification;
