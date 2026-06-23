import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/auth";
import { ticketSchema } from "@/lib/validation";
import { sendNotification, notifyAdmin } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate incoming data
    const result = ticketSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;
    
    // Check if user is logged in
    const session = await getUserSession();
    const customerId = session?.id || null;
    const companyId = session?.companyId || null;

    // Generate unique ticket number: ALMI-2026-XXXX
    const count = await prisma.ticket.count();
    const year = new Date().getFullYear();
    const ticketNumber = `ALMI-${year}-${String(count + 1).padStart(4, "0")}`;

    // Create the ticket inside database transaction
    const newTicket = await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          ticketNumber,
          customerId,
          companyId,
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.phone,
          clientType: data.clientType,
          category: data.category,
          service: data.service,
          deviceType: data.deviceType || null,
          deviceRef: data.deviceRef || null,
          os: data.os || null,
          subject: data.subject,
          description: data.description,
          urgency: data.urgency,
          priority: "NORMAL", // default
          contactMethod: data.contactMethod,
          supportMethod: data.supportMethod,
          preferredDate: data.preferredDate || null,
          preferredTime: data.preferredTime || null,
          address: data.address || null,
          status: "RECEIVED",
        },
      });

      // Log status history timeline
      await tx.ticketStatusHistory.create({
        data: {
          ticketId: ticket.id,
          oldStatus: "",
          newStatus: "RECEIVED",
          notes: "Заявката е получена автоматично през уебсайта / Request received online",
        },
      });

      return ticket;
    });

    // Send customer notification
    const emailSubject = `[Алми Груп] Нова заявка ${ticketNumber}`;
    const emailMessage = `Здравейте, ${data.name}!
Вашата заявка за техническа поддръжка е приета успешно.

Номер на заявката: ${ticketNumber}
Тема: ${data.subject}
Статус: Получена (RECEIVED)

Можете да проследите статуса на Вашата заявка по всяко време на следния линк:
${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/proveri-zayavka

Благодарим Ви, че избрахте Алми Груп ООД!`;

    if (customerId) {
      await sendNotification({
        userId: customerId,
        title: emailSubject,
        message: emailMessage,
        type: "TICKETS",
        emailTo: data.email,
      });
    } else {
      // For guest users, simulate email directly
      console.log(`[Guest Email Sent] To: ${data.email}, Subject: ${emailSubject}`);
    }

    // Notify administrators
    await notifyAdmin(
      `Нова заявка ${ticketNumber}`,
      `Подател: ${data.name} (${data.email})
Категория: ${data.category}
Тема: ${data.subject}
Описание: ${data.description}`
    );

    return NextResponse.json({
      success: true,
      ticketNumber,
    });
  } catch (error) {
    console.error("Create Ticket API Error:", error);
    return NextResponse.json(
      { error: "Възникна грешка при изпращането / Error creating ticket" },
      { status: 500 }
    );
  }
}
