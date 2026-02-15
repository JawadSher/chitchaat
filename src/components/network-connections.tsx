import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import EmptyState from "./network-empty-state";
import PersonRow from "./network-pending-person-row";
import OutlineButton from "./out-line-button";
import { Person } from "./my-network";
import { useGetContacts } from "@/hooks/react-query/query-contact";
import { NetworkListSkeleton } from "./skeletons/network-skeleton";
import ConnectionPersonRow from "./network-connections-person-row";

function NetworkConnections({
  setContactsLength,
}: {
  setContactsLength: (length: number) => void;
}) {
  const { data: connections, isLoading, error } = useGetContacts();

  useEffect(() => {
    if (connections && !isLoading) {
      setContactsLength(connections.length);
    }
  }, [connections, isLoading]);

  if (error) {
    return (
      <EmptyState
        title="Error loading connections"
        text="There was an error loading your connections. Please try again later."
      />
    );
  }

  if (isLoading) {
    return <NetworkListSkeleton />;
  }

  return (
    <Tabs.Content value="connections" className="outline-none">
      {connections?.length === 0 ? (
        <EmptyState
          title="No connections yet"
          text="Start connecting with people to grow your network."
        />
      ) : (
        <div className="space-y-2">
          {connections?.map((p) => (
            <ConnectionPersonRow
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
