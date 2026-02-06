"use client";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState<any>([]);
  const { user } = useUser();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `userId=eq.${user?.id}`,
        },
        (payload) => {
          setNotifications((prev: any) => [payload.new, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <TabsContent value="notification">
      <div>
        {notifications.map((n: any) => (
          <div key={n.id}>{n.title}</div>
        ))}
      </div>
    </TabsContent>
  );
}

export default Notification;
