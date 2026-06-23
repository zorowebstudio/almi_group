import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  // Route Guard - enforce ADMIN role
  if (!session || session.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07111F] text-[#F4F8FC]">
      {/* Admin Client Sidebar component */}
      <AdminSidebar session={session} />

      {/* Main Workspace */}
      <main className="flex-grow p-4 sm:p-8 md:p-10 bg-[#07111F]">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
