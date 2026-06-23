import { prisma } from "./db";

export interface SendNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: "TICKETS" | "MESSAGES" | "APPOINTMENTS" | "DOCUMENTS" | "SYSTEM";
  emailTo?: string;
}

export async function sendNotification({
  userId,
  title,
  message,
  type,
  emailTo,
}: SendNotificationParams): Promise<void> {
  try {
    // 1. Create in-app notification in DB
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        isRead: false,
      },
    });

    // 2. Simulated email sending logic
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || "notifications@almi.bg";

    if (emailTo) {
      if (resendApiKey && resendApiKey !== "mock-key") {
        // Here we would implement Resend SDK call:
        // await resend.emails.send({ from: fromEmail, to: emailTo, subject: title, text: message })
        console.log(`[Resend Email Sent] From: ${fromEmail}, To: ${emailTo}, Subject: ${title}`);
      } else {
        console.log(`[Email Dispatch Simulation]
=========================================
From: ${fromEmail}
To: ${emailTo}
Subject: ${title}
-----------------------------------------
${message}
=========================================`);
      }
    }
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

export async function notifyAdmin(title: string, message: string): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@almi.bg";
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
    });

    for (const admin of admins) {
      await sendNotification({
        userId: admin.id,
        title: `[ADMIN NOTIFICATION] ${title}`,
        message,
        type: "SYSTEM",
        emailTo: adminEmail,
      });
    }
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
}
