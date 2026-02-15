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
      src={
        src ??
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3C/svg%3E"
      }
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
