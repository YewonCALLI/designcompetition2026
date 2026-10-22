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
  backIcon = "8bd45",
}: {
  back?: string | true;
  right?: ReactNode;
  /** the travel screens export a slightly different arrow (c00f9) */
  backIcon?: string;
}) {
  return (
    // Spacer keeps the layout height; the bar itself stays fixed at the top.
    <div className="h-[55.5px] w-full shrink-0">
      <div className="fixed top-0 left-1/2 z-30 w-full max-w-[393px] -translate-x-1/2 bg-app">
        <TopBarContent back={back} right={right} backIcon={backIcon} />
      </div>
    </div>
  );
}

function TopBarContent({
  back,
  right,
  backIcon,
}: {
  back?: string | true;
  right?: ReactNode;
  backIcon: string;
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
    <div className="flex w-full items-center justify-between px-[24px] py-[12px]">
      {back === true ? (
        <button aria-label="Back" onClick={() => router.back()}>
          <Icon name={backIcon} className="size-[24px]" />
        </button>
      ) : (
        <Link aria-label="Back" href={back}>
          <Icon name={backIcon} className="size-[24px]" />
        </Link>
      )}
      <Logo />
      <div className="flex size-[24px] items-center justify-center">{right}</div>
    </div>
  );
}

/** Row of thin segment bars: the planning steps (5 × 67px) and the recap slides (4, flexible). */
export function ProgressSegments({
  total,
  done,
  segment = "w-[67px]",
}: {
  total: number;
  done: number;
  segment?: string;
}) {
  return (
    <div className="flex w-full items-start gap-[5px]" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-[3px] rounded-[99px] transition-colors duration-500 ${segment} ${i < done ? "bg-peri" : "bg-track"}`}
        />
      ))}
    </div>
  );
}

/** Segmented step progress + title + subtitle used in the planning flow. */
export function StepHeader({
  step,
  title,
  subtitle,
  subtitleWidth = "w-[278px]",
}: {
  /** filled segments out of 5 */
  step?: number;
  title: ReactNode;
  subtitle?: ReactNode;
  subtitleWidth?: string;
}) {
  return (
    <div className="flex w-full flex-col items-start">
      {step !== undefined && (
        <div className="flex w-full flex-col items-center px-[24px] py-[24px]">
          <ProgressSegments total={5} done={step} />
        </div>
      )}
      <div className="flex w-full items-center px-[24px] py-[8px]">
        <p className="flex-1 text-[20px] leading-[24px] font-semibold text-black">{title}</p>
      </div>
      {subtitle && (
        <div className="flex w-full items-center px-[24px] py-[2px]">
          <p className={`text-[12px] leading-[15px] text-black ${subtitleWidth}`}>{subtitle}</p>
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
    <div className="fixed bottom-0 left-1/2 z-20 flex h-[88px] w-full max-w-[393px] -translate-x-1/2 flex-col items-center border-t border-[rgba(225,232,239,0.8)] bg-[rgba(250,250,248,0.97)] px-[24px] py-[12px]">
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
