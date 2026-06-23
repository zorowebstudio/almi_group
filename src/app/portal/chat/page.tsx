import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createChatConversation } from "@/app/portal/actions";
import PortalChatWindow from "@/components/PortalChatWindow";
import { MessageSquare, AlertCircle, Sparkles, Send } from "lucide-react";

export default async function PortalChat() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  // Fetch active support conversation
  const activeConversation = await prisma.chatConversation.findFirst({
    where: {
      userId: session.id,
      status: "ACTIVE"
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-blue-400" />
          <span>{t.portal.tabs.chat}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Директна текстова връзка с дежурния системен администратор по софтуерни или мрежови въпроси.
        </p>
      </div>

      {activeConversation ? (
        <PortalChatWindow
          conversationId={activeConversation.id}
          initialMessages={activeConversation.messages}
          currentUserId={session.id}
        />
      ) : (
        <div className="bg-[#0D1F35] border border-slate-800 p-8 sm:p-10 rounded-2xl max-w-2xl mx-auto space-y-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl inline-block">
            <MessageSquare className="h-10 w-10 text-cyan-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-extrabold text-white">Стартирайте нов разговор</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Имате бърз технически въпрос или се нуждаете от неотложно съдействие? Отворете чат с дежурния специалист.
            </p>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-left text-xs space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Какво можем да решим в чата?</span>
            </h4>
            <ul className="list-disc pl-4 text-slate-400 space-y-1 text-[11px] leading-relaxed">
              <li>Помощ при конфигурация на имейли (Outlook/Thunderbird)</li>
              <li>Проблеми с инсталиране на драйвери за принтери</li>
              <li>Съдействие при блокиран достъп до сайтове или Wi-Fi парола</li>
              <li>Дистанционно диагностициране чрез AnyDesk / TeamViewer</li>
            </ul>
          </div>

          <form action={async () => {
            "use server";
            await createChatConversation("Бързо съдействие от клиентски портал");
          }}>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-6 py-3 rounded-lg transition-all shadow-md cursor-pointer"
            >
              <span>Свържи ме с техник</span>
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-550 pt-2">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>За тежки хардуерни дефекти, моля използвайте формата за „Нова заявка“</span>
          </div>
        </div>
      )}
    </div>
  );
}
