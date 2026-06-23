import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "almi-group-super-secret-key-2026-must-be-long-enough";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const SESSION_COOKIE_NAME = "almi_session";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER_PRIVATE" | "CUSTOMER_COMPANY" | "TECHNICIAN" | "ADMIN";
  companyId?: string | null;
  languagePreference: string;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function signJWT(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyJWT(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as UserSession;
  } catch (error) {
    return null;
  }
}

export async function getUserSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyJWT(token);
  } catch (error) {
    return null;
  }
}

export async function setUserSession(user: UserSession): Promise<void> {
  const token = await signJWT(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function hasRole(session: UserSession | null, allowedRoles: string[]): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.role);
}
