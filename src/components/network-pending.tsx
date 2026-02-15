import { useGetPendingContacts } from "@/hooks/react-query/query-contact";
import * as Tabs from "@radix-ui/react-tabs";
import PersonRow from "./network-person-row";
import OutlineButton from "./out-line-button";
import EmptyState from "./network-empty-state";
import { useEffect } from "react";

function NetworkPendings() {
  const { data: pendingRequests, isLoading, error } = useGetPendingContacts();

  useEffect(() => {
    if(pendingRequests){
    console.log(pendingRequests);
  }
  }, [pendingRequests]);

  if (error) {
    console.log(error); 
    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load pending requests.
      </div>
    );
  }

  
  return (
    <Tabs.Content value="pending" className="outline-none">
      {pendingRequests?.length === 0 ? (
        <EmptyState
          title="No pending requests"
          text="Requests you send will stay here until accepted."
        />
      ) : (
        <div className="space-y-2">
          {pendingRequests?.map((p) => (
            <PersonRow
              key={p.id}
              person={p}
              right={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <OutlineButton type="button">Withdraw</OutlineButton>
                </div>
              }
            />
          ))}
        </div>
      )}
    </Tabs.Content>
  );
}

export default NetworkPendings;
