"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useSession, useUser } from "@clerk/nextjs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const subscribedRef = useRef(false);
  const { user } = useUser();
  const { session } = useSession();
  const supabase = supabaseClient(session);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const channel = supabase
      .channel(`notifications:${user?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `contact_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("New notification:", payload.new);
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe((channelStatus: any) => {
        console.log("Realtime status:", channelStatus);

        if (channelStatus === "SUBSCRIBED") {
          console.log("✅ Subscribed to notifications");
        } else if (channelStatus === "CHANNEL_ERROR") {
          console.error("❌ Channel error — check RLS & realtime policies");
        }
      });

    return () => {
      supabase.removeChannel(channel);
      subscribedRef.current = false;
    };
  }, [supabase, user, subscribedRef]);

  return (
    <TabsContent value="notification">
      {notifications.length === 0 ? (
        <div>No notifications</div>
      ) : (
        notifications.map((n) => <div key={n.id}>{n.title}</div>)
      )}
    </TabsContent>
  );
}

export default Notification;
