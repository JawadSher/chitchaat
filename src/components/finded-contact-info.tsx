import { IMAGES } from "@/constants/images";
import { IContact } from "@/types/find-contact";
import Image from "next/image";

function FindedContactInfo({ userInfo }: { userInfo: IContact }) {
  return (
    <div className="flex items-center w-full p-2 gap-2 cursor-pointer rounded-xl border hover:border-primary bg-primary-foreground/30">
      <Image
        src={userInfo?.avatar_url || IMAGES.ICONS.UNKNOWN_USER}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full"
      />

      <div className="flex flex-col items-start justify-center">
        <p className="font-semibold">{userInfo.full_name}</p>
        <span className="text-sm text-muted-foreground">{userInfo.username}</span>
      </div>
    </div>
  );
}

export default FindedContactInfo;
