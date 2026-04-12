export type Theme = "dark" | "light";

export function getTokens(theme: Theme) {
  const d = theme === "dark";
  return {
    bg:           d ? "bg-[#0a0a0a]"        : "bg-[#f4f4ef]",
    bgCard:       d ? "bg-[#111]"           : "bg-white",
    bgSubtle:     d ? "bg-white/[0.03]"     : "bg-black/[0.03]",
    bgInput:      d ? "bg-white/[0.05]"     : "bg-black/[0.04]",
    border:       d ? "border-white/[0.08]" : "border-black/[0.09]",
    borderSubtle: d ? "border-white/[0.05]" : "border-black/[0.05]",
    text:         d ? "text-white"          : "text-[#0d0d0d]",
    textMid:      d ? "text-white/70"       : "text-black/70",
    textMuted:    d ? "text-white/50"       : "text-black/50",
    textFaint:    d ? "text-white/35"       : "text-black/40",
    textGhost:    d ? "text-white/20"       : "text-black/25",
    navBg:        d ? "bg-[#0a0a0a]"        : "bg-[#f4f4ef]",
    tabActive:    d ? "bg-white/[0.08] text-white"     : "bg-black/[0.07] text-[#0d0d0d]",
    tabInactive:  d ? "text-white/45 hover:text-white" : "text-black/45 hover:text-[#0d0d0d]",
    tableHead:    d ? "bg-white/[0.02]"     : "bg-black/[0.02]",
    rowHover:     d ? "hover:bg-white/[0.025]" : "hover:bg-black/[0.025]",
    statBorder:   d ? "border-r border-white/[0.08]" : "border-r border-black/[0.08]",
    inputFocus:   d ? "focus:border-[#50AF95]/50" : "focus:border-[#50AF95]/70",
    inputBorder:  d ? "border-white/[0.08]" : "border-black/[0.1]",
    inputPH:      d ? "placeholder:text-white/20" : "placeholder:text-black/25",
    socialBorder: d ? "border-white/[0.1]"  : "border-black/[0.12]",
    socialHover:  d ? "hover:border-white/25 hover:bg-white/[0.04]" : "hover:border-black/25 hover:bg-black/[0.04]",
    footerLink:   d ? "text-white/50 hover:text-white"    : "text-black/55 hover:text-[#0d0d0d]",
    footerTitle:  d ? "text-white/30"       : "text-black/35",
    footerDesc:   d ? "text-white/40"       : "text-black/45",
    stackPill:    d ? "border-white/[0.08] text-white/40" : "border-black/[0.1] text-black/45",
    openBadge:    d ? "text-white/25"       : "text-black/30",
    alertBorder:  d ? "border-white/[0.06]" : "border-black/[0.08]",
    alertBg:      d ? "bg-white/[0.015]"    : "bg-black/[0.02]",
  };
}

export type Tokens = ReturnType<typeof getTokens>;