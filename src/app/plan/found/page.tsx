"use client";

import { FooterButton, Screen, StepHeader, TopBar } from "@/components/shell";
import { usd } from "@/lib/store";

/* Figma 1501:1723 — "onboarding 2": here’s what we found (after connecting a bank) */

const FOUND = [
  { name: "Housing & bills", amount: 1110, bar: 208, color: "bg-peri" },
  { name: "Groceries", amount: 305, bar: 57, color: "bg-mint" },
  { name: "Lifestyle", amount: 230, bar: 43, color: "bg-peri" },
  { name: "Subscriptions", amount: 48, bar: 9, color: "bg-mint" },
];

export default function FoundPage() {
  const total = FOUND.reduce((s, f) => s + f.amount, 0);
  return (
    <Screen>
      <TopBar back="/plan" />
      <div className="flex w-full flex-col gap-[40px]">
        <StepHeader
          step={2}
          title="Here’s what we found"
          subtitle="AI-Assisted review of your transaction history."
        />

        <div className="flex w-full flex-col items-center gap-[16px] px-[24px]">
          <div className="flex w-full items-center justify-between rounded-[5px] border border-white/90 bg-peri p-[20px] drop-shadow-[0px_14px_16px_rgba(75,98,125,0.09)]">
            <div className="flex w-[158px] flex-col">
              <p className="pt-[7.5px] pb-[1.5px] text-[12px] leading-[15px] font-medium tracking-[1.1px] whitespace-nowrap text-black">
                ESTIMATED MONTHLY PATTERN
              </p>
              <p className="h-[43px] pt-[4px] pb-[2px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] whitespace-nowrap text-black">
                {usd(total)}
              </p>
              <p className="pt-[6.5px] pb-[4px] text-[10px] leading-[13.5px] whitespace-nowrap text-black">
                Across 10 recognized expenses
              </p>
            </div>
            <div className="grid size-[86px] shrink-0 place-items-center rounded-[43px] shadow-[0px_0px_0px_5px_rgba(255,255,255,0.3)]">
              <div className="flex size-[54px] items-center justify-center rounded-[27px] bg-white p-[4px]">
                <p className="text-center text-[11px] leading-[19px] font-bold text-ink">{usd(total)}</p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col rounded-[22px] p-[17px] drop-shadow-[0px_8px_12.5px_rgba(68,88,112,0.04)]">
            <p className="text-[12px] leading-[15px] font-medium tracking-[1.1px] text-muted">AT A GLANCE</p>
            <p className="pt-px text-[16px] leading-[22px] font-semibold tracking-[-0.35px] text-ink">
              Where it usually goes
            </p>
            <div className="mt-[15px] flex flex-col gap-[12px]">
              {FOUND.map((f) => (
                <div key={f.name} className="flex h-[26px] flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[6px]">
                      <span className={`size-[7px] rounded-[3.5px] ${f.color}`} />
                      <span className="text-[10px] leading-[13.5px] text-muted">{f.name}</span>
                    </div>
                    <span className="text-[10px] leading-[15px] font-bold text-black">{usd(f.amount)}</span>
                  </div>
                  <div className="mt-[5px] h-[6px] w-full overflow-clip rounded-[99px] bg-track">
                    <div className={`h-[6px] min-w-[4px] rounded-[99px] ${f.color}`} style={{ width: f.bar }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterButton href="/plan/build">Use this as my starting point</FooterButton>
    </Screen>
  );
}
