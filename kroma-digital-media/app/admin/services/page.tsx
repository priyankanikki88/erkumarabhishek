import { Pencil } from "lucide-react";
import { services } from "@/lib/data/services";

export default function AdminServicesPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Services Management
        </h1>
        <p className="text-sm text-muted">
          Manage the service cards shown on the Home and Services pages.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-panel/60 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-muted">{service.number}</p>
              <h3 className="font-display text-base font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{service.bullets.length} items listed</p>
            </div>
            <button className="focus-ring inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground sm:self-auto">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
