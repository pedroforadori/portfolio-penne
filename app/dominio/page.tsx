import type { Metadata } from "next";
import Link from "next/link";
import RollText from "@/components/home/RollText";
import { PenneLogo } from "@/components/PenneLogo";
import WhatsAppCta from "@/components/blog/WhatsAppCta";
import DomainHelper from "@/components/dominio/DomainHelper";

const TITLE = "Domínio para o site do casamento";
const DESCRIPTION =
  "Digite os nomes do casal e veja sugestões de domínio para o site do casamento, com .com.br e .com livres e dicas para escolher um endereço fácil de passar aos convidados.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/dominio" },
  openGraph: { url: "/dominio", title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const DICAS = [
  {
    titulo: "Faça o teste do telefone",
    texto:
      "Fale o endereço em voz alta para alguém anotar. Se precisar soletrar ou explicar, escolha outro.",
  },
  {
    titulo: ".com.br primeiro",
    texto:
      "É o que o convidado brasileiro digita por instinto. O .com é um bom reserva, ou dá pra registrar os dois.",
  },
  {
    titulo: "Sem hífen e sem acento",
    texto:
      "“ana-e-joao” vira “ana traço e traço joão” no áudio do WhatsApp. Acento não entra no endereço: João vira joao.",
  },
  {
    titulo: "Registre logo",
    texto:
      "Domínio livre hoje pode não estar amanhã. Ele precisa ficar ativo pelo menos até o fim da lista de presentes.",
  },
];

export default async function DominioPage({ searchParams }: PageProps<"/dominio">) {
  const params = await searchParams;
  const get = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");

  return (
    <div className="penne min-h-dvh bg-night text-cream">
      <header className="flex items-start justify-between p-6 sm:p-10">
        <PenneLogo />
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="penne-roll font-mono text-xs uppercase leading-[1.3] text-cream/70 hover:text-cream"
          >
            <RollText text="← Todos os casamentos" />
          </Link>
          <Link
            href="/blog"
            className="penne-roll font-mono text-xs uppercase leading-[1.3] text-cream/70 hover:text-cream"
          >
            <RollText text="Blog" />
          </Link>
        </nav>
      </header>

      <main className="px-6 pb-16 sm:px-10">
        <h1 className="font-display text-[24vw] uppercase leading-[0.86] sm:text-[clamp(96px,14vw,230px)]">
          Domínio
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-cream/80 sm:text-3xl">
          O endereço do site de vocês. A gente sugere, confere se está livre e ajuda a escolher o
          mais fácil de passar pros convidados.
        </p>

        <div className="mt-14 sm:mt-20">
          <DomainHelper
            initial={{
              nome1: get("nome1"),
              nome2: get("nome2"),
              data: get("data"),
              sobrenome: get("sobrenome"),
            }}
          />
        </div>

        <section className="mt-20 sm:mt-28">
          <h2 className="font-display text-4xl uppercase leading-none sm:text-6xl">Como escolher</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
            {DICAS.map((dica, index) => (
              <li key={dica.titulo} className="flex flex-col gap-3 border-t border-cream/10 pt-6">
                <span className="font-mono text-xs tabular-nums text-cream/55">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-2xl italic leading-tight">{dica.titulo}</span>
                <span className="text-sm leading-relaxed text-cream/70">{dica.texto}</span>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-2xl text-xs leading-relaxed text-cream/50">
            A consulta usa o RDAP, o serviço público do Registro.br e da Verisign. “Livre” quer dizer
            que ninguém registrou o nome. Alguns poucos são reservados e só dá pra ter certeza na hora
            de registrar.
          </p>
        </section>

        <WhatsAppCta
          titulo="Achou o domínio? A gente registra e faz o site."
          mensagem="Oi! Usei a busca de domínio da Penne e quero um site para o meu casamento."
        />
      </main>
    </div>
  );
}
