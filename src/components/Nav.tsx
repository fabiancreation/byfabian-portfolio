"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home hero we sit over a dark image → use light type until the user
  // scrolls past the hero.
  const overHero = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ground/85 backdrop-blur-md border-b border-rule"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container-edge flex h-[64px] md:h-[72px] items-center justify-between">
        <Link
          href="/"
          className={cn(
            "font-display text-[1.3rem] md:text-[1.375rem] leading-none tracking-tightest lowercase transition-colors",
            overHero ? "text-ground" : "text-ink",
          )}
          aria-label="ByFabian — home"
        >
          by<span className="italic">fabian</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-[0.8125rem] uppercase tracking-wider2 transition-colors",
                overHero
                  ? "text-ground/80 hover:text-ground"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className={cn(
            "group inline-flex items-center gap-2 text-[0.8125rem] uppercase tracking-wider2 transition-colors",
            overHero
              ? "text-ground hover:text-ground/70"
              : "text-ink hover:text-accent",
          )}
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
