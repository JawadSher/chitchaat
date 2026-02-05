import { IMAGES } from "@/constants/images";
import { capitalizeName } from "@/lib/capitalize-name";
import { IContact } from "@/types/find-contact";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserRoundPlus } from "lucide-react";

function FindedContactInfo({ userInfo }: { userInfo: IContact }) {
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

      <Button className="rounded-full cursor-pointer p-1 w-full h-8">
        <UserRoundPlus className="size-5" strokeWidth={1.89} /> Connect
      </Button>
    </div>
  );
}

export default FindedContactInfo;
