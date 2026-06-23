import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setUserSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate registration body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role, companyName, eik } = result.data;

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Имейл адресът вече е регистриран / Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    let companyId: string | null = null;

    // Create user and optional company context within a database transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash: hashedPassword,
          name,
          role,
          phone,
          languagePreference: "bg",
        },
      });

      if (role === "CUSTOMER_COMPANY" && companyName) {
        const company = await tx.company.create({
          data: {
            name: companyName,
            eik: eik || null,
          },
        });
        companyId = company.id;

        await tx.companyMember.create({
          data: {
            userId: user.id,
            companyId: company.id,
            role: "OWNER",
          },
        });
      }

      return user;
    });

    // Establish session
    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as "CUSTOMER_PRIVATE" | "CUSTOMER_COMPANY" | "TECHNICIAN" | "ADMIN",
      companyId,
      languagePreference: newUser.languagePreference,
    };

    await setUserSession(sessionUser);

    return NextResponse.json({
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Възникна грешка при регистрация / Registration error occurred" },
      { status: 500 }
    );
  }
}
