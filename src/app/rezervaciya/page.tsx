"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function BookingPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  // Wizard state
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [serviceType, setServiceType] = useState<"CONSULTATION" | "REMOTE" | "ON_SITE" | "DROP_OFF">("REMOTE");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Calendar dates generation
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

  const generateCalendarDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = (firstDay.getDay() + 6) % 7; // Align to Monday (0 = Mon, 6 = Sun)

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    const days: Date[] = [];
    
    // Add empty pad blocks for previous month alignment
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(new Date(year, month, -firstDayIndex + i + 1));
    }

    // Add actual month days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    requestAnimationFrame(() => setDaysInMonth(days));
  }, [currentMonth]);

  useEffect(() => {
    generateCalendarDays();
  }, [generateCalendarDays]);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedSlot("");
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prev >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
      setCurrentMonth(prev);
      setSelectedDate(null);
      setSelectedSlot("");
    }
  };

  const slots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00"
  ];

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPast = date < today;
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

    if (!isWeekend && !isPast && isCurrentMonth) {
      setSelectedDate(date);
      setSelectedSlot("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setErrorMsg(isBg ? "Моля изберете дата и час от календара." : "Please select date and slot.");
      return;
    }
    if (serviceType === "ON_SITE" && !address) {
      setErrorMsg(isBg ? "Моля попълнете адрес за посещение на място." : "Address is required for on-site visits.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const body = {
        serviceType,
        date: selectedDate.toISOString().split("T")[0],
        timeSlot: selectedSlot,
        locationType: serviceType === "ON_SITE" ? "ON_SITE" : serviceType === "REMOTE" ? "REMOTE" : "OFFICE",
        address: serviceType === "ON_SITE" ? address : undefined,
        notes,
      };

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to book appointment");
      }

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : (isBg ? "Възникна грешка при запазване." : "Booking failed.");
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const monthNames = isBg 
    ? ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);

  return (
    <div className="bg-[#07111F] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                {t.nav.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-350">{t.nav.booking}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.booking.title}
          </h1>
          <p className="text-sm text-slate-400">
            {t.booking.subtitle}
          </p>
        </div>

        {/* Form panel container */}
        <div className="bg-[#12263F] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          
          {success ? (
            /* Success state screen */
            <div className="text-center space-y-6 max-w-md mx-auto py-12">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {t.booking.successTitle}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.booking.successText}
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <Link
                  href="/portal"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-xs font-bold transition-all shadow border border-transparent"
                >
                  {isBg ? "Моят Портал" : "My Portal"}
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setSelectedDate(null);
                    setSelectedSlot("");
                    setNotes("");
                    setAddress("");
                  }}
                  className="bg-slate-900 border border-slate-750 text-slate-300 px-6 py-3 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  {isBg ? "Запази друг час" : "Book another slot"}
                </button>
              </div>
            </div>
          ) : (
            /* Booking forms */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left side: details inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">{t.booking.type}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: "REMOTE", label: t.booking.slots.remote },
                        { key: "ON_SITE", label: t.booking.slots.onsite },
                        { key: "DROP_OFF", label: t.booking.slots.dropoff },
                        { key: "CONSULTATION", label: t.booking.slots.consultation },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setServiceType(item.key as "CONSULTATION" | "REMOTE" | "ON_SITE" | "DROP_OFF");
                            setErrorMsg("");
                          }}
                          className={`p-4 rounded-xl text-left border text-xs font-bold transition-all ${
                            serviceType === item.key
                              ? "bg-blue-600/10 border-blue-500 text-cyan-400"
                              : "bg-slate-900 border-slate-850 text-slate-300 hover:border-slate-800"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {serviceType === "ON_SITE" && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.address} *</label>
                      <input
                        type="text"
                        required
                        placeholder={t.forms.placeholders.address}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.booking.notes}</label>
                    <textarea
                      rows={4}
                      placeholder={t.booking.notesPlaceholder}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Right side: Calendar & Slots */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                        <CalendarIcon className="h-4 w-4 text-cyan-400" />
                        <span>
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                      </h3>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="p-1 px-2.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="p-1 px-2.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    {/* Calendar grid headers */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase mb-2">
                      <span>{isBg ? "Пн" : "Mo"}</span>
                      <span>{isBg ? "Вт" : "Tu"}</span>
                      <span>{isBg ? "Ср" : "We"}</span>
                      <span>{isBg ? "Чт" : "Th"}</span>
                      <span>{isBg ? "Пт" : "Fr"}</span>
                      <span className="text-red-500/60">{isBg ? "Сб" : "Sa"}</span>
                      <span className="text-red-500/60">{isBg ? "Нд" : "Su"}</span>
                    </div>

                    {/* Calendar grid days */}
                    <div className="grid grid-cols-7 gap-1">
                      {daysInMonth.map((day, idx) => {
                        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        const isPast = day < todayDate;
                        
                        const isSelected = selectedDate?.toDateString() === day.toDateString();

                        let className = "aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all focus:outline-none ";
                        
                        if (!isCurrentMonth) {
                          className += "text-slate-700 pointer-events-none";
                        } else if (isWeekend || isPast) {
                          className += "text-slate-600 bg-slate-950/20 cursor-not-allowed opacity-50";
                        } else if (isSelected) {
                          className += "bg-blue-600 text-white shadow shadow-blue-500/20 scale-[1.05]";
                        } else {
                          className += "bg-slate-900 hover:bg-slate-800 border border-slate-850/65 text-slate-300 cursor-pointer";
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!isCurrentMonth || isWeekend || isPast}
                            onClick={() => handleDateClick(day)}
                            className={className}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hourly slots */}
                  {selectedDate && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
                        <Clock className="h-4 w-4 text-cyan-400" />
                        <span>
                          {t.booking.timeSlots} {selectedDate.toLocaleDateString(isBg ? "bg-BG" : "en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => {
                          const isSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition-all ${
                                isSelected
                                  ? "bg-blue-600 border-blue-500 text-white"
                                  : "bg-slate-900 border-slate-850 text-slate-300 hover:border-slate-750"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Error messages */}
              {errorMsg && (
                <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/5 p-3 rounded border border-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit footer */}
              <div className="pt-6 border-t border-slate-800/80 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !selectedDate || !selectedSlot}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{submitting ? t.forms.submitting : (isBg ? "Потвърди резервация" : "Confirm Booking")}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
