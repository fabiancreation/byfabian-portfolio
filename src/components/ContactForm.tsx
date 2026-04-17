"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/cn";

const schema = z.object({
  name: z.string().min(2, "Your name, please"),
  email: z.string().email("A valid email"),
  brand: z.string().min(1, "Brand or company"),
  projectType: z.string().min(1, "Pick one"),
  budget: z.string().min(1, "Pick one"),
  timeline: z.string().optional(),
  message: z.string().min(10, "A few sentences — what do you want to build?"),
});

type FormValues = z.infer<typeof schema>;

const projectTypes = [
  "Beauty / Editorial",
  "Fashion / Lookbook",
  "Activewear / Lifestyle",
  "Virtual influencer",
  "Other",
];

const budgets = [
  "Under €2k",
  "€2–5k",
  "€5–10k",
  "€10k+",
  "Not sure yet",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Send failed");
      setStatus("sent");
      reset();
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Send failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="border border-rule p-10 md:p-14">
        <p className="eyebrow mb-4">Brief received</p>
        <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-tightest max-w-[22ch]">
          Thank you. You&apos;ll hear back within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Your name" error={errors.name?.message}>
          <input
            {...register("name")}
            autoComplete="name"
            className="input"
            placeholder="Fabian Arndt"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@brand.com"
          />
        </Field>
      </div>

      <Field label="Brand / Company" error={errors.brand?.message}>
        <input
          {...register("brand")}
          className="input"
          placeholder="ALO, The Row, Acne Studios…"
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Project type" error={errors.projectType?.message}>
          <select {...register("projectType")} className="input" defaultValue="">
            <option value="" disabled>Select…</option>
            {projectTypes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Budget" error={errors.budget?.message}>
          <select {...register("budget")} className="input" defaultValue="">
            <option value="" disabled>Select…</option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Timeline (optional)">
        <input
          {...register("timeline")}
          className="input"
          placeholder="ASAP, Q3, flexible…"
        />
      </Field>

      <Field label="The brief" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className="input resize-none"
          placeholder="The mood, the model, the moment. What do you want to make?"
        />
      </Field>

      <div className="flex items-center justify-between gap-4 pt-4">
        <p className="serial">
          {status === "error" && errorMsg ? `Error: ${errorMsg}` : ""}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "group inline-flex items-center gap-3 px-7 py-4 bg-ink text-ground text-[0.8125rem] uppercase tracking-wider2",
            "hover:bg-accent transition-colors duration-300 disabled:opacity-50"
          )}
        >
          <span>{status === "sending" ? "Sending…" : "Send brief"}</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid #d9d2c5;
          padding: 0.75rem 0;
          font-size: 1rem;
          color: #161513;
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s ease;
        }
        :global(.input:focus) {
          border-bottom-color: #161513;
        }
        :global(.input::placeholder) {
          color: #8a857d;
        }
        :global(select.input) {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='%238a857d' d='M6 8 0 0h12z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 20px;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {children}
      {error ? (
        <span className="block text-[0.75rem] text-accent mt-1">{error}</span>
      ) : null}
    </label>
  );
}
