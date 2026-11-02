import { Upload } from "lucide-react";

const mediaItems = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  name: `asset-${(i + 1).toString().padStart(3, "0")}.jpg`,
  size: `${(0.4 + i * 0.12).toFixed(1)} MB`,
}));

export default function AdminMediaPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Media Library
          </h1>
          <p className="text-sm text-muted">
            Images and files used across the website and case studies.
          </p>
        </div>
        <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple px-4 py-2.5 text-sm font-semibold text-background">
          <Upload className="h-4 w-4" />
          Upload Files
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {mediaItems.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-panel/60 p-3">
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/15 via-background to-background">
              <div className="h-8 w-8 rounded-lg bg-white/10" />
            </div>
            <p className="mt-2 truncate text-xs font-medium text-foreground">{item.name}</p>
            <p className="text-[0.7rem] text-muted">{item.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
