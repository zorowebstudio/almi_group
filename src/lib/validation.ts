import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Невалиден имейл адрес / Invalid email" }),
  password: z.string().min(6, { message: "Паролата трябва да е поне 6 символа / Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Името трябва да е поне 2 символа / Name must be at least 2 characters" }),
  email: z.string().email({ message: "Невалиден имейл адрес / Invalid email" }),
  phone: z.string().regex(/^[+0-9\s-]{7,15}$/, { message: "Невалиден телефонен номер / Invalid phone" }),
  password: z.string().min(6, { message: "Паролата трябва да е поне 6 символа / Password must be at least 6 characters" }),
  role: z.enum(["CUSTOMER_PRIVATE", "CUSTOMER_COMPANY"]),
  companyName: z.string().optional(),
  eik: z.string().optional(),
});

export const ticketSchema = z.object({
  name: z.string().min(2, { message: "Името е твърде късо / Name is too short" }),
  email: z.string().email({ message: "Невалиден имейл / Invalid email" }),
  phone: z.string().regex(/^[+0-9\s-]{7,15}$/, { message: "Невалиден телефон / Invalid phone" }),
  clientType: z.enum(["PRIVATE", "COMPANY"]),
  companyName: z.string().optional(),
  category: z.enum(["HARDWARE", "SOFTWARE", "NETWORK", "SECURITY", "OTHER"]),
  service: z.string().min(1, { message: "Изберете услуга / Select a service" }),
  deviceType: z.string().optional(),
  deviceRef: z.string().optional(),
  os: z.string().optional(),
  subject: z.string().min(5, { message: "Темата трябва да е поне 5 символа / Subject must be at least 5 chars" }),
  description: z.string().min(15, { message: "Описанието трябва да е поне 15 символа / Description must be at least 15 chars" }),
  urgency: z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]),
  contactMethod: z.enum(["EMAIL", "PHONE"]),
  supportMethod: z.enum(["REMOTE", "ON_SITE", "OFFICE"]),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Трябва да се съгласите с условията / Privacy consent is required",
  }),
});

export const messageSchema = z.object({
  message: z.string().min(1, { message: "Съобщението не може да е празно / Message cannot be empty" }),
  isInternal: z.boolean().default(false),
});

export const bookingSchema = z.object({
  serviceType: z.enum(["CONSULTATION", "REMOTE", "ON_SITE", "DROP_OFF"]),
  date: z.string().min(1, { message: "Изберете дата / Select a date" }),
  timeSlot: z.string().min(1, { message: "Изберете час / Select a slot" }),
  notes: z.string().optional(),
  address: z.string().optional(),
  locationType: z.enum(["REMOTE", "ON_SITE", "OFFICE"]),
});

export const deviceSchema = z.object({
  nickname: z.string().min(2, { message: "Наименованието е задължително / Nickname is required" }),
  type: z.string().min(1, { message: "Изберете тип устройство / Select device type" }),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  os: z.string().optional(),
  notes: z.string().optional(),
  isNetworkAsset: z.boolean().default(false),
});
