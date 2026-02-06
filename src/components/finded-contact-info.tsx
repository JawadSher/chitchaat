"use client";
import { IMAGES } from "@/constants/images";
import { capitalizeName } from "@/lib/capitalize-name";
import { IContact } from "@/types/find-contact";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserRoundPlus } from "lucide-react";
import { useSendConnection } from "@/hooks/react-query/mutation-contact";
import { Loader } from "./loader";

function FindedContactInfo({ userInfo }: { userInfo: IContact }) {
  const { mutate, isPending } = useSendConnection();

  async function handleSendConnect() {
    mutate({ contact_id: userInfo.user_id });
  }

  return (
    <div className="flex flex-col items-center w-full p-2 gap-2 rounded-xl bg-primary-foreground/30 relative">
      <Image
        src={userInfo?.avatar_url || IMAGES.ICONS.UNKNOWN_USER}
        alt="avatar"
        width={100}
        height={100}
        className="rounded-full"
        priority={false}
        unoptimized
      />

      <div className="flex flex-col items-start justify-center">
        <p className="font-semibold">
          {capitalizeName({ name: userInfo.full_name })}
        </p>
        <span className="text-sm text-muted-foreground">
          @{userInfo.username}
        </span>
      </div>

      <Button
        onClick={handleSendConnect}
        className="rounded-full cursor-pointer p-1 w-full h-8"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader className="size-5" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <UserRoundPlus className="size-5" strokeWidth={1.89} />
            <span>Connect</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default FindedContactInfo;
