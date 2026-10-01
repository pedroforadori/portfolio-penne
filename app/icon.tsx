import { ImageResponse } from "next/og";
import { brandFonts } from "@/lib/og-fonts";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171412",
          color: "#f4ede6",
          fontSize: 368,
          fontStyle: "italic",
          fontFamily: "Cormorant",
          borderRadius: 112,
        }}
      >
        P
      </div>
    ),
    { ...size, fonts: await brandFonts() }
  );
}
