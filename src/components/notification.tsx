"use client";

import { createSupabaseClient } from "@/lib/supabase/createBrowserClient";
import { useUser, useSession } from "@clerk/nextjs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useUser();
  const { session } = useSession();
  const channelRef = useRef<any>(null);
  const supabaseRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id || !session || channelRef.current) return;

    const setupRealtime = async () => {
      const token = await session.getToken({ template: "supabase" });
      const supabase = createSupabaseClient(token);
      supabaseRef.current = supabase;
      await supabase.realtime.setAuth(token!);

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
            setNotifications((prev) => [payload.new as any, ...prev]);
          }
        )
        .subscribe((status) => {
          console.log("Realtime status:", status);
        });

      channelRef.current = channel;
    };

    setupRealtime();

    return () => {
      if (channelRef.current && supabaseRef.current) {
        supabaseRef.current.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, session]);

  return (
    <TabsContent value="notification">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
    </TabsContent>
  );
}

export default Notification;
