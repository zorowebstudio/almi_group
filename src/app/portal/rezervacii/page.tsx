export const dynamic = "force-dynamic";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Calendar, PlusCircle, Clock, MapPin, User, Laptop } from "lucide-react";

export default async function PortalBookings() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  const appointments = await prisma.appointment.findMany({
    where: { customerId: session.id },
    include: {
      technician: { select: { name: true } },
    },
    orderBy: { date: "asc" },
  });
  const getStatusClass = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-950/20 border-green-900/30 text-green-400 border";
      case "PENDING": return "bg-slate-900 border-slate-800 text-slate-400 border";
      case "RESCHEDULED": return "bg-blue-950 border-blue-800 text-blue-400 border";
      case "CANCELLED": return "bg-red-950/20 border-red-900/30 text-red-400 border";
      case "COMPLETED": return "bg-slate-850 text-slate-500 border border-slate-800";
      default: return "bg-slate-900 text-slate-400 border border-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-400" />
            <span>{t.portal.tabs.bookings}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            График на насрочените посещения от техническо лице и активни ИТ консултации.
          </p>
        </div>

        <Link
          href="/rezervaciya"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md self-start sm:self-center"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Заяви посещение / час</span>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-[#0D1F35] border border-slate-800 p-10 rounded-xl text-center space-y-3">
          <Calendar className="h-10 w-10 text-slate-650 mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">
            Нямате предстоящи или минали резервации за посещения.
          </p>
          <p className="text-[10px] text-slate-550 max-w-sm mx-auto">
            Имате нужда от посещение на системен администратор на място във Вашия офис или спешно дистанционно съдействие? Резервирайте свободен час бързо и лесно.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-[#0D1F35] border border-slate-800/80 p-5 rounded-xl shadow-md space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white leading-none">
                    {t.enums?.serviceTypes[app.serviceType as keyof typeof t.enums.serviceTypes] || app.serviceType}
                  </h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Резервация
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusClass(app.status)}`}>
                  {t.enums?.bookingStatuses[app.status as keyof typeof t.enums.bookingStatuses] || app.status}
                </span>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-850 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Дата и час</p>
                    <p className="font-semibold">
                      {new Date(app.date).toLocaleDateString("bg-BG")} в {app.timeSlot}
                    </p>
                  </div>
                </div>
 
                <div className="flex items-center space-x-2 text-slate-300">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Локация</p>
                    <p className="font-semibold truncate max-w-[150px]">
                      {app.locationType === "REMOTE" ? (locale === "bg" ? "Дистанционна връзка" : "Remote connection") : 
                       app.locationType === "OFFICE" ? (locale === "bg" ? "Офис на Алми Груп" : "Almi Group Office") : (app.address || (locale === "bg" ? "Адрес на клиента" : "Client address"))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-300">
                  <User className="h-4 w-4 text-indigo-400" />
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Назначен техник</p>
                    <p className="font-semibold">
                      {app.technician?.name || "Разпределя се..."}
                    </p>
                  </div>
                </div>

                {app.ticketId && (
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Laptop className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Свързан казус</p>
                      <p className="font-semibold text-purple-400">
                        Има отворена заявка
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {app.notes && (
                <div className="bg-slate-900/50 p-2.5 rounded border border-slate-850 text-[10px] text-slate-500 italic whitespace-pre-wrap leading-normal">
                  Бележки към посещението: {app.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
