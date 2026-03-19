export default async function CallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="h-screen w-screen bg-neutral-950 text-white flex flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h1 className="text-sm font-medium">Call Window</h1>
        <span className="text-xs text-white/60">Room: {id}</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          Your custom call UI here
        </div>
      </div>
    </main>
  );
}
