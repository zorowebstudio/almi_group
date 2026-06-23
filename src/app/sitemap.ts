import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://almi.bg";
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/uslugi",
    "/za-nas",
    "/kontakti",
    "/faq",
    "/help",
    "/zayavi-pomosht",
    "/proveri-zayavka",
    "/diagnostika",
    "/rezervaciya",
    "/obshti-usloviya",
    "/politika-za-biskvitki",
    "/politika-za-poveritelnost"
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
