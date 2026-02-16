import { IMAGES } from "@/constants/images";
import Image from "next/image";

export default function Avatar({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  return (
    <Image
      src={src ?? IMAGES.ICONS.UNKNOWN_USER}
      alt={alt}
      className="size-11 rounded-full object-cover ring-1 ring-border"
      width={25}
      height={80}
      priority={false}
      loading="lazy"
      unoptimized
    />
  );
}
