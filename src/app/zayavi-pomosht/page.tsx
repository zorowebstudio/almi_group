"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { 
  CheckCircle, AlertCircle, ArrowLeft, ArrowRight, 
  User, Building2, Phone, Mail, FileText, Upload, 
  HelpCircle, Settings, Loader2
} from "lucide-react";

export default function RequestHelpPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedTicketNo, setGeneratedTicketNo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Client Type
  const [clientType, setClientType] = useState<"PRIVATE" | "COMPANY">("PRIVATE");

  // Step 2: Contact Info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [eik, setEik] = useState("");

  // Step 3: Device & Problem
  const [category, setCategory] = useState("SOFTWARE");
  const [service, setService] = useState("softuerna-pomosht");
  const [deviceType, setDeviceType] = useState("LAPTOP");
  const [os, setOs] = useState("Windows 11");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("NORMAL");

  // Step 4: Preferences
  const [supportMethod, setSupportMethod] = useState("REMOTE");
  const [contactMethod, setContactMethod] = useState("EMAIL");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [address, setAddress] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // File Upload State
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const serviceKeys = Object.keys(t.services.items) as Array<keyof typeof t.services.items>;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      let sizeError = false;
      let typeError = false;

      files.forEach((file) => {
        // Size validation: 5MB
        if (file.size > 5 * 1024 * 1024) {
          sizeError = true;
        } else if (!["image/png", "image/jpeg", "image/webp", "application/pdf", "text/plain"].includes(file.type)) {
          typeError = true;
        } else {
          validFiles.push(file);
        }
      });

      if (sizeError) {
        setErrorMsg(t.forms.errors.fileSize);
      } else if (typeError) {
        setErrorMsg(t.forms.errors.fileType);
      } else {
        setAttachedFiles([...attachedFiles, ...validFiles]);
        setErrorMsg("");
      }
    }
  };

  const removeFile = (idx: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== idx));
  };

  const validateStep = () => {
    setErrorMsg("");
    
    if (step === 2) {
      if (!fullName) return isBg ? "Моля въведете трите си имена." : "Full name is required.";
      if (!email.includes("@")) return t.forms.errors.email;
      if (!phone || phone.length < 7) return t.forms.errors.phone;
      if (clientType === "COMPANY" && !companyName) return isBg ? "Моля попълнете име на фирмата." : "Company name is required.";
    }

    if (step === 3) {
      if (!subject || subject.length < 5) return isBg ? "Темата трябва да е поне 5 символа." : "Subject must be at least 5 chars.";
      if (!description || description.length < 15) return isBg ? "Описанието трябва да е поне 15 символа." : "Description must be at least 15 chars.";
    }

    if (step === 4) {
      if (supportMethod === "ON_SITE" && !address) {
        return isBg ? "Моля въведете адрес за посещение на място." : "Address is required for on-site visits.";
      }
      if (!privacyConsent) return t.forms.errors.privacy;
    }

    return "";
  };

  const nextStep = () => {
    const error = validateStep();
    if (error) {
      setErrorMsg(error);
      return;
    }
    setStep(step + 1);
    setErrorMsg("");
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep();
    if (error) {
      setErrorMsg(error);
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const body = {
        name: fullName,
        email,
        phone,
        clientType,
        companyName: clientType === "COMPANY" ? companyName : undefined,
        category,
        service,
        deviceType,
        os,
        subject,
        description,
        urgency,
        contactMethod,
        supportMethod,
        preferredDate: preferredDate || undefined,
        preferredTime: preferredTime || undefined,
        address: supportMethod === "ON_SITE" ? address : undefined,
        privacyConsent,
      };

      const response = await fetch("/api/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit request");
      }

      setGeneratedTicketNo(resData.ticketNumber);
      setSubmitSuccess(true);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || (isBg ? "Възникна грешка при изпращането." : "An error occurred."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#07111F] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                {t.nav.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-350">{t.nav.requestHelp}</li>
          </ol>
        </nav>

        {/* Stepper Header (Hidden in Success Screen) */}
        {!submitSuccess && (
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {[
                { s: 1, l: isBg ? "Тип" : "Type" },
                { s: 2, l: isBg ? "Контакт" : "Contact" },
                { s: 3, l: isBg ? "Проблем" : "Issue" },
                { s: 4, l: isBg ? "Опции" : "Preferences" },
                { s: 5, l: isBg ? "Преглед" : "Review" },
              ].map((stepItem) => (
                <div key={stepItem.s} className="flex flex-col items-center flex-1 relative">
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                      step >= stepItem.s
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-500"
                    }`}
                  >
                    {stepItem.s}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-slate-450 hidden sm:block">
                    {stepItem.l}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-px bg-slate-800/80 mt-4" />
          </div>
        )}

        {/* Content Box */}
        <div className="bg-[#12263F] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          
          {submitSuccess ? (
            /* Success confirmation screen */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isBg ? "Заявката е изпратена!" : "IT Request Submitted!"}
              </h1>
              <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl max-w-md mx-auto space-y-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                  {t.ticket.ticketNumber}
                </p>
                <p className="text-2xl font-extrabold text-cyan-400">
                  {generatedTicketNo}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed pt-2">
                  {isBg
                    ? "Вашата заявка е приета и заведена в системата ни. Наш технически сътрудник ще я прегледа и ще се свърже с Вас за допълнителни стъпки."
                    : "Your support request is recorded in our system. A technician will review details and connect with you shortly."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link
                  href={`/proveri-zayavka?no=${generatedTicketNo}&email=${email}`}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-xs font-bold transition-all shadow shadow-blue-500/10"
                >
                  {isBg ? "Проследи заявката" : "Track Request"}
                </Link>
                <a
                  href={`tel:${t.nav.phone}`}
                  className="w-full sm:w-auto bg-slate-900 border border-slate-750 text-white px-6 py-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 hover:bg-slate-800 transition-all"
                >
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isBg ? `Обади се: ${t.nav.phone}` : `Call: ${t.nav.phone}`}</span>
                </a>
                <Link
                  href="/"
                  className="w-full sm:w-auto bg-transparent border border-slate-750 text-slate-400 hover:text-white px-6 py-3 rounded-lg text-xs font-bold transition-all"
                >
                  {isBg ? "Начална страница" : "Back Home"}
                </Link>
              </div>
            </div>
          ) : (
            /* Wizard Steps form */
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* Step 1: Client Type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-white">
                      {isBg ? "Изберете тип клиент" : "Select client type"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isBg 
                        ? "Поддръжка за дома или бизнес абонамент за компания?" 
                        : "Home technical support or business corporate subscription?"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setClientType("PRIVATE")}
                      className={`p-6 rounded-2xl border text-left flex items-start space-x-4 transition-all ${
                        clientType === "PRIVATE"
                          ? "bg-blue-600/10 border-blue-500 text-cyan-400 shadow-lg"
                          : "bg-slate-900/50 border-slate-850 text-slate-350 hover:border-slate-800"
                      }`}
                    >
                      <User className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {t.services.private}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {isBg 
                            ? "Компютърни услуги, софтуерна и Wi-Fi помощ за физически лица." 
                            : "Computer repairs, software setup and Wi-Fi help for private individuals."}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClientType("COMPANY")}
                      className={`p-6 rounded-2xl border text-left flex items-start space-x-4 transition-all ${
                        clientType === "COMPANY"
                          ? "bg-blue-600/10 border-blue-500 text-cyan-400 shadow-lg"
                          : "bg-slate-900/50 border-slate-850 text-slate-350 hover:border-slate-800"
                      }`}
                    >
                      <Building2 className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {t.services.business}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {isBg 
                            ? "ИТ поддръжка, мрежи и архивиране за офиси, кантори и търговски обекти." 
                            : "IT support, local networks, and backups for offices, stores, and businesses."}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4 text-center">
                    {isBg ? "Информация за контакт" : "Contact Information"}
                  </h2>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.fullName} *</label>
                    <input
                      type="text"
                      placeholder={t.forms.placeholders.fullName}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.email} *</label>
                      <input
                        type="email"
                        placeholder={t.forms.placeholders.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.phone} *</label>
                      <input
                        type="text"
                        placeholder={t.forms.placeholders.phone}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {clientType === "COMPANY" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">{t.forms.companyName} *</label>
                        <input
                          type="text"
                          placeholder={t.forms.placeholders.companyName}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">{t.forms.eik}</label>
                        <input
                          type="text"
                          placeholder="123456789"
                          value={eik}
                          onChange={(e) => setEik(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Issue Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4 text-center">
                    {isBg ? "Описание на техническия проблем" : "Device & Problem Description"}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{isBg ? "Проблемна сфера:" : "Problem Area:"}</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="HARDWARE">{isBg ? "Хардуер / Ремонт" : "Hardware / Repair"}</option>
                        <option value="SOFTWARE">{isBg ? "Софтуер / Настройки" : "Software / Setup"}</option>
                        <option value="NETWORK">{isBg ? "Мрежи / Интернет" : "Networks / Internet"}</option>
                        <option value="SECURITY">{isBg ? "Сигурност / Фишинг" : "Security / Phishing"}</option>
                        <option value="OTHER">{isBg ? "Друго" : "Other"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{isBg ? "Препоръчана услуга:" : "Recommended Service:"}</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        {serviceKeys.map((key) => (
                          <option key={key} value={key}>
                            {t.services.items[key].title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.deviceType}</label>
                      <select
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="LAPTOP">{isBg ? "Лаптоп" : "Laptop"}</option>
                        <option value="DESKTOP">{isBg ? "Компютър" : "Desktop Computer"}</option>
                        <option value="ROUTER">{isBg ? "Рутер / Wi-Fi" : "Router"}</option>
                        <option value="PRINTER">{isBg ? "Принтер" : "Printer"}</option>
                        <option value="SERVER">{isBg ? "Сървър" : "Server"}</option>
                        <option value="OTHER">{isBg ? "Друго" : "Other"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.os}</label>
                      <input
                        type="text"
                        placeholder="Windows 11, macOS, Linux"
                        value={os}
                        onChange={(e) => setOs(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.urgency}</label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="LOW">{t.ticket.urgencies.LOW}</option>
                        <option value="NORMAL">{t.ticket.urgencies.NORMAL}</option>
                        <option value="HIGH">{t.ticket.urgencies.HIGH}</option>
                        <option value="CRITICAL">{t.ticket.urgencies.CRITICAL}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.subject} *</label>
                    <input
                      type="text"
                      placeholder={t.forms.placeholders.subject}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.description} *</label>
                    <textarea
                      rows={5}
                      placeholder={t.forms.placeholders.description}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Preferences & Attachments */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4 text-center">
                    {isBg ? "Начин на поддръжка и прикачени файлове" : "Preferences & Attachments"}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.supportMethod}</label>
                      <select
                        value={supportMethod}
                        onChange={(e) => setSupportMethod(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="REMOTE">{isBg ? "Дистанционна помощ (през интернет)" : "Remote assistance (Internet)"}</option>
                        <option value="ON_SITE">{isBg ? "Посещение от техник на адрес в София" : "On-site visit in Sofia"}</option>
                        <option value="OFFICE">{isBg ? "Оставяне на устройството в наш офис" : "Drop-off at office"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.contactMethod}</label>
                      <select
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="EMAIL">{isBg ? "Свържете се с мен по Имейл" : "Contact me via Email"}</option>
                        <option value="PHONE">{isBg ? "Свържете се с мен по Телефон" : "Contact me via Phone"}</option>
                      </select>
                    </div>
                  </div>

                  {supportMethod === "ON_SITE" && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.address} *</label>
                      <input
                        type="text"
                        placeholder={t.forms.placeholders.address}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{isBg ? "Предпочитана дата (незадължително)" : "Preferred Date (optional)"}</label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{isBg ? "Предпочитано време (незадължително)" : "Preferred Time Slot (optional)"}</label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="">{isBg ? "Без значение" : "Any time"}</option>
                        <option value="09:00 - 12:00">09:00 - 12:00</option>
                        <option value="13:00 - 15:00">13:00 - 15:00</option>
                        <option value="15:00 - 18:00">15:00 - 18:00</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload Box */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.attachments}</label>
                    <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded-xl p-6 text-center cursor-pointer relative transition-all">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-attachment"
                      />
                      <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">
                        {isBg 
                          ? "Кликнете или провлачете файлове тук (PNG, JPG, WEBP, PDF, TXT)" 
                          : "Click or drag files here (PNG, JPG, WEBP, PDF, TXT)"}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {isBg ? "Максимален размер: 5MB на файл." : "Max file size: 5MB."}
                      </p>
                    </div>

                    {/* Attached files list */}
                    {attachedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-900 border border-slate-850 p-2 rounded-lg text-xs">
                            <span className="text-slate-300 truncate max-w-[200px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-red-400 hover:text-red-300 font-bold px-2 focus:outline-none"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Privacy Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-2 text-xs text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0 mt-0.5"
                      />
                      <span>{t.forms.privacyConsent}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 5: Summary Review before Submit */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white mb-4 text-center">
                    {isBg ? "Преглед на Вашата заявка" : "Review support request parameters"}
                  </h2>

                  <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-slate-800/50">
                      <div>
                        <span className="text-slate-500 font-semibold uppercase">{isBg ? "Клиент:" : "Client:"}</span>
                        <p className="text-slate-200 mt-1 font-bold">{fullName}</p>
                        <p className="text-slate-400">{email} | {phone}</p>
                      </div>
                      {clientType === "COMPANY" && (
                        <div>
                          <span className="text-slate-500 font-semibold uppercase">{isBg ? "Фирма:" : "Company:"}</span>
                          <p className="text-slate-200 mt-1 font-bold">{companyName}</p>
                          <p className="text-slate-455">ЕИК: {eik}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-slate-800/50">
                      <div>
                        <span className="text-slate-500 font-semibold uppercase">{isBg ? "Категория и Услуга:" : "Category & Service:"}</span>
                        <p className="text-slate-200 mt-1 font-semibold">
                          {category} - {t.services.items[service as keyof typeof t.services.items]?.title}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold uppercase">{isBg ? "Устройство и ОС:" : "Device & OS:"}</span>
                        <p className="text-slate-200 mt-1 font-semibold">{deviceType} ({os})</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-slate-800/50">
                      <div>
                        <span className="text-slate-500 font-semibold uppercase">{isBg ? "Метод на поддръжка:" : "Support Method:"}</span>
                        <p className="text-slate-200 mt-1 font-semibold">
                          {supportMethod === "REMOTE" && (isBg ? "Дистанционна помощ" : "Remote Support")}
                          {supportMethod === "ON_SITE" && (isBg ? "Посещение на място в София" : "On-site Visit Sofia")}
                          {supportMethod === "OFFICE" && (isBg ? "Оставяне в офис" : "Drop-off at Office")}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold uppercase">{isBg ? "Спешност:" : "Urgency:"}</span>
                        <p className="text-slate-200 mt-1 font-semibold">{urgency}</p>
                      </div>
                    </div>

                    {supportMethod === "ON_SITE" && (
                      <div className="py-2 border-b border-slate-800/50">
                        <span className="text-slate-500 font-semibold uppercase">{isBg ? "Адрес:" : "Address:"}</span>
                        <p className="text-slate-200 mt-1">{address}</p>
                      </div>
                    )}

                    <div className="py-2">
                      <span className="text-slate-500 font-semibold uppercase">{isBg ? "Тема и Описание:" : "Subject & Description:"}</span>
                      <p className="text-slate-200 font-bold mt-1 mb-2">{subject}</p>
                      <p className="text-slate-400 leading-relaxed whitespace-pre-line bg-slate-950/20 p-3 rounded-lg border border-slate-850">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline error alerts */}
              {errorMsg && (
                <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/5 p-3 rounded border border-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-800/80">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-white transition-colors focus:outline-none"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{isBg ? "Назад" : "Back"}</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-md shadow-blue-500/5 transition-all"
                  >
                    <span>{isBg ? "Напред" : "Next"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg text-xs font-bold flex items-center space-x-2 shadow-md shadow-blue-500/15 transition-all disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{submitting ? t.forms.submitting : (isBg ? "Потвърди и Изпрати" : "Confirm & Submit")}</span>
                  </button>
                )}
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
