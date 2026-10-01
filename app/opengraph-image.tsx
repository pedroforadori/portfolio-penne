import { ImageResponse } from "next/og";
import { PALETTE } from "@/lib/palette";
import { brandFonts } from "@/lib/og-fonts";

export const alt = "Penne — Sites de casamento personalizados";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
        <div style={{ display: "flex", fontFamily: "Cormorant", fontStyle: "italic", fontSize: 56 }}>
          Penne
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 150,
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            Sites de casamento
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontSize: 44,
              color: "#dba58c",
            }}
          >
            feitos sob medida, um para cada casal
          </div>
        </div>

        {/* As cores dos cases, como uma faixa */}
        <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden" }}>
          {PALETTE.map((c) => (
            <div key={c.value} style={{ flex: 1, background: c.value }} />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: await brandFonts() }
  );
}
