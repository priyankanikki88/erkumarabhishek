import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex-1">
        <div className="container-page max-w-none py-8 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
