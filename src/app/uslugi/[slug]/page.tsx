import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { Server, Laptop, Wifi, Code, HelpCircle, HardDrive, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import { Metadata } from "next";

// Data Dictionary for services details
interface ServiceDetail {
  icon: string;
  problemsBg: string[];
  problemsEn: string[];
  activitiesBg: string[];
  activitiesEn: string[];
  processBg: string[];
  processEn: string[];
  faqs: { qBg: string; qEn: string; aBg: string; aEn: string }[];
  related: string[];
}

const serviceDetailsData: Record<string, ServiceDetail> = {
  "it-poddrazhka-za-firmi": {
    icon: "server",
    problemsBg: [
      "Спиране на работата на служителите поради блокирали компютри.",
      "Проблеми със синхронизацията на файлове или достъпа до фирмения сървър.",
      "Бавна и нестабилна работа на локалния офис принтер или скенер.",
      "Липса на сигурни архивни копия на счетоводни или оперативни данни."
    ],
    problemsEn: [
      "Staff workflow interruptions due to frozen or failing computers.",
      "File synchronization issues or lack of access to the local office server.",
      "Slow and unstable performance of shared office printers and copiers.",
      "Lack of secure backups for accounting or operational databases."
    ],
    activitiesBg: [
      "Настройка на споделен достъп до принтери, скенери и локални мрежи.",
      "Периодична диагностика на хардуера и превантивно почистване от прах.",
      "Конфигуриране на споделени папки с контрол на достъпа за служители.",
      "Инсталиране и обновяване на операционни системи и приложен софтуер.",
      "Консултации за планиране на IT инфраструктура и закупуване на нови компютри."
    ],
    activitiesEn: [
      "Setting up shared access to printers, scanners, and local networks.",
      "Periodic hardware diagnostics and preventative dust cleaning.",
      "Configuring shared file folders with user-specific access control.",
      "Installing and updating operating systems and work applications.",
      "IT infrastructure planning consults and hardware lifecycle reviews."
    ],
    processBg: [
      "Първоначален преглед на оборудването и мрежата в офиса.",
      "Изготвяне на индивидуално предложение за абонаментна поддръжка.",
      "Организиране на история на техническите случаи за Вашите компютри.",
      "Периодични софтуерни профилактики и подкрепа за Вашите служители."
    ],
    processEn: [
      "Initial audit of your office computers and local network.",
      "Drafting a custom subscription support offer based on needs.",
      "Setting up asset history tracking for all office computers.",
      "Periodic software updates and helpdesk support for your employees."
    ],
    faqs: [
      {
        qBg: "Какви са сроковете за реакция при технически проблем?",
        qEn: "What are the response times for tech incidents?",
        aBg: "Сроковете за реакция не са твърдо гарантирани в общия случай и се определят индивидуално в сключения писмен договор за абонаментна поддръжка.",
        aEn: "Response times are not globally guaranteed and are defined individually inside your signed subscription contract."
      },
      {
        qBg: "Предлагате ли посещения на място в офиса?",
        qEn: "Do you offer on-site office visits?",
        aBg: "Да, за фирми в София се предлага посещение на място от наш техник, когато проблемът не може да бъде решен отдалечено.",
        aEn: "Yes, for businesses in Sofia, on-site technician visits are available when the issue cannot be resolved via remote access."
      }
    ],
    related: ["mrezhi-i-internet", "arhivirane-i-zashtita", "distancionna-pomosht"]
  },
  "remont-na-kompyutri": {
    icon: "laptop",
    problemsBg: [
      "Компютърът се изключва сам или загрява силно по време на работа.",
      "Операционната система не зарежда или дава син екран (BSOD).",
      "Лаптопът е залят с течност или има счупен корпус/панти.",
      "Твърдият диск издава странни звуци и файловете се отварят бавно."
    ],
    problemsEn: [
      "Computer shuts down randomly or runs extremely hot under load.",
      "Operating system fails to boot or crashes into a blue screen (BSOD).",
      "Laptop is liquid-damaged or has cracked plastics/hinges.",
      "Hard drive makes clicking sounds and file loading is extremely sluggish."
    ],
    activitiesBg: [
      "Диагностика на дънни платки, видеокарти и захранващи блокове.",
      "Почистване от прах и подмяна на термопаста на процесори.",
      "Подмяна на повреден твърд диск с бърз SSD диск и прехвърляне на данни.",
      "Ремонт или подмяна на матрици, клавиатури и букси на лаптопи.",
      "Ъпгрейд на оперативна памет (RAM) и хардуерна оптимизация."
    ],
    activitiesEn: [
      "Motherboard, graphics card, and power supply unit diagnostics.",
      "Dust cleaning and CPU thermal paste replacement.",
      "Replacing failed mechanical HDDs with high-speed SSDs and data migration.",
      "Laptop screen, keyboard, and power jack replacement or repairs.",
      "System memory (RAM) upgrades and hardware optimization."
    ],
    processBg: [
      "Оставяте компютъра за диагностика в нашия офис в София.",
      "Нашият техник извършва тестове и локализира дефекта.",
      "Свързваме се с Вас с предложение за цена на резервните части и ремонта.",
      "След Вашето потвърждение извършваме ремонта и тестваме устройството."
    ],
    processEn: [
      "Drop off the device for diagnostics at our Sofia workshop.",
      "Our technician runs hardware tests to identify the defect.",
      "We contact you with a repair quote detailing replacement parts.",
      "Upon approval, we complete the repair and run stability tests."
    ],
    faqs: [
      {
        qBg: "Колко време отнема стандартната диагностика?",
        qEn: "How long does standard diagnostics take?",
        aBg: "Обикновено отнема между 1 и 2 работни дни от приемането на компютъра в нашия сервиз.",
        aEn: "Usually it takes between 1 and 2 business days from the moment the computer is accepted in our shop."
      },
      {
        qBg: "Давате ли гаранция за извършения ремонт?",
        qEn: "Do you offer a warranty on repairs?",
        aBg: "Гаранционният срок зависи от вложените резервни части и се уточнява при представянето на офертата.",
        aEn: "Warranty terms depend entirely on the specific replacement parts used and are detailed within your repair offer."
      }
    ],
    related: ["softuerna-pomosht", "it-poddrazhka-za-firmi", "arhivirane-i-zashtita"]
  },
  "mrezhi-i-internet": {
    icon: "wifi",
    problemsBg: [
      "Бавна скорост на безжичния интернет (Wi-Fi) в някои стаи.",
      "Чести прекъсвания на мрежовата връзка по време на видеоразговори.",
      "Невъзможност за свързване на нови устройства към безжичната мрежа.",
      "Липса на мрежова защита и риск от неоторизиран достъп."
    ],
    problemsEn: [
      "Slow wireless internet speed (Wi-Fi) in specific office rooms.",
      "Frequent connection drops during video calls or database queries.",
      "Inability to connect new smart devices to the local router.",
      "Lack of local firewall policies and threat of unauthorized access."
    ],
    activitiesBg: [
      "Проектиране на кабелно трасе и разположение на Wi-Fi точки за достъп.",
      "Конфигуриране на домашни и офис рутери, суичове и безжични мрежи.",
      "Настройка на отделна гост-мрежа за клиенти в офиса или магазина.",
      "Премахване на 'мъртви зони' без Wi-Fi покритие чрез разширители или Mesh системи.",
      "Диагностика на повредени розетки, пач кабели и мрежови суичове."
    ],
    activitiesEn: [
      "Designing cable layouts and optimal Wi-Fi access point placement.",
      "Configuring home or office routers, switches, and wireless networks.",
      "Setting up isolated guest Wi-Fi networks for clients in offices.",
      "Eliminating Wi-Fi dead zones using range extenders or Mesh setups.",
      "Diagnosing faulty ethernet wall sockets, patch cables, and switches."
    ],
    processBg: [
      "Посещение за оглед на помещенията и измерване на Wi-Fi сигнала.",
      "Предложение за оптимално разположение на рутери и кабели.",
      "Инсталиране, окабеляване и софтуерна настройка на мрежата.",
      "Тестване на скоростта, покритието и сигурността на връзката."
    ],
    processEn: [
      "On-site visit to inspect layout and measure wireless signals.",
      "Proposing optimal placement for network routers and cabling.",
      "Installing, cabling, and configuring the network parameters.",
      "Running speed, signal coverage, and security checks."
    ],
    faqs: [
      {
        qBg: "С какви марки мрежово оборудване работите?",
        qEn: "Which brands of networking gear do you support?",
        aBg: "Работим с широк спектър от производители. Препоръчителната марка и модел се определят спрямо нуждите и бюджета на клиента.",
        aEn: "We support a wide variety of brands. Recommended hardware models are chosen based on customer needs and budget."
      }
    ],
    related: ["it-poddrazhka-za-firmi", "softuerna-pomosht", "distancionna-pomosht"]
  },
  "softuerna-pomosht": {
    icon: "code",
    problemsBg: [
      "Програми като Outlook или счетоводен софтуер блокират постоянно.",
      "Наличие на вируси, рекламен софтуер или нежелани търсачки.",
      "Липсващи драйвери за звук, видеокарта или новоприкачен принтер.",
      "Windows дава постоянни съобщения за неуспешно обновяване."
    ],
    problemsEn: [
      "Applications like Outlook, browsers, or business tools freeze often.",
      "System infections, adware pop-ups, or hijacked browser homepages.",
      "Missing hardware drivers for sound cards, GPUs, or print servers.",
      "Windows update failure alerts displaying repeating error codes."
    ],
    activitiesBg: [
      "Инсталиране и преинсталиране на легитимни операционни системи.",
      "Конфигуриране на имейл клиенти (Outlook, Thunderbird) и пощенски кутии.",
      "Почистване от зловреден софтуер (вируси, spyware, adware).",
      "Настройка на драйвери за правилна работа на хардуерните компоненти.",
      "Инсталиране на драйвери за принтери, скенери и касови апарати."
    ],
    activitiesEn: [
      "Installing and reinstalling clean, licensed operating systems.",
      "Configuring email clients (Outlook, Thunderbird) and custom domains.",
      "Cleaning out malicious software (viruses, spyware, adware).",
      "Updating device drivers to resolve hardware instability.",
      "Installing drivers for local office printers, scanners, and peripherals."
    ],
    processBg: [
      "Оценка дали проблемът може да се реши дистанционно или на място.",
      "Запазване на потребителските данни (файлове и архиви) преди работа.",
      "Извършване на настройките и инсталациите на софтуера.",
      "Проверка за стабилност и демонстрация на работещите програми."
    ],
    processEn: [
      "Assessing if the error requires remote support or shop drop-off.",
      "Backing up user files, documents, and directories before modifications.",
      "Performing the software configuration, setup, or OS installation.",
      "Running updates and demonstrating stable software execution."
    ],
    faqs: [
      {
        qBg: "Предоставяте ли лицензи за софтуер?",
        qEn: "Do you supply software licenses?",
        aBg: "Не, инсталираме софтуер само с предоставени от клиента оригинални лицензионни ключове или свободен софтуер.",
        aEn: "No, we only install software using license keys supplied by the customer, or free/open-source tools."
      }
    ],
    related: ["distancionna-pomosht", "remont-na-kompyutri", "arhivirane-i-zashtita"]
  },
  "distancionna-pomosht": {
    icon: "help-circle",
    problemsBg: [
      "Нужда от спешна намеса за коригиране на софтуерна грешка.",
      "Имейлът е спрял да изпраща или получава съобщения.",
      "Невъзможност за инсталиране на конкретно приложение.",
      "Грешка при принтиране на важен документ от текстообработваща програма."
    ],
    problemsEn: [
      "Urgent software error stopping employee workflow.",
      "Email client stopped sending or receiving messages.",
      "Inability to install or configure a specific office application.",
      "Printer communication errors when sending files from text editors."
    ],
    activitiesBg: [
      "Дистанционно конфигуриране на пощенски акаунти и IMAP/SMTP настройки.",
      "Почистване на временни файлове и оптимизиране на бавно зареждащ се Windows.",
      "Инсталиране на офис пакети, PDF четци и специализирани програми.",
      "Помощ при споделяне на екрана за настройки на браузъри и подписи.",
      "Настройка на мрежови принтери през TeamViewer или AnyDesk."
    ],
    activitiesEn: [
      "Configuring email accounts and verifying IMAP/SMTP settings.",
      "Cleaning temp files and optimizing slow Windows system boots.",
      "Installing office suites, PDF readers, and business utilities.",
      "Screen-sharing guidance to configure browser settings and signatures.",
      "Network printer setups utilizing secure remote connections."
    ],
    processBg: [
      "Свързвате се с нас по телефона или изпращате бърза онлайн заявка.",
      "Сваляте и стартирате програмата AnyDesk или TeamViewer.",
      "Продиктовате ни Вашия уникален ID номер за отдалечен достъп.",
      "Наш техник се свързва и отстранява проблема пред очите Ви."
    ],
    processEn: [
      "Contact us via phone or submit an online request.",
      "Download and run AnyDesk or TeamViewer on your desktop.",
      "Share your secure, temporary remote connection ID number with us.",
      "Our technician connects and resolves the issue in real time."
    ],
    faqs: [
      {
        qBg: "Сигурна ли е връзката за дистанционна помощ?",
        qEn: "Is remote support secure?",
        aBg: "Връзката е напълно сигурна. Ние не можем да се свържем без Вашето изрично съгласие и предоставяне на нов паролен код.",
        aEn: "Yes, it is secure. We cannot connect to your computer without your explicit confirmation and temporary password."
      }
    ],
    related: ["softuerna-pomosht", "it-poddrazhka-za-firmi", "mrezhi-i-internet"]
  },
  "arhivirane-i-zashtita": {
    icon: "hard-drive",
    problemsBg: [
      "Липса на резервни копия на базата данни на счетоводния софтуер.",
      "Риск от криптовируси, които заключват фирмените файлове.",
      "Опасност от загуба на информация при дефектирал твърд диск.",
      "Липса на автоматизация на архивния процес (прави се ръчно на флашка)."
    ],
    problemsEn: [
      "Lack of backup routines for accounting databases.",
      "Threat of ransomware encrypting corporate files and spreadsheets.",
      "High risk of data loss if an aging mechanical hard drive fails.",
      "No backup automation in place (relying on manual USB copying)."
    ],
    activitiesBg: [
      "Конфигуриране на NAS устройства за локален архив в офиса (RAID масиви).",
      "Настройка на защитени облачни архиви (OneDrive, Google Drive, Backblaze).",
      "Определяне на графици за ежедневно автоматично архивиране без прекъсване на работата.",
      "Инсталиране на базов антивирусен софтуер и защита на защитни стени.",
      "Консултации за възстановяване на информация след технически аварии."
    ],
    activitiesEn: [
      "Configuring local NAS storage arrays (RAID setups) in the office.",
      "Setting up secure cloud backup jobs (OneDrive, Google Drive, Backblaze).",
      "Setting up daily automated backup schedules running in the background.",
      "Installing endpoint antivirus packages and local firewall setups.",
      "Data recovery consulting following sudden hardware failures."
    ],
    processBg: [
      "Анализ на обема и важността на Вашите бизнес файлове.",
      "Избор на подходящо локално или облачно хранилище за архивите.",
      "Настройка и тестване на автоматичния скрипт за архивиране.",
      "Мониторинг за успешното приключване на архивните задачи."
    ],
    processEn: [
      "Analyzing the scale and critical value of your business data.",
      "Selecting the most suitable local or cloud backup storage endpoint.",
      "Setting up and test-running the automated backup scripts.",
      "Monitoring backup task completion states and log warnings."
    ],
    faqs: [
      {
        qBg: "Колко често трябва да се архивират фирмените данни?",
        qEn: "How often should corporate data be backed up?",
        aBg: "Препоръчително е критичните счетоводни и оперативни данни да се архивират ежедневно, а системните файлове - ежеседмично.",
        aEn: "It is recommended that critical accounting and business databases are backed up daily, while system states can be weekly."
      }
    ],
    related: ["it-poddrazhka-za-firmi", "softuerna-pomosht", "remont-na-kompyutri"]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const t = translations[locale];
  
  const service = t.services.items[slug as keyof typeof t.services.items];
  if (!service) return {};

  return {
    title: `${service.title} | Алми Груп ООД София`,
    description: service.desc,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  const service = t.services.items[slug as keyof typeof t.services.items];
  const details = serviceDetailsData[slug];

  if (!service || !details) {
    notFound();
  }

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "server":
        return <Server className="h-10 w-10 text-cyan-400" />;
      case "laptop":
        return <Laptop className="h-10 w-10 text-cyan-400" />;
      case "wifi":
        return <Wifi className="h-10 w-10 text-cyan-400" />;
      case "code":
        return <Code className="h-10 w-10 text-cyan-400" />;
      case "help-circle":
        return <HelpCircle className="h-10 w-10 text-cyan-400" />;
      case "hard-drive":
        return <HardDrive className="h-10 w-10 text-cyan-400" />;
      default:
        return <Laptop className="h-10 w-10 text-cyan-400" />;
    }
  };

  // Construct JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.desc,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Алми Груп ООД",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ул. Цар Симеон 20",
        "addressLocality": "София",
        "addressCountry": "BG"
      },
      "telephone": "+359888002455"
    },
    "areaServed": "София"
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="bg-[#07111F] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-slate-300 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/uslugi" className="hover:text-slate-300 transition-colors">
                  {t.nav.services}
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-350">{service.title}</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0D1F35] border border-slate-800 p-8 sm:p-12 mb-16 shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-3xl space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                {getServiceIcon(details.icon)}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                {service.title}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                {service.desc}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/zayavi-pomosht"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/15"
                >
                  {t.services.ctaOrder}
                </Link>
                <Link
                  href="/diagnostika"
                  className="bg-slate-900 border border-slate-750 hover:bg-slate-800 text-cyan-400 px-6 py-3.5 rounded-xl font-bold transition-all"
                >
                  {isBg ? "Диагностичен асистент" : "Diagnostic Assistant"}
                </Link>
              </div>
            </div>
          </div>

          {/* Core Info Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Common Problems */}
            <div className="bg-[#12263F] border border-slate-800 p-8 rounded-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-amber-500">⚠️</span>
                <span>{t.services.commonProblems}</span>
              </h2>
              <ul className="space-y-4">
                {(isBg ? details.problemsBg : details.problemsEn).map((prob, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-300 leading-relaxed">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Possible activities */}
            <div className="bg-[#12263F] border border-slate-800 p-8 rounded-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-cyan-400">⚙️</span>
                <span>{t.services.possibleActivities}</span>
              </h2>
              <ul className="space-y-4">
                {(isBg ? details.activitiesBg : details.activitiesEn).map((act, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-350 leading-relaxed">
                    <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isBg 
                  ? "* Забележка: Изброените дейности имат примерен характер. Конкретните дейности се определят съгласно сключения абонамент или приемо-предавателния протокол."
                  : "* Note: Listed activities are illustrative. Specific work scopes are defined within subscription contracts or service drop-off protocols."}
              </p>
            </div>

          </div>

          {/* How It Works process steps */}
          <div className="bg-[#0D1F35] border border-slate-850 p-8 sm:p-12 rounded-3xl mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {t.services.howItWorks}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {(isBg ? details.processBg : details.processEn).map((step, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-blue-500/35 flex items-center justify-center text-cyan-400 font-bold mx-auto text-sm">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed px-2">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Service specific FAQs */}
          {details.faqs && details.faqs.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6 mb-16">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                {isBg ? "Въпроси и отговори" : "FAQ"}
              </h2>
              <div className="space-y-4">
                {details.faqs.map((faq, i) => (
                  <div key={i} className="bg-[#12263F] border border-slate-800/80 p-6 rounded-xl">
                    <h3 className="font-bold text-sm text-white mb-2">
                      {isBg ? faq.qBg : faq.qEn}
                    </h3>
                    <p className="text-xs text-slate-350 leading-relaxed border-t border-slate-800/60 pt-3 mt-3">
                      {isBg ? faq.aBg : faq.aEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Services */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              {isBg ? "Свързани услуги:" : "Related services:"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {details.related.map((relSlug) => {
                const relService = t.services.items[relSlug as keyof typeof t.services.items];
                if (!relService) return null;
                return (
                  <Link
                    key={relSlug}
                    href={`/uslugi/${relSlug}`}
                    className="block bg-[#12263F] border border-slate-800 hover:border-slate-700 p-5 rounded-xl transition-colors group"
                  >
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                      {relService.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {relService.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
