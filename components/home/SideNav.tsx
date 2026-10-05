import Link from "next/link";

const ITEM =
  "group flex items-center gap-2.5 text-cream/70 transition-colors hover:text-cream focus-visible:text-cream";
const MARK =
  "size-1.5 bg-transparent transition-colors group-hover:bg-cream group-focus-visible:bg-cream";

// Avaliações, Blog e Domínio depois da abertura: espelho do menu de modos (ViewMenu),
// do lado oposto — meio da tela à esquerda. Só do sm pra cima: no celular os
// links ficam sempre no header, na posição da abertura. O ■ aparece no hover, já que aqui não há item "ativo". No desktop
// os links passam por cima do nome gigante do casal: o mix-blend-difference
// deixa eles claros no fundo escuro e escuros sobre as letras.
export default function SideNav({
  visible,
  showTestimonials,
  showBlog,
  onTestimonials,
}: {
  visible: boolean;
  showTestimonials: boolean;
  showBlog: boolean;
  onTestimonials: () => void;
}) {
  return (
    <nav
      aria-label="Menu"
      inert={!visible}
      className={`fixed left-10 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-start gap-2.5 font-mono text-xs mix-blend-difference transition-opacity duration-500 sm:flex ${
        visible ? "" : "pointer-events-none opacity-0"
      }`}
    >
      {showTestimonials && (
        <a
          href="#avaliacoes"
          onClick={(event) => {
            event.preventDefault();
            onTestimonials();
          }}
          className={ITEM}
        >
          <span aria-hidden className={MARK} />
          Avaliações
        </a>
      )}
      {showBlog && (
        <Link href="/blog" className={ITEM}>
          <span aria-hidden className={MARK} />
          Blog
        </Link>
      )}
      <Link href="/dominio" className={ITEM}>
        <span aria-hidden className={MARK} />
        Domínio
      </Link>
    </nav>
  );
}
