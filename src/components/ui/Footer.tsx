"use client";

import { useState } from "react";
import { InstagramIcon, TikTokIcon, GitHubIcon } from "@/components/ui/Icons";
import { LegalModal } from "@/components/ui/LegalModal";

const STACK = ["Next.js", "Django", "PostgreSQL", "Tailwind CSS", "CoinGecko API", "Claude API"];

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "AI Feedback", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "@kxvxn.js", href: "https://www.instagram.com/kxvxn.js" },
      { label: "@keybcuts.codes", href: "https://www.tiktok.com/@keybcuts.codes" },
      { label: "404NeuronNotFound", href: "https://github.com/404NeuronNotFound" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", action: "privacy" },
      { label: "Terms of Use", action: "terms" },
    ],
  },
];

export default function Footer() {
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: "terms" | "privacy" | null }>({
    isOpen: false,
    type: null,
  });

  const handleLegalClick = (type: "terms" | "privacy") => {
    setLegalModal({ isOpen: true, type });
  };

  const closeLegalModal = () => {
    setLegalModal({ isOpen: false, type: null });
  };
  return (
    <footer className="border-t border-border px-8 py-14 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        {/* Brand */}
        <div className="max-w-xs">
          <a href="/" className="flex items-center gap-2 mb-4 no-underline">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-black text-sm">C</span>
              </div>
            <span className="font-bold text-sm text-foreground">CoinFession</span>
          </a>
          <p className="text-xs leading-relaxed mb-6 text-muted-foreground">
            A trade journal for crypto investors who want to stop repeating mistakes
            and start learning from their own patterns.
          </p>

          {/* Social icons */}
          <div className="flex gap-2">
            <a
              href="https://www.instagram.com/kxvxn.js"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors"
              style={{ color: "#E1306C" }}
            >
              <InstagramIcon size={17} />
            </a>
            <a
              href="https://www.tiktok.com/@keybeen.creatives"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:border-foreground/50 hover:bg-muted transition-colors text-foreground"
            >
              <TikTokIcon size={16} />
            </a>
            <a
              href="https://github.com/404NeuronNotFound"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:border-foreground/50 hover:bg-muted transition-colors text-foreground"
            >
              <GitHubIcon size={17} />
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <div className="mb-4 uppercase text-[11px] tracking-widest text-muted-foreground">
                {title}
              </div>
              {links.map((l: any) => (
                l.action ? (
                  <button
                    key={l.label}
                    onClick={() => handleLegalClick(l.action)}
                    className="block mb-2 text-xs text-muted-foreground hover:text-foreground transition-colors no-underline text-left cursor-pointer"
                  >
                    {l.label}
                  </button>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block mb-2 text-xs text-muted-foreground hover:text-foreground transition-colors no-underline"
                  >
                    {l.label}
                  </a>
                )
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

          {/* Stack pills */}
          <div className="flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="text-[11px] px-2.5 py-1 rounded border border-border text-muted-foreground font-mono"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Credits */}
          <div className="text-right shrink-0">
            <div className="text-xs mb-1 text-muted-foreground">
              Developed by{" "}
              <a
                href="https://github.com/404NeuronNotFound"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Keybeen
              </a>
            </div>
            <div className="text-[11px] flex items-center justify-end gap-1.5 text-muted-foreground/50">
              Featuring
              <span className="font-semibold text-muted-foreground">Claude Code</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            </div>
          </div>
        </div>

        <div className="mt-5 text-[11px] text-muted-foreground/40">
          © {new Date().getFullYear()} CoinFession. Built for traders who want the truth.
        </div>
      </div>

      {/* Legal Modal */}
      {legalModal.type && (
        <LegalModal
          isOpen={legalModal.isOpen}
          onClose={closeLegalModal}
          type={legalModal.type}
        />
      )}
    </footer>
  );
}
