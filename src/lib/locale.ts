import { cookies } from "next/headers";

export async function getLocale(): Promise<"bg" | "en"> {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("almi_locale")?.value;
    return locale === "en" ? "en" : "bg";
  } catch (error) {
    return "bg";
  }
}

export async function setLocale(locale: "bg" | "en"): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set("almi_locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  } catch (error) {
    // Ignore error when called outside request context
  }
}
