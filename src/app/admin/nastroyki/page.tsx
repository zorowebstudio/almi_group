export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import AdminSettingsForm from "@/components/AdminSettingsForm";
import { Settings } from "lucide-react";

export default async function AdminSettings() {
  const settings = await prisma.siteSetting.findMany();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <Settings className="h-6 w-6 text-blue-400" />
          <span>Системни Настройки</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Конфигурирайте системните параметри на фирмата, адреси, контакти и интеграционни превключватели.
        </p>
      </div>

      <AdminSettingsForm initialSettings={settings} />
    </div>
  );
}
