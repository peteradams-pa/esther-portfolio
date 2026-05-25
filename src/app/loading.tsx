// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-sol-ash flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-sol-amber/20 border-t-sol-amber rounded-full animate-spin" />
        <div className="text-[0.72rem] tracking-widest uppercase text-sol-steel">Loading…</div>
      </div>
    </div>
  )
}
