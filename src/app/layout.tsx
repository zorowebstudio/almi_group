import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLocale } from "@/lib/locale";
import { getUserSession } from "@/lib/auth";
import { LocaleProvider } from "@/components/LocaleProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isBg = locale === "bg";
  return {
    title: isBg
      ? "Алми Груп ООД | Компютърна поддръжка и IT услуги в София"
      : "Almi Group LTD | Computer Support and IT Services Sofia",
    description: isBg
      ? "Вашият надежден IT партньор за офиса и дома. Професионална компютърна поддръжка, софтуерна помощ, мрежи и дистанционна техническа помощ за фирми и граждани в София."
      : "Your reliable IT partner for office and home. Professional computer support, software aid, network setups, and remote technical assistance for businesses and private clients in Sofia.",
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const session = await getUserSession();

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#07111F] text-[#F4F8FC] font-sans selection:bg-blue-600/30 selection:text-cyan-400">
        <LocaleProvider initialLocale={locale}>
          <Navbar session={session} />
          <main className="flex-grow flex flex-col relative">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
