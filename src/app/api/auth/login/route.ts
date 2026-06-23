import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setUserSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        companyMemberships: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Грешен имейл или парола / Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.passwordHash !== hashedPassword) {
      return NextResponse.json(
        { error: "Грешен имейл или парола / Invalid email or password" },
        { status: 401 }
      );
    }

    // Get company ID if applicable
    const companyId = user.companyMemberships?.[0]?.companyId || null;

    // Establish session
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "CUSTOMER_PRIVATE" | "CUSTOMER_COMPANY" | "TECHNICIAN" | "ADMIN",
      companyId,
      languagePreference: user.languagePreference,
    };

    await setUserSession(sessionUser);

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Възникна системна грешка / System error occurred" },
      { status: 500 }
    );
  }
}
