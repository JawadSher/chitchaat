"use client";

import { useSupabase } from "@/providers/supabase-provider";
import { useUser } from "@clerk/nextjs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useUser();
  const channelRef = useRef<any>(null);
  const supabase = useSupabase();

  useEffect(() => {
    if (!user?.id || channelRef.current) return;
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `contact_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("New notification:", payload.new);
          setNotifications((prev) => [payload.new as any, ...prev]);
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

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, supabase]);

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
