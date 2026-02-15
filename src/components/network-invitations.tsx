import * as Tabs from "@radix-ui/react-tabs";
import OutlineButton from "./out-line-button";
import PersonRow from "./network-person-row";
import EmptyState from "./network-empty-state";
import { Person } from "./my-network";
import { Button } from "./ui/button";

function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  },
) {
  const { className, children, ...rest } = props;
  return (
    <Button
      {...rest}
      className={[
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium",
        "bg-primary text-primary-foreground hover:opacity-95",
        "focus-visible:outline-none",
        "disabled:opacity-50 cursor-pointer",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </Button>
  );
}

function NetworkInvitations() {
  const invitations: Person[] = [
    {
      id: 101,
      info: {
        full_name: "Ayesha Khan",
        avatar_url: null,
      },
      status: "requested",
      created_at: new Date().toISOString(),
      user_id: "user-123",
    },
  ];

  return (
    <Tabs.Content value="invitations" className="outline-none">
      {invitations.length === 0 ? (
        <EmptyState
          title="No invitations"
          text="When people invite you, you’ll see them here."
        />
      ) : (
        <div className="space-y-2">
          {invitations.map((p) => (
            <PersonRow
              key={p.id}
              person={p}
              right={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <PrimaryButton type="button">Accept</PrimaryButton>
                  <OutlineButton type="button">Ignore</OutlineButton>
                </div>
              }
            />
          ))}
        </div>
      )}
    </Tabs.Content>
  );
}

export default NetworkInvitations;
