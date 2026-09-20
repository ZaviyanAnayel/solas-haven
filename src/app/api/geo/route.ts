import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Check Vercel edge geolocation headers (0ms latency, native Vercel CDN headers)
    const city = req.headers.get("x-vercel-ip-city");
    const country =
      req.headers.get("x-vercel-ip-country-name") ||
      req.headers.get("x-vercel-ip-country");

    if (city && country) {
      const decodedCity = decodeURIComponent(city);
      const decodedCountry = decodeURIComponent(country);
      return NextResponse.json({
        city: decodedCity,
        country: decodedCountry,
        locationName: `${decodedCity}, ${decodedCountry}`,
      });
    }

    // 2. Server-side IP lookup with quick 2s abort signal (Server-to-Server, zero browser CORS)
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`https://ipwho.is/${clientIp}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.city && data.country) {
            return NextResponse.json({
              city: data.city,
              country: data.country,
              locationName: `${data.city}, ${data.country}`,
            });
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    return NextResponse.json({
      city: "Sanctuary Soul",
      country: "Earth",
      locationName: "Somewhere under the Stars",
    });
  } catch {
    return NextResponse.json({
      city: "Sanctuary Soul",
      country: "Earth",
      locationName: "Somewhere under the Stars",
    });
  }
}
