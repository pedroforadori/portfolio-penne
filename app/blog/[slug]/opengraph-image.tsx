import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";
import { brandFonts } from "@/lib/og-fonts";

export const alt = "Post do blog da Penne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPost((await params).slug);
  const title = post?.meta.title ?? "Blog da Penne";

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
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, opacity: 0.6 }}>BLOG</div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Anton",
            fontSize: title.length > 48 ? 76 : 96,
            lineHeight: 0.95,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", height: 12, borderRadius: 6, background: "#dba58c" }} />
      </div>
    ),
    { ...size, fonts: await brandFonts() }
  );
}
