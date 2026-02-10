"use client";

import { useSupabaseClient } from "@/lib/supabase/get-supabase-client";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const subscribedRef = useRef(false);
  const { getClient } = useSupabaseClient();

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    let supabase: any;
    let channel: any;

    const init = async () => {
      supabase = await getClient();
      channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
          },
          (payload: any) => {
            console.log("New notification:", payload);
            setNotifications((prev) => [payload.new, ...prev]);
          },
        )
        .subscribe((status: any) => {
          console.log("Realtime status:", status);
        });
    };

    init();

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [getClient]);

  return (
    <TabsContent value="notification">
      {notifications.map((n) => (
        <div key={n.id}>{n.title}</div>
      ))}
    </TabsContent>
  );
}

export default Notification;
