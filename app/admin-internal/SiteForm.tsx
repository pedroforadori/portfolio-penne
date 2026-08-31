"use client";

import { useState } from "react";
import { PALETTE } from "@/lib/palette";
import type { Site } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<Site>;
  submitLabel: string;
};

export default function SiteForm({ action, initial, submitLabel }: Props) {
  const [color, setColor] = useState(initial?.color ?? PALETTE[0].value);

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Casal" name="couple" defaultValue={initial?.couple} required />
        <Field
          label="Slug"
          name="slug"
          defaultValue={initial?.slug}
          required
          placeholder="vania-mauro"
        />
        <Field
          label="URL do site (ao vivo)"
          name="liveUrl"
          type="url"
          defaultValue={initial?.liveUrl}
          required
          placeholder="https://..."
        />
        <Field
          label="URL do GitHub (opcional)"
          name="githubUrl"
          type="url"
          defaultValue={initial?.githubUrl}
          placeholder="https://github.com/..."
        />
      </div>

      <div>
        <span className="block text-sm text-[#a89a8c] mb-2">Cor de fundo</span>
        <input type="hidden" name="color" value={color} />
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((p) => (
            <button
              key={p.value}
              type="button"
              title={p.name}
              onClick={() => setColor(p.value)}
              className="h-9 w-9 rounded-full border-2 transition"
              style={{
                backgroundColor: p.value,
                borderColor: color === p.value ? "#f4ede6" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#a89a8c] mb-2" htmlFor="image">
          Screenshot do site {initial?.imageUrl && "(enviar substitui a atual)"}
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-[#c9baac] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2a241f] file:px-4 file:py-2 file:text-sm file:text-[#f4ede6]"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-[#c97b5c] px-5 py-2.5 text-sm font-medium text-[#171412] transition hover:bg-[#dc8e6e]"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-[#a89a8c] mb-1.5">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#3a332c] bg-[#12100e] px-3.5 py-2 text-[#f4ede6] placeholder:text-[#6b5f54] outline-none focus:border-[#c97b5c]"
      />
    </label>
  );
}
