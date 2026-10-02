import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import RollText from "./RollText";

// Última tela da home, depois do último case: os posts mais recentes do blog.
export default function BlogSlide({
  posts,
  index,
  active,
}: {
  posts: PostMeta[];
  index: number;
  active: boolean;
}) {
  return (
    <section
      data-slide
      data-index={index}
      data-active={active}
      aria-labelledby="penne-blog-title"
      className="penne-slide relative h-dvh snap-start overflow-hidden"
    >
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <h2
          id="penne-blog-title"
          className="font-display text-[17vw] uppercase leading-[0.86] sm:text-[clamp(56px,9vw,150px)]"
        >
          <span className="penne-line">
            <span>
              Dicas{" "}
              <span className="font-serif font-medium normal-case italic text-[#dba58c]">pro</span>
            </span>
          </span>
          <span className="penne-line">
            <span>casamento</span>
          </span>
        </h2>

        <div className="penne-intro-body mt-6 sm:mt-10">
          <ul className="border-t border-cream/10">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-cream/10">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline justify-between gap-6 py-4 sm:py-5"
                >
                  <span className="font-serif text-xl italic leading-tight transition-colors group-hover:text-[#dba58c] sm:text-3xl">
                    {post.title}
                  </span>
                  <span className="hidden shrink-0 font-mono text-[11px] uppercase text-cream/55 sm:inline">
                    {post.readingMinutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/blog"
            className="penne-roll mt-6 inline-block font-display text-lg uppercase leading-none sm:mt-8 sm:text-xl"
          >
            <RollText text="Ver o blog →" />
          </Link>
        </div>
      </div>
    </section>
  );
}
