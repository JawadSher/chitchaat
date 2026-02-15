import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import EmptyState from "./network-empty-state";
import PersonRow from "./network-person-row";
import OutlineButton from "./out-line-button";
import { Person } from "./my-network";

function NetworkConnections() {
  const connections: Person[] = [
    {
      id: 1,
      info: {
        full_name: "Jawad Sher",
        avatar_url:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zOUk1OU9yakxjRlhOam5Ra1REQTQxd0dZN3gifQ",
      },
      status: "accepted",
      created_at: new Date().toISOString(),
      user_id: "user-123",
    },
  ];

  return (
    <Tabs.Content value="connections" className="outline-none">
      {connections.length === 0 ? (
        <EmptyState
          title="No connections yet"
          text="Start connecting with people to grow your network."
        />
      ) : (
        <div className="space-y-2">
          {connections.map((p) => (
            <PersonRow
              key={p.id}
              person={p}
              right={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <OutlineButton type="button">Message</OutlineButton>
                  <OutlineButton type="button">Remove</OutlineButton>
                </div>
              }
            />
          ))}
        </div>
      )}
    </Tabs.Content>
  );
}

export default NetworkConnections;
