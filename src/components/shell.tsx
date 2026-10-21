"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "./FigmaImg";

/** Phone-width app column (393px, like the Figma frames). */
export function Screen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto flex min-h-dvh w-full max-w-[393px] flex-col overflow-x-clip bg-app pb-[100px] ${className}`}
    >
      {children}
    </div>
  );
}

export function Logo() {
  return (
    <Link href="/" aria-label="AVIA home">
      <p className="text-[21px] leading-[31.5px] font-bold tracking-[5px] whitespace-nowrap text-ink">
        AVIA
      </p>
    </Link>
  );
}

/** AVIA wordmark with optional back button (flow screens). */
export function TopBar({
  back,
  right,
}: {
  back?: string | true;
  right?: ReactNode;
}) {
  return (
    // Spacer keeps the layout height; the bar itself stays fixed at the top.
    <div className="h-[55.5px] w-full shrink-0">
      <div className="fixed top-0 left-1/2 z-30 w-full max-w-[393px] -translate-x-1/2 bg-app">
        <TopBarContent back={back} right={right} />
      </div>
    </div>
  );
}

function TopBarContent({
  back,
  right,
}: {
  back?: string | true;
  right?: ReactNode;
}) {
  const router = useRouter();
  if (!back) {
    return (
      <div className="flex w-full items-center justify-center py-[12px]">
        <Logo />
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-between px-[20px] py-[12px]">
      {back === true ? (
        <button aria-label="Back" onClick={() => router.back()}>
          <Icon name="8bd45" className="size-[24px]" />
        </button>
      ) : (
        <Link aria-label="Back" href={back}>
          <Icon name="8bd45" className="size-[24px]" />
        </Link>
      )}
      <Logo />
      <div className="flex size-[24px] items-center justify-center">{right}</div>
    </div>
  );
}

/** Numbered step + progress bar + title + subtitle used in the planning flow. */
export function StepHeader({
  step,
  progress,
  title,
  subtitle,
  subtitleWidth = "w-[278px]",
}: {
  step?: number;
  /** filled width in px, as in the design */
  progress?: number;
  title: ReactNode;
  subtitle?: ReactNode;
  subtitleWidth?: string;
}) {
  return (
    <div className="flex w-full flex-col items-start">
      {step !== undefined && (
        <div className="flex w-full items-center gap-[11px] px-[20px] py-[12px]">
          <div className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-peri">
            <p className="text-[10px] leading-[15px] font-bold text-black">{step}</p>
          </div>
          <div className="h-[5px] flex-1 overflow-hidden rounded-[10px] bg-track">
            <div
              className="h-[5px] rounded-[10px] bg-peri transition-[width] duration-500"
              style={{ width: progress ?? 0 }}
            />
          </div>
        </div>
      )}
      <div className="flex w-full items-center px-[20px] py-[8px]">
        <p className="flex-1 text-[20px] leading-[24px] font-semibold text-black">
          {title}
        </p>
      </div>
      {subtitle && (
        <div className="flex w-full items-center px-[20px] py-[2px]">
          <p className={`text-[12px] leading-[15px] text-black ${subtitleWidth}`}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

/** Mint primary button (48px). */
export function PrimaryButton({
  children,
  href,
  onClick,
  className = "w-[307px]",
  disabled,
}: ButtonProps) {
  const cls = `flex h-[48px] min-h-[48px] items-center justify-center rounded-[5px] bg-mint px-[18px] py-[13px] text-center text-[14px] leading-[21px] font-bold text-black transition active:scale-[0.98] disabled:opacity-50 ${className}`;
  if (href && !disabled)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

/** Sticky bottom CTA bar (FooterButton in Figma). */
export function FooterButton({ children, href, onClick, disabled }: ButtonProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-20 flex h-[88px] w-full max-w-[393px] -translate-x-1/2 flex-col items-center border-t border-[rgba(225,232,239,0.8)] bg-[rgba(250,250,248,0.97)] px-[20px] py-[12px]">
      <PrimaryButton
        href={href}
        onClick={onClick}
        disabled={disabled}
        className="h-[52px] min-h-[52px] w-full text-ink"
      >
        {children}
      </PrimaryButton>
    </div>
  );
}
