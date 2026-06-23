import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/auth";
import { bookingSchema } from "@/lib/validation";
import { sendNotification, notifyAdmin } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate booking body
    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { serviceType, date, timeSlot, notes, address, locationType } = result.data;
    
    // Check if user is logged in
    const session = await getUserSession();
    const customerId = session?.id || null;

    const bookingDate = new Date(date);

    // Prevent double booking on same slot/day (SLA/technician availability constraint)
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        date: bookingDate,
        timeSlot,
        status: { not: "CANCELLED" },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Този час вече е резервиран. Моля изберете друг. / Slot already booked." },
        { status: 400 }
      );
    }

    // Create the booking
    const appointment = await prisma.appointment.create({
      data: {
        customerId,
        serviceType,
        date: bookingDate,
        timeSlot,
        locationType,
        address: address || null,
        notes: notes || null,
        status: "PENDING", // needs technician validation
      },
    });

    // Notify user
    const dateStr = bookingDate.toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailSubject = `[Алми Груп] Нова резервация за час - ${dateStr}`;
    const emailMessage = `Здравейте!
Часът Ви за техническо обслужване е резервиран успешно.

Услуга: ${serviceType}
Дата: ${dateStr}
Час: ${timeSlot}
Място на обслужване: ${locationType}

Статус: Очаква потвърждение (PENDING)
Наш техник ще се свърже с Вас за потвърждаване или при нужда от доуточнения.

Благодарим Ви, че избрахте Алми Груп ООД!`;

    if (session) {
      await sendNotification({
        userId: session.id,
        title: emailSubject,
        message: emailMessage,
        type: "APPOINTMENTS",
        emailTo: session.email,
      });
    } else {
      console.log(`[Guest Booking Email] Subject: ${emailSubject}`);
    }

    // Notify administrators
    await notifyAdmin(
      `Нова резервация за час`,
      `Услуга: ${serviceType}
Дата: ${dateStr} (${timeSlot})
Място: ${locationType}
Бележки: ${notes || "няма"}`
    );

    return NextResponse.json({
      success: true,
      booking: appointment,
    });
  } catch (error) {
    console.error("Create Booking API Error:", error);
    return NextResponse.json(
      { error: "Възникна грешка при резервация / Booking error" },
      { status: 500 }
    );
  }
}
