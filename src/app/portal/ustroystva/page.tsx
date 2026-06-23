export const dynamic = "force-dynamic";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteDevice } from "@/app/portal/actions";
import AddDeviceForm from "@/components/AddDeviceForm";
import { 
  Laptop, Monitor, Network, Printer, Server, 
  Cpu, Trash2, Shield, Calendar, Info 
} from "lucide-react";

export default async function PortalDevices() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  const isB2B = session.role === "CUSTOMER_COMPANY";
  const deviceWhere = isB2B && session.companyId
    ? { companyId: session.companyId }
    : { userId: session.id };

  const devices = await prisma.device.findMany({
    where: deviceWhere,
    orderBy: { createdAt: "desc" },
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "DESKTOP":
        return <Monitor className="h-5 w-5 text-blue-400" />;
      case "LAPTOP":
        return <Laptop className="h-5 w-5 text-indigo-400" />;
      case "ROUTER":
        return <Network className="h-5 w-5 text-cyan-400" />;
      case "PRINTER":
        return <Printer className="h-5 w-5 text-emerald-400" />;
      case "SERVER":
        return <Server className="h-5 w-5 text-purple-400" />;
      default:
        return <Cpu className="h-5 w-5 text-slate-400" />;
    }
  };

  const getDeviceTypeName = (type: string) => {
    switch (type) {
      case "DESKTOP": return "Настолен компютър";
      case "LAPTOP": return "Лаптоп";
      case "ROUTER": return "Мрежово устройство";
      case "PRINTER": return "Принтер / Скенер";
      case "SERVER": return "Сървър";
      default: return "Друго оборудване";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <Laptop className="h-6 w-6 text-blue-400" />
          <span>{t.portal.devices.title}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Регистрирайте Вашите компютри, принтери и мрежови активи за по-бърза диагностика и поддръжка от нашия екип.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Devices List */}
        <div className="lg:col-span-2 space-y-4">
          {devices.length === 0 ? (
            <div className="bg-[#0D1F35] border border-slate-800 p-8 rounded-xl text-center space-y-2">
              <Laptop className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-bold">
                {t.portal.devices.noDevices}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div 
                  key={device.id} 
                  className="bg-[#0D1F35] border border-slate-800 p-5 rounded-xl flex flex-col justify-between space-y-4 shadow-md relative hover:border-slate-700/80 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-white leading-tight">{device.nickname}</h3>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">{getDeviceTypeName(device.type)}</span>
                        </div>
                      </div>

                      {/* Delete form */}
                      <form action={async () => {
                        "use server";
                        await deleteDevice(device.id);
                      }}>
                        <button 
                          type="submit" 
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-all cursor-pointer"
                          title="Премахни устройство"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-850 text-[11px] text-slate-400">
                      {device.brand || device.model ? (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Модел:</span>
                          <span className="font-semibold text-slate-300">{device.brand} {device.model}</span>
                        </div>
                      ) : null}

                      {device.serialNumber ? (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Сериен №:</span>
                          <span className="font-mono font-semibold text-cyan-400">{device.serialNumber}</span>
                        </div>
                      ) : null}

                      {device.os ? (
                        <div className="flex justify-between">
                          <span className="text-slate-500">ОС:</span>
                          <span className="font-semibold text-slate-350">{device.os}</span>
                        </div>
                      ) : null}

                      {device.isNetworkAsset && (
                        <div className="flex items-center space-x-1 text-[9px] text-cyan-400 font-bold bg-cyan-950/30 border border-cyan-900/30 px-1.5 py-0.5 rounded self-start mt-2">
                          <Shield className="h-3 w-3" />
                          <span>КРИТИЧЕН МРЕЖОВ АКТИВ</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {device.notes && (
                    <div className="bg-slate-900/50 p-2.5 rounded border border-slate-850 text-[10px] text-slate-500 italic leading-normal whitespace-pre-wrap">
                      {device.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: Registration Form */}
        <div className="space-y-4">
          <AddDeviceForm />

          {/* Guidelines info */}
          <div className="bg-[#0D1F35]/40 border border-slate-850 p-5 rounded-xl space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Info className="h-4 w-4 text-cyan-400" />
              <span>Защо да регистрирам устройства?</span>
            </h4>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Регистрираното оборудване се свързва директно с Вашите технически заявки. При възникване на проблем, нашите техници знаят предварително марката, модела, серийния номер и операционната система, което съкращава времето за диагностика с над 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
