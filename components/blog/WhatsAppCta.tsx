import { whatsappUrl } from "@/lib/site-config";
import RollText from "@/components/home/RollText";

// Chamada pro orçamento no meio do post, com a mensagem já preenchida.
export default function WhatsAppCta({
  titulo = "Quer um site assim pro seu casamento?",
  mensagem,
}: {
  titulo?: string;
  mensagem?: string;
}) {
  return (
    <aside className="my-12 flex flex-col gap-4 border-y border-cream/10 py-8 sm:flex-row sm:items-end sm:justify-between">
      <p className="font-serif text-2xl italic leading-tight sm:text-3xl">{titulo}</p>
      <a
        href={whatsappUrl(mensagem)}
        target="_blank"
        rel="noopener"
        className="penne-roll shrink-0 font-display text-xl uppercase leading-none text-[#dba58c]"
      >
        <RollText text="Orçamento no WhatsApp ↗" />
      </a>
    </aside>
  );
}
