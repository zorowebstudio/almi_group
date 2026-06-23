export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getLocale } from "@/lib/locale";
import { getUserSession } from "@/lib/auth";
import { PortalSidebar } from "@/components/PortalSidebar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const session = await getUserSession();

  if (!session) {
    redirect("/vhod");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[90vh] bg-[#07111F] text-[#F4F8FC]">
      {/* Client Sidebar Component */}
      <PortalSidebar session={session} locale={locale} />

      {/* Main Workspace */}
      <main className="flex-grow p-4 sm:p-8 md:p-10 bg-[#07111F]">
        <div className="max-w-5xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
