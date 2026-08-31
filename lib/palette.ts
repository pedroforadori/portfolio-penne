export const PALETTE = [
  { name: "Terracota", value: "#C97B5C" },
  { name: "Verde-azulado", value: "#3F6F68" },
  { name: "Salmão", value: "#D98F6F" },
  { name: "Vinho", value: "#6B3548" },
  { name: "Rosa-poeira", value: "#B98B94" },
  { name: "Areia", value: "#C7A876" },
  { name: "Musgo", value: "#7C8570" },
  { name: "Bege-rosado", value: "#C9AFA0" },
] as const;

export function colorForIndex(index: number): string {
  return PALETTE[index % PALETTE.length].value;
}
