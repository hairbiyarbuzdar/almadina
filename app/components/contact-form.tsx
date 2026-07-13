"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";

const CONTACT_EMAIL = "hairbiyarbuzdar@gmail.com";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(`Website enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    // Opens the visitor's email client, pre-filled to your inbox.
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="border border-black/10 bg-cream p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-brand/10 grid place-items-center mb-4">
          <CheckIcon className="w-6 h-6 text-brand" />
        </div>
        <h3 className="font-display text-2xl text-ink mb-2">Thank you</h3>
        <p className="text-ink-soft text-sm">
          Your email app should have opened with your message ready to send. We
          usually reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Full name" name="name" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <div>
        <label className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
          Message<span className="text-red-500"> *</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-black/15 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-ink text-white text-xs uppercase tracking-widest py-4 hover:bg-brand transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
        {label}<span className="text-red-500"> *</span>
      </label>
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        className="w-full border border-black/15 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"
      />
    </div>
  );
}
