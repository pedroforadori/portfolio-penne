import { ImageResponse } from "next/og";
import { getSiteBySlug } from "@/lib/sites";
import { splitCouple } from "@/lib/case-copy";
import { brandFonts } from "@/lib/og-fonts";

export const alt = "Site de casamento feito pela Penne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const site = await getSiteBySlug((await params).slug);
  const { first, second } = splitCouple(site?.couple ?? "Penne");
  const color = site?.color ?? "#C97B5C";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#171412",
          color: "#f4ede6",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", fontFamily: "Cormorant", fontStyle: "italic", fontSize: 56 }}>
            Penne
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, opacity: 0.6 }}>
            SITE DE CASAMENTO
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Anton",
            fontSize: 170,
            lineHeight: 0.9,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>{first}</div>
          {second && (
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  fontFamily: "Cormorant",
                  fontStyle: "italic",
                  textTransform: "none",
                  color,
                  marginRight: 32,
                }}
              >
                &
              </span>
              {second}
            </div>
          )}
        </div>

        <div style={{ display: "flex", height: 12, borderRadius: 6, background: color }} />
      </div>
    ),
    { ...size, fonts: await brandFonts() }
  );
}
