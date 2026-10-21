"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "./FigmaImg";
import { krw, usd, type Message } from "@/lib/store";

/* ───────────── Headings ───────────── */

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-end px-[20px] pt-[24px] pb-[8px]">
      <h1 className="pt-[7px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] text-balance text-ink-2">
        {children}
      </h1>
    </div>
  );
}

export function SmallCap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[12px] leading-[15px] font-medium tracking-[1.1px] uppercase ${className}`}>
      {children}
    </p>
  );
}

/* ───────────── Classification chips ───────────── */

export type Kind = "Fixed" | "Estimate" | "Recurring";

export function KindChip({ kind }: { kind: Kind }) {
  const cls =
    kind === "Fixed"
      ? "bg-mint-soft text-mint-ink"
      : kind === "Recurring"
        ? "bg-peri-chip text-[#526d78]"
        : "border border-peri bg-white text-peri-ink";
  return (
    <span className={`rounded-full px-[5px] py-[2px] text-[7px] leading-[11px] font-semibold whitespace-nowrap ${cls}`}>
      {kind}
    </span>
  );
}

/* ───────────── Money input row (MoneyField) ───────────── */

export function MoneyField({
  icon,
  label,
  kind,
  note,
  value,
  onChange,
  last,
}: {
  icon: string;
  label: string;
  kind?: Kind;
  note?: string;
  value: number;
  onChange?: (v: number) => void;
  last?: boolean;
}) {
  return (
    <div
      className={`flex h-[62px] min-h-[62px] w-full items-center justify-between ${last ? "" : "border-b border-line"}`}
    >
      <div className="flex items-center gap-[10px]">
        <div className="grid size-[32px] shrink-0 place-items-center rounded-full bg-peri-chip">
          <Icon name={icon} className="size-[18px]" />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-[12px] leading-[18px] whitespace-nowrap text-ink">{label}</p>
          {(kind || note) && (
            <div className="flex items-center gap-[5px] pt-[3px]">
              {kind && <KindChip kind={kind} />}
              {note && (
                <span className="text-[7px] leading-[11px] whitespace-nowrap text-muted-2">{note}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <label className="flex h-[38px] w-[108px] shrink-0 items-center gap-[4px] rounded-[10px] border border-line px-[10px] focus-within:border-peri">
        <span className="text-[12px] leading-[18px] text-ink">$</span>
        <input
          type="number"
          inputMode="numeric"
          aria-label={label}
          value={value}
          readOnly={!onChange}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full min-w-0 bg-transparent text-right text-[13px] leading-[19.5px] font-semibold text-ink outline-none"
        />
      </label>
    </div>
  );
}

export function FieldGroup({
  title,
  subtitle,
  children,
  shadow,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  shadow?: boolean;
}) {
  return (
    <section className="flex w-[353px] flex-col items-start">
      <h2 className="text-[16px] leading-[22px] font-semibold tracking-[-0.35px] whitespace-nowrap text-ink">
        {title}
      </h2>
      <p className="pt-[3px] text-[10px] leading-[15px] text-muted-2">{subtitle}</p>
      <div
        className={`mt-[11px] flex w-full flex-col overflow-clip rounded-[5px] border border-line bg-white px-[18px] py-[4px] ${
          shadow ? "shadow-[0px_8px_13px_0px_rgba(68,88,112,0.04)]" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
}

/* ───────────── Currency toggle + dual amount ───────────── */

export type CurrencyMode = "USD" | "KRW" | "Both";

export function CurrencyToggle({
  value,
  onChange,
  tone = "white",
  className = "w-full",
}: {
  value: CurrencyMode;
  onChange: (v: CurrencyMode) => void;
  tone?: "white" | "grey";
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={`flex h-[36px] items-start rounded-[10px] p-[3px] ${tone === "white" ? "bg-white" : "bg-[#f3f3f3]"} ${className}`}
    >
      {(["USD", "KRW", "Both"] as const).map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={value === m}
          onClick={() => onChange(m)}
          className={`flex h-full flex-1 items-center justify-center rounded-[8px] text-[10px] leading-[15px] transition-colors ${
            value === m ? "bg-peri text-ink" : "text-muted-2"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

export function DualAmount({
  amount,
  mode,
  label,
  line,
}: {
  amount: number;
  mode: CurrencyMode;
  label: ReactNode;
  /** Figma divider vector between the USD and KRW rows */
  line: string;
}) {
  const row = (value: string, cur: string) => (
    <div className="flex w-full items-center justify-between whitespace-nowrap text-ink-2">
      <p className="text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px]">{value}</p>
      <p className="text-[20px] leading-[24px] font-semibold">{cur}</p>
    </div>
  );
  return (
    <div className="flex min-h-[154px] w-full flex-col justify-center gap-[12px]">
      {label}
      <div className="flex w-full flex-col gap-[12px] py-[4px]">
        {mode !== "KRW" && row(usd(amount), "USD")}
        {mode === "Both" && <Icon name={line} className="h-0 w-full" inset="inset-[-0.5px_0_0_0]" />}
        {mode !== "USD" && row(krw(amount), "KRW")}
      </div>
    </div>
  );
}

/* ───────────── Segmented control ───────────── */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = "",
  activeClass = "bg-peri drop-shadow-[0px_2px_3px_rgba(32,36,42,0.07)]",
  textClass = "text-[12px] leading-[15px] text-black",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  activeClass?: string;
  textClass?: string;
}) {
  return (
    <div role="tablist" className={`flex items-start ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex h-full flex-1 items-center justify-center rounded-[5px] text-center transition-colors ${textClass} ${
            value === o.value ? activeClass : ""
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ───────────── Family conversation bubbles ───────────── */

export function ChatBubble({ m }: { m: Message }) {
  if (m.from === "system") {
    return (
      <article className="flex w-full flex-col items-center rounded-[15px] bg-mint p-[12px]">
        <p className="pt-[8px] pb-[4px] text-center text-[8px] leading-[12px] text-muted-2">{m.label}</p>
        <p className="pt-[5px] text-center text-[10px] leading-[15px] text-ink">{m.text}</p>
      </article>
    );
  }
  const mine = m.from === "minji";
  return (
    <article
      className={`flex w-[283.5px] flex-col items-start p-[12px] ${
        mine
          ? "self-end rounded-[15px] rounded-br-[5px] bg-peri-soft"
          : "self-start rounded-[15px] rounded-bl-[5px] bg-mint-soft"
      }`}
    >
      <p className="pt-[8px] pb-[4px] text-[10px] leading-[13.5px] text-muted-2">{m.label}</p>
      <p className="w-[260px] pt-[5px] text-[10px] leading-[13.5px] text-ink">{m.text}</p>
      {m.change && (
        <div className="mt-[9px] flex w-full items-center gap-[8px] border-t border-[rgba(32,36,42,0.12)] pt-[8px] text-[12px] leading-[15px] text-ink">
          <span>{usd(m.change[0])}/mo</span>
          <span className="text-[10px]">→</span>
          <span>{usd(m.change[1])}/mo</span>
        </div>
      )}
    </article>
  );
}

/* ───────────── Bottom tab bar (footernav) ───────────── */

const NAV = [
  { href: "/", label: "HOME", key: "home" },
  { href: "/journey", label: "JOURNEY", key: "journey" },
  { href: "/family", label: "TRANSFERS", key: "transfers" },
] as const;

function NavGlyph({ k, active }: { k: (typeof NAV)[number]["key"]; active: boolean }) {
  const stroke = active ? "border-ink-2" : "border-[#999]";
  if (k === "home") {
    return active ? (
      <Icon name="edde3" className="size-[24px]" />
    ) : (
      <span className="block size-[24px] opacity-50 grayscale">
        <Icon name="edde3" className="size-[24px]" />
      </span>
    );
  }
  if (k === "journey") {
    return <span className={`block h-[17px] w-[20px] rounded-[9.22px] border-[1.25px] ${stroke}`} />;
  }
  return (
    <span className="flex h-[17px] w-[20px] items-center justify-center">
      <span className={`block h-[17px] w-[20px] rotate-45 rounded-[3px] border-[1.25px] ${stroke}`} />
    </span>
  );
}

export function FooterNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[393px] -translate-x-1/2 items-center justify-between bg-white p-[12px]">
      {NAV.map((n) => {
        const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
        return (
          <Link
            key={n.key}
            href={n.href}
            className="flex h-[60.381px] w-[93.25px] flex-col items-center justify-center gap-[5px]"
          >
            <span className={`flex items-center rounded-[4px] p-[4px] ${active ? "bg-mint" : ""}`}>
              <NavGlyph k={n.key} active={active} />
            </span>
            <span
              className={`font-inter text-[8px] leading-[12px] font-extrabold tracking-[0.32px] ${
                active ? "text-ink-2" : "text-[#999]"
              }`}
            >
              {n.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ───────────── Toast ───────────── */

export function Toast({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-[104px] left-1/2 z-40 -translate-x-1/2 rounded-[10px] bg-ink px-[16px] py-[10px] text-[12px] text-white shadow-lg transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
