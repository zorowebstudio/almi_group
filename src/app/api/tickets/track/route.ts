import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Helper to mask email
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***";
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

// Helper to mask phone
function maskPhone(phone: string): string {
  if (phone.length <= 5) return "****";
  return `${phone.slice(0, 4)}${"*".repeat(phone.length - 7)}${phone.slice(-3)}`;
}

// Helper to mask name
function maskName(name: string): string {
  const parts = name.split(" ");
  return parts.map(part => {
    if (part.length <= 2) return part;
    return `${part[0]}${"*".repeat(part.length - 2)}${part[part.length - 1]}`;
  }).join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const { ticketNumber, email } = await req.json();

    if (!ticketNumber || !email) {
      return NextResponse.json(
        { error: "Моля въведете номер на заявка и имейл / Missing fields" },
        { status: 400 }
      );
    }

    // Query ticket
    const ticket = await prisma.ticket.findUnique({
      where: { ticketNumber: ticketNumber.trim() },
      include: {
        timeline: {
          orderBy: { createdAt: "desc" },
        },
        messages: {
          where: { isInternal: false }, // Only public client-visible messages
          orderBy: { createdAt: "asc" },
        },
        appointments: {
          where: { status: { not: "CANCELLED" } },
          orderBy: { date: "asc" },
        },
      },
    });

    // Verification check (case insensitive email matching)
    if (!ticket || ticket.email.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { error: "Не съвпадат номер на заявка и имейл / Invalid ticket details" },
        { status: 404 }
      );
    }

    // Prepare masked data to preserve client privacy
    const maskedTicket = {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      name: maskName(ticket.name),
      email: maskEmail(ticket.email),
      phone: maskPhone(ticket.phone),
      clientType: ticket.clientType,
      category: ticket.category,
      service: ticket.service,
      deviceType: ticket.deviceType,
      os: ticket.os,
      subject: ticket.subject,
      description: ticket.description,
      urgency: ticket.urgency,
      supportMethod: ticket.supportMethod,
      address: ticket.address ? maskName(ticket.address) : null,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      timeline: ticket.timeline.map((h) => ({
        id: h.id,
        oldStatus: h.oldStatus,
        newStatus: h.newStatus,
        notes: h.notes,
        createdAt: h.createdAt,
      })),
      messages: ticket.messages.map((m) => ({
        id: m.id,
        senderName: m.senderId ? "Алми Груп (Техник)" : "Вие (Клиент)",
        message: m.message,
        createdAt: m.createdAt,
      })),
      appointments: ticket.appointments.map((a) => ({
        id: a.id,
        serviceType: a.serviceType,
        date: a.date,
        timeSlot: a.timeSlot,
        locationType: a.locationType,
        status: a.status,
      })),
    };

    return NextResponse.json({
      success: true,
      ticket: maskedTicket,
    });
  } catch (error) {
    console.error("Track Ticket API Error:", error);
    return NextResponse.json(
      { error: "Възникна системна грешка / System error" },
      { status: 500 }
    );
  }
}
