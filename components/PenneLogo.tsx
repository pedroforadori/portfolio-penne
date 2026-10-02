import Link from "next/link";
import { penneMarkSvg, penneSealSvg } from "@/lib/penne-logo";

// O logo no canto do header, levando pra home: o selo completo, ou só as
// alianças (na home, onde o selo grande já aparece na abertura).
const SEAL = penneSealSvg({ id: "penne-header" });
const MARK = penneMarkSvg({ id: "penne-header-mark" });

export function PenneLogo({
  variant = "seal",
  className = "",
  onClick,
}: {
  variant?: "seal" | "mark";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const size = variant === "mark" ? "h-10 w-[51px] sm:h-12 sm:w-[61px]" : "size-[88px] sm:size-[110px]";
  return (
    <Link
      href="/"
      aria-label="Penne — página inicial"
      onClick={onClick}
      className={`block ${size} transition-opacity hover:opacity-80 ${className}`}
    >
      <span
        aria-hidden
        className="block h-full w-full [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: variant === "mark" ? MARK : SEAL }}
      />
    </Link>
  );
}

// O selo grande da abertura da home; as alianças giram devagar.
const BIG_SEAL = penneSealSvg({ id: "penne-big" });

export function PenneSeal({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`penne-seal block [&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: BIG_SEAL }}
    />
  );
}
