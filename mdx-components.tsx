import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import CaseCard from "@/components/blog/CaseCard";
import WhatsAppCta from "@/components/blog/WhatsAppCta";

// Tipografia dos posts do blog (content/blog/*.mdx) e os componentes que dá
// pra usar direto no texto: <CaseCard slug="…" /> e <WhatsAppCta />.
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 font-display text-3xl uppercase leading-[0.95] text-cream sm:text-4xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-10 font-serif text-2xl font-semibold italic text-cream" {...props} />
  ),
  p: (props) => <p className="mt-5" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-[#dba58c]" {...props} />,
  ol: (props) => (
    <ol className="mt-5 list-decimal space-y-2 pl-5 marker:font-mono marker:text-cream/60" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-cream" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-8 border-l-2 border-[#dba58c] pl-5 font-serif text-2xl italic leading-snug text-cream"
      {...props}
    />
  ),
  code: (props) => (
    <code className="rounded bg-cream/10 px-1.5 py-0.5 font-mono text-[0.85em] text-cream" {...props} />
  ),
  hr: () => <hr className="my-12 border-cream/10" />,
  a: ({ href = "", ...props }) => {
    const className = "text-cream underline decoration-[#dba58c] underline-offset-4 hover:decoration-cream";
    return href.startsWith("/") ? (
      <Link href={href} className={className} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener" className={className} {...props} />
    );
  },
  table: (props) => (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-b border-cream/20 py-2 pr-4 font-mono text-[11px] font-normal uppercase text-cream/60" {...props} />
  ),
  td: (props) => <td className="border-b border-cream/10 py-2 pr-4 align-top" {...props} />,
  CaseCard,
  WhatsAppCta,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
