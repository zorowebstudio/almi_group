import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { ticketId, email, message } = await req.json();

    if (!ticketId || !email || !message) {
      return NextResponse.json(
        { error: "Невалидни данни / Missing parameters" },
        { status: 400 }
      );
    }

    // Fetch ticket to verify ownership
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || ticket.email.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { error: "Невалидни данни за заявката / Unauthorized or invalid ticket" },
        { status: 403 }
      );
    }

    // Create the message
    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderName: ticket.name,
        message: message.trim(),
        isInternal: false,
      },
    });

    // Notify technician / admin
    console.log(`[Notification Alert] New message on ticket ${ticket.ticketNumber} from client ${ticket.name}`);

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        senderName: "Вие (Клиент)",
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Ticket message API error:", error);
    return NextResponse.json(
      { error: "Възникна системна грешка / System error" },
      { status: 500 }
    );
  }
}
