import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 bg-background px-5 py-8 md:px-10 md:py-10">{children}</div>
    </div>
  );
}
