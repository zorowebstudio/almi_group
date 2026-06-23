"use server";

import { prisma } from "@/lib/db";
import { getUserSession, setUserSession, hashPassword } from "@/lib/auth";
import { deviceSchema } from "@/lib/validation";
import { sendNotification, notifyAdmin } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

// Device Actions
export async function createDevice(formData: {
  nickname: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  os?: string;
  notes?: string;
  isNetworkAsset?: boolean;
}) {
  const session = await getUserSession();
  if (!session) {
    return { success: false, error: "Неуспешно удостоверяване / Unauthorized" };
  }

  const result = deviceSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.device.create({
      data: {
        nickname: result.data.nickname,
        type: result.data.type,
        brand: result.data.brand || null,
        model: result.data.model || null,
        serialNumber: result.data.serialNumber || null,
        os: result.data.os || null,
        notes: result.data.notes || null,
        isNetworkAsset: !!result.data.isNetworkAsset,
        userId: session.id,
        companyId: session.companyId || null,
      },
    });

    revalidatePath("/portal/ustroystva");
    return { success: true };
  } catch (error) {
    console.error("Error creating device:", error);
    return { success: false, error: "Грешка при запис в базата данни." };
  }
}

export async function deleteDevice(deviceId: string) {
  const session = await getUserSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return { success: false, error: "Устройството не е намерено." };
    }

    // Verify ownership
    if (session.role === "CUSTOMER_COMPANY" && session.companyId) {
      if (device.companyId !== session.companyId) {
        return { success: false, error: "Нямате права за това устройство." };
      }
    } else {
      if (device.userId !== session.id) {
        return { success: false, error: "Нямате права за това устройство." };
      }
    }

    await prisma.device.delete({
      where: { id: deviceId },
    });

    revalidatePath("/portal/ustroystva");
    return { success: true };
  } catch (error) {
    console.error("Error deleting device:", error);
    return { success: false, error: "Грешка при изтриване на устройството." };
  }
}

// Quote Actions
export async function acceptQuote(quoteId: string) {
  const session = await getUserSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { ticket: true },
    });

    if (!quote) return { success: false, error: "Офертата не е намерена." };

    // Verify access
    if (session.companyId) {
      if (quote.companyId !== session.companyId) return { success: false, error: "Нямате достъп до тази оферта." };
    } else {
      if (quote.customerId !== session.id) return { success: false, error: "Нямате достъп до тази оферта." };
    }

    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: "ACCEPTED" },
    });

    if (quote.ticketId && quote.ticket) {
      await prisma.ticketStatusHistory.create({
        data: {
          ticketId: quote.ticketId,
          oldStatus: quote.ticket.status,
          newStatus: "IN_PROGRESS",
          changedById: session.id,
          notes: `Клиентът одобри оферта ${quote.quoteNumber}. Статусът на заявката е актуализиран.`,
        },
      });

      await prisma.ticket.update({
        where: { id: quote.ticketId },
        data: { status: "IN_PROGRESS" },
      });
    }

    await notifyAdmin(
      `Одобрена оферта ${quote.quoteNumber}`,
      `Клиентът ${session.name} одобри оферта ${quote.quoteNumber} на стойност ${quote.totalAmount || "по договаряне"} лв.`
    );

    revalidatePath("/portal/oferti");
    revalidatePath("/portal/zayavki");
    if (quote.ticketId) revalidatePath(`/portal/zayavki/${quote.ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error accepting quote:", error);
    return { success: false, error: "Възникна системна грешка." };
  }
}

export async function declineQuote(quoteId: string) {
  const session = await getUserSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!quote) return { success: false, error: "Офертата не е намерена." };

    if (session.companyId) {
      if (quote.companyId !== session.companyId) return { success: false, error: "Нямате достъп." };
    } else {
      if (quote.customerId !== session.id) return { success: false, error: "Нямате достъп." };
    }

    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: "DECLINED" },
    });

    await notifyAdmin(
      `Отхвърлена оферта ${quote.quoteNumber}`,
      `Клиентът ${session.name} отказа оферта ${quote.quoteNumber}.`
    );

    revalidatePath("/portal/oferti");
    return { success: true };
  } catch (error) {
    console.error("Error declining quote:", error);
    return { success: false, error: "Възникна системна грешка." };
  }
}

// Ticket Message Action
export async function sendTicketMessage(ticketId: string, messageText: string) {
  const session = await getUserSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (!messageText || messageText.trim() === "") {
    return { success: false, error: "Съобщението не може да бъде празно." };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) return { success: false, error: "Заявката не е намерена." };

    // Verify ownership
    if (session.companyId) {
      if (ticket.companyId !== session.companyId) return { success: false, error: "Нямате достъп." };
    } else {
      if (ticket.customerId !== session.id) return { success: false, error: "Нямате достъп." };
    }

    // Create message
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: session.id,
        senderName: session.name,
        message: messageText,
        isInternal: false,
      },
    });

    // Notify technician/admin
    if (ticket.assignedTechnicianId) {
      await sendNotification({
        userId: ticket.assignedTechnicianId,
        title: `Ново съобщение по заявка ${ticket.ticketNumber}`,
        message: `${session.name}: ${messageText.substring(0, 60)}...`,
        type: "MESSAGES",
      });
    } else {
      await notifyAdmin(
        `Ново съобщение по заявка ${ticket.ticketNumber}`,
        `Клиентът ${session.name} изпрати съобщение по заявка ${ticket.ticketNumber}:\n\n${messageText}`
      );
    }

    revalidatePath(`/portal/zayavki/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending ticket message:", error);
    return { success: false, error: "Грешка при изпращане." };
  }
}

// Company Management Actions (for B2B)
export async function addCompanyMember(email: string) {
  const session = await getUserSession();
  if (!session || session.role !== "CUSTOMER_COMPANY" || !session.companyId) {
    return { success: false, error: "Нямате права за това действие." };
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Невалиден имейл адрес." };
  }

  try {
    // 1. Look for existing user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a skeleton user
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          passwordHash: hashPassword("AlmiTemporary123!"), // Will require reset/change
          role: "CUSTOMER_COMPANY",
        },
      });
    }

    // 2. Add membership
    const existingMembership = await prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId: user.id,
          companyId: session.companyId,
        },
      },
    });

    if (existingMembership) {
      return { success: false, error: "Потребителят вече е член на фирмата." };
    }

    await prisma.companyMember.create({
      data: {
        userId: user.id,
        companyId: session.companyId,
        role: "MEMBER",
      },
    });

    // Set role to customer company if they were private client
    if (user.role === "CUSTOMER_PRIVATE") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "CUSTOMER_COMPANY" },
      });
    }

    await sendNotification({
      userId: user.id,
      title: "Добавен служител във фирма",
      message: `Бяхте добавен/а като служител в компанията ${session.name} в портала на Алми Груп ООД.`,
      type: "SYSTEM",
      emailTo: email,
    });

    revalidatePath("/portal/firma");
    return { success: true };
  } catch (error) {
    console.error("Error adding member:", error);
    return { success: false, error: "Системна грешка при добавяне." };
  }
}

export async function removeCompanyMember(memberId: string) {
  const session = await getUserSession();
  if (!session || session.role !== "CUSTOMER_COMPANY" || !session.companyId) {
    return { success: false, error: "Нямате права." };
  }

  try {
    const membership = await prisma.companyMember.findUnique({
      where: { id: memberId },
    });

    if (!membership || membership.companyId !== session.companyId) {
      return { success: false, error: "Членството не е намерено." };
    }

    // Do not delete company owner
    if (membership.role === "OWNER") {
      return { success: false, error: "Не можете да премахнете собственика на фирмата." };
    }

    await prisma.companyMember.delete({
      where: { id: memberId },
    });

    revalidatePath("/portal/firma");
    return { success: true };
  } catch (error) {
    console.error("Error removing member:", error);
    return { success: false, error: "Грешка при премахване." };
  }
}

export async function updateCompanyDetails(formData: {
  name: string;
  eik?: string;
  billingInfo?: string;
}) {
  const session = await getUserSession();
  if (!session || session.role !== "CUSTOMER_COMPANY" || !session.companyId) {
    return { success: false, error: "Нямате права." };
  }

  try {
    await prisma.company.update({
      where: { id: session.companyId },
      data: {
        name: formData.name,
        eik: formData.eik || null,
        billingInfo: formData.billingInfo || null,
      },
    });

    revalidatePath("/portal/firma");
    return { success: true };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, error: "Грешка при обновяване." };
  }
}

// User Profile Actions
export async function updateProfile(formData: {
  name: string;
  phone?: string;
  languagePreference: string;
  password?: string;
}) {
  const session = await getUserSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const updateData: { name: string; phone: string | null; languagePreference: string; passwordHash?: string } = {
      name: formData.name,
      phone: formData.phone || null,
      languagePreference: formData.languagePreference,
    };

    if (formData.password && formData.password.trim().length >= 6) {
      updateData.passwordHash = hashPassword(formData.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
    });

    // Refresh user session cookie
    await setUserSession({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role as "CUSTOMER_PRIVATE" | "CUSTOMER_COMPANY" | "TECHNICIAN" | "ADMIN",
      companyId: session.companyId,
      languagePreference: updatedUser.languagePreference,
    });

    revalidatePath("/portal/profil");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Грешка при актуализиране на профила." };
  }
}

// Live Chat Actions
export async function createChatConversation(subject?: string) {
  const session = await getUserSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const conversation = await prisma.chatConversation.create({
      data: {
        userId: session.id,
        subject: subject || "Бързо съдействие от портала",
        status: "ACTIVE",
      },
    });

    // System welcome message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderName: "Асистент Алми",
        message: "Здравейте! Как можем да Ви помогнем днес? Наш техник ще се свърже с Вас след малко.",
      },
    });

    revalidatePath("/portal/chat");
    return { success: true, conversationId: conversation.id };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { success: false, error: "Грешка при отваряне на чат." };
  }
}

export async function sendChatMessage(conversationId: string, messageText: string) {
  const session = await getUserSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (!messageText || messageText.trim() === "") {
    return { success: false, error: "Празно съобщение." };
  }

  try {
    const convo = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
    });

    if (!convo || convo.userId !== session.id) {
      return { success: false, error: "Разговорът не съществува или нямате достъп." };
    }

    await prisma.chatMessage.create({
      data: {
        conversationId,
        senderId: session.id,
        senderName: session.name,
        message: messageText,
      },
    });

    // Auto-respond mock for demo client if no technician is assigned yet
    if (!convo.assignedToId) {
      setTimeout(async () => {
        try {
          await prisma.chatMessage.create({
            data: {
              conversationId,
              senderName: "Поддръжка Алми (Бот)",
              message: "Благодарим за съобщението! Вашето съобщение е получено в диспечерската система. Наш дежурен техник го разглежда в момента.",
            },
          });
        } catch (err) {
          console.error("Mock auto-respond error:", err);
        }
      }, 2000);
    }

    revalidatePath("/portal/chat");
    return { success: true };
  } catch (error) {
    console.error("Error sending chat msg:", error);
    return { success: false, error: "Възникна системна грешка." };
  }
}

// Technician and Admin Support Operations
export async function claimTicket(ticketId: string) {
  const session = await getUserSession();
  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    return { success: false, error: "Нямате права за това действие." };
  }

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Заявката не е намерена." };

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedTechnicianId: session.id,
        status: "DIAGNOSING"
      }
    });

    await prisma.ticketStatusHistory.create({
      data: {
        ticketId,
        oldStatus: ticket.status,
        newStatus: "DIAGNOSING",
        changedById: session.id,
        notes: `Служителят ${session.name} пое заявката и започна диагностика.`
      }
    });

    revalidatePath("/portal/tehnik/zayavki");
    revalidatePath(`/portal/tehnik/zayavki/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error claiming ticket:", error);
    return { success: false, error: "Възникна системна грешка." };
  }
}

export async function updateTicketStatus(ticketId: string, newStatus: string, notes?: string) {
  const session = await getUserSession();
  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    return { success: false, error: "Нямате права." };
  }

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Заявката не е намерена." };

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus }
    });

    await prisma.ticketStatusHistory.create({
      data: {
        ticketId,
        oldStatus: ticket.status,
        newStatus,
        changedById: session.id,
        notes: notes || `Промяна на статус от техник: ${newStatus}.`
      }
    });

    // Notify customer
    if (ticket.customerId) {
      await sendNotification({
        userId: ticket.customerId,
        title: `Промяна в статус по заявка ${ticket.ticketNumber}`,
        message: `Вашата заявка премина в статус: ${newStatus}.${notes ? ` Бележка: ${notes}` : ""}`,
        type: "TICKETS",
        emailTo: ticket.email
      });
    }

    revalidatePath("/portal/tehnik/zayavki");
    revalidatePath(`/portal/tehnik/zayavki/${ticketId}`);
    revalidatePath(`/portal/zayavki/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, error: "Грешка при актуализиране на статуса." };
  }
}

export async function updateTicketPriority(ticketId: string, newPriority: string) {
  const session = await getUserSession();
  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    return { success: false, error: "Нямате права." };
  }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { urgency: newPriority }
    });

    revalidatePath(`/portal/tehnik/zayavki/${ticketId}`);
    revalidatePath(`/portal/zayavki/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket priority:", error);
    return { success: false, error: "Грешка при промяна на приоритета." };
  }
}

export async function addInternalNote(ticketId: string, notes: string) {
  const session = await getUserSession();
  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    return { success: false, error: "Нямате права." };
  }

  if (!notes || notes.trim() === "") {
    return { success: false, error: "Бележката не може да е празна." };
  }

  try {
    await prisma.internalNote.create({
      data: {
        ticketId,
        changedById: session.id,
        notes
      }
    });

    revalidatePath(`/portal/tehnik/zayavki/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding internal note:", error);
    return { success: false, error: "Грешка при добавяне." };
  }
}

export async function generateServiceProtocol(ticketId: string, summaryText: string) {
  const session = await getUserSession();
  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    return { success: false, error: "Нямате права." };
  }

  if (!summaryText || summaryText.trim() === "") {
    return { success: false, error: "Попълнете отчетен протокол." };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) return { success: false, error: "Заявката не е намерена." };

    const docNo = Math.floor(100000 + Math.random() * 900000);
    const docTitle = `Приемо-предавателен протокол № ${docNo} за заявка ${ticket.ticketNumber}`;

    await prisma.document.create({
      data: {
        title: docTitle,
        category: "SERVICE_PROTOCOL",
        fileUrl: `/documents/protocol-${docNo}.pdf`,
        userId: ticket.customerId || null,
        companyId: ticket.companyId || null,
        uploadedBy: session.name
      }
    });

    // Write to timeline
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId,
        oldStatus: ticket.status,
        newStatus: "READY",
        changedById: session.id,
        notes: `Изготвен е сервизен протокол. Работата по казуса приключи.`
      }
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "READY" }
    });

    // Notify customer
    if (ticket.customerId) {
      await sendNotification({
        userId: ticket.customerId,
        title: `Изготвен сервизен протокол за ${ticket.ticketNumber}`,
        message: `Нашият екип приключи работа и генерира сервизен протокол за Вашата заявка. Можете да го свалите от секция "Документи".`,
        type: "DOCUMENTS",
        emailTo: ticket.email
      });
    }

    revalidatePath(`/portal/tehnik/zayavki/${ticketId}`);
    revalidatePath(`/portal/zayavki/${ticketId}`);
    revalidatePath("/portal/dokumenti");
    return { success: true };
  } catch (error) {
    console.error("Error creating protocol:", error);
    return { success: false, error: "Системна грешка при издаване на протокол." };
  }
}

export async function sendTechnicianMessage(ticketId: string, messageText: string) {
  const session = await getUserSession();
  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  if (!messageText || messageText.trim() === "") {
    return { success: false, error: "Празно съобщение." };
  }

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Заявката не е намерена." };

    await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: session.id,
        senderName: `Администратор ${session.name}`,
        message: messageText,
        isInternal: false
      }
    });

    // Notify customer
    if (ticket.customerId) {
      await sendNotification({
        userId: ticket.customerId,
        title: `Ново съобщение по Ваша заявка ${ticket.ticketNumber}`,
        message: `Техник ${session.name} Ви отговори: ${messageText.substring(0, 60)}...`,
        type: "MESSAGES",
        emailTo: ticket.email
      });
    }

    revalidatePath(`/portal/tehnik/zayavki/${ticketId}`);
    revalidatePath(`/portal/zayavki/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending tech message:", error);
    return { success: false, error: "Грешка при изпращане." };
  }
}

export async function assignTechnician(ticketId: string, technicianId: string) {
  const session = await getUserSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Само администратори могат да назначават техници." };
  }

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Заявката не е намерена." };

    const tech = await prisma.user.findUnique({ where: { id: technicianId } });
    if (!tech) return { success: false, error: "Техникът не е намерен." };

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedTechnicianId: technicianId,
        status: ticket.status === "RECEIVED" ? "DIAGNOSING" : ticket.status
      }
    });

    await prisma.ticketStatusHistory.create({
      data: {
        ticketId,
        oldStatus: ticket.status,
        newStatus: ticket.status === "RECEIVED" ? "DIAGNOSING" : ticket.status,
        changedById: session.id,
        notes: `Администратор ${session.name} назначи техник: ${tech.name}.`
      }
    });

    await sendNotification({
      userId: technicianId,
      title: `Нова разпределена заявка ${ticket.ticketNumber}`,
      message: `Бяхте назначен/а по заявка ${ticket.ticketNumber}: ${ticket.subject}`,
      type: "TICKETS"
    });

    revalidatePath("/admin/zayavki");
    revalidatePath(`/admin/zayavki/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Error assigning tech:", error);
    return { success: false, error: "Възникна системна грешка." };
  }
}

export async function createQuote(formData: {
  ticketId: string;
  expiryDays: number;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }[];
}) {
  const session = await getUserSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Само администратори могат да създават оферти." };
  }

  const { ticketId, expiryDays, notes, items } = formData;

  if (items.length === 0) {
    return { success: false, error: "Офертата трябва да съдържа поне един ред." };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) return { success: false, error: "Заявката не е намерена." };

    const qNo = Math.floor(1000 + Math.random() * 9000);
    const quoteNumber = `ALMI-Q-2026-${qNo}`;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    let totalAmount = 0;
    const quoteItemsData = items.map(item => {
      const lineTotal = item.quantity * item.unitPrice;
      totalAmount += lineTotal;
      return {
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        lineTotal
      };
    });

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        ticketId,
        customerId: ticket.customerId || null,
        companyId: ticket.companyId || null,
        status: "SENT",
        expiryDate,
        notes: notes || null,
        totalAmount,
        items: {
          create: quoteItemsData
        }
      }
    });

    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "AWAITING_CONFIRMATION" }
    });

    await prisma.ticketStatusHistory.create({
      data: {
        ticketId,
        oldStatus: ticket.status,
        newStatus: "AWAITING_CONFIRMATION",
        changedById: session.id,
        notes: `Изготвена ценова оферта ${quoteNumber} на стойност ${totalAmount.toFixed(2)} лв.`
      }
    });

    // Notify client
    if (ticket.customerId) {
      await sendNotification({
        userId: ticket.customerId,
        title: `Изготвена оферта по заявка ${ticket.ticketNumber}`,
        message: `Нашите техници изготвиха оферта ${quoteNumber} за Вашия казус на стойност ${totalAmount.toFixed(2)} лв. Моля, прегледайте я и потвърдете.`,
        type: "TICKETS",
        emailTo: ticket.email
      });
    }

    revalidatePath("/admin/oferti");
    revalidatePath("/admin/zayavki");
    revalidatePath(`/admin/zayavki/${ticketId}`);
    revalidatePath(`/portal/zayavki/${ticketId}`);
    revalidatePath("/portal/oferti");
    return { success: true };
  } catch (error) {
    console.error("Error creating quote:", error);
    return { success: false, error: "Грешка при запис на офертата." };
  }
}

export async function createFAQ(formData: {
  category: string;
  questionBg: string;
  questionEn: string;
  answerBg: string;
  answerEn: string;
}) {
  const session = await getUserSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.fAQItem.create({
      data: {
        category: formData.category,
        questionBg: formData.questionBg,
        questionEn: formData.questionEn,
        answerBg: formData.answerBg,
        answerEn: formData.answerEn,
        isPublished: true
      }
    });

    revalidatePath("/admin/sadarzhanie");
    revalidatePath("/faq");
    return { success: true };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: "Грешка при запис на FAQ." };
  }
}

export async function createKnowledgeArticle(formData: {
  category: string;
  slug: string;
  titleBg: string;
  titleEn: string;
  contentBg: string;
  contentEn: string;
}) {
  const session = await getUserSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.knowledgeArticle.create({
      data: {
        category: formData.category,
        slug: formData.slug,
        titleBg: formData.titleBg,
        titleEn: formData.titleEn,
        contentBg: formData.contentBg,
        contentEn: formData.contentEn,
        isPublished: true,
        readingTime: Math.ceil(formData.contentBg.split(" ").length / 150) || 5
      }
    });

    revalidatePath("/admin/sadarzhanie");
    revalidatePath("/help");
    return { success: true };
  } catch (error) {
    console.error("Error creating Article:", error);
    return { success: false, error: "Грешка при запис на статия." };
  }
}

export async function saveSettings(settings: { key: string; value: string }[]) {
  const session = await getUserSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const item of settings) {
      await prisma.siteSetting.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: {
          key: item.key,
          value: item.value,
          description: `Системна настройка за ${item.key}`
        }
      });
    }

    revalidatePath("/admin/nastroyki");
    return { success: true };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, error: "Грешка при запис на настройките." };
  }
}
