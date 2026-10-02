import { ImageResponse } from "next/og";
import { penneMarkSvg } from "@/lib/penne-logo";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// As alianças do selo sobre o fundo escuro do site.
const MARK = `data:image/svg+xml;base64,${Buffer.from(penneMarkSvg()).toString("base64")}`;

export default function Icon() {
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
          borderRadius: 112,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={MARK} width={360} height={284} />
      </div>
    ),
    size
  );
}
