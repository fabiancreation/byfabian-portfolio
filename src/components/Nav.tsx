"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ground/85 backdrop-blur-md border-b border-rule"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-edge flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="font-display text-[1.375rem] leading-none tracking-tightest lowercase"
          aria-label="ByFabian — home"
        >
          by<span className="italic">fabian</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.8125rem] uppercase tracking-wider2 text-ink-soft hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 text-[0.8125rem] uppercase tracking-wider2 text-ink hover:text-accent transition-colors"
        >
          <span>Book</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </header>
  );
}
