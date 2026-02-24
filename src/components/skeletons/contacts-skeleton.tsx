import { Skeleton } from "@/components/ui/skeleton";

export const ContactListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2 w-full p-2 rounded-md border "
        >
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
};
