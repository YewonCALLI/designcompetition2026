"use client";

import Link from "next/link";
import { useState } from "react";
import { FooterButton, Screen, StepHeader, TopBar } from "@/components/shell";
import { CurrencyToggle, DualAmount, type CurrencyMode } from "@/components/ui";
import { KRW_PER_USD, krw, useApp, usd } from "@/lib/store";

/* Figma 1491:841 — "review your starting point" (step 4) */

export default function ReviewPage() {
  const { totals: t } = useApp();
  const [mode, setMode] = useState<CurrencyMode>("Both");
  const show = (n: number) => (mode === "KRW" ? krw(n) : usd(n));

  const tiles = [
    { label: "Essentials", value: t.essentials, hint: "Rent, utilities, food, travel, phone" },
    { label: "Lifestyle", value: t.lifestyle, hint: "Dining, social, and shopping" },
    { label: "Subscriptions", value: t.subscriptions, hint: "Recurring digital services" },
    { label: "One-time goals", value: t.oneTime, hint: "TV for the apartment, Spring Break Trip" },
  ];

  return (
    <Screen>
      <TopBar back={true} />
      <div className="flex w-full flex-col gap-[40px]">
        <StepHeader
          step={4}
          progress={199}
          title="Review your starting point"
          subtitle="Make sure the big numbers feel right"
        />

        <div className="flex w-full flex-col gap-[12px]">
          <div className="mx-auto flex min-h-[58px] w-[353px] flex-col gap-[12px] rounded-[5px] bg-peri-soft px-[12px] py-[10px]">
            <div className="flex w-full items-start justify-between">
              <p className="text-[12px] leading-[15px] text-ink">View amounts in</p>
              <span className="rounded-[8px] bg-mint px-[8px] py-[4px] text-[12px] leading-[15px] text-black">
                Current rate: $1 = ₩{KRW_PER_USD.toLocaleString("en-US")}
              </span>
            </div>
            <CurrencyToggle value={mode} onChange={setMode} />
          </div>

          <div className="px-[24px]">
            <DualAmount
              amount={t.resources}
              mode={mode}
              line="4e25a"
              label={
                <p className="text-[11px] leading-[16.5px] whitespace-nowrap text-ink uppercase">
                  expected semester resources
                </p>
              }
            />
          </div>
        </div>

        <section className="mx-auto flex w-[353px] flex-col rounded-[5px] border border-line bg-white p-[18px]">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col">
              <p className="pt-[7px] pb-[3.5px] text-[12px] leading-[13.5px] tracking-[0.9px] text-black uppercase">
                at a glance
              </p>
              <p className="pt-[3px] text-[16px] leading-[22px] font-semibold tracking-[-0.35px] whitespace-nowrap text-ink">
                Your balanced starting point
              </p>
            </div>
            <Link
              href="/plan/build"
              className="flex min-h-[36px] min-w-[52px] items-center justify-center rounded-[10px] border border-peri bg-peri-soft text-[10px] leading-[15px] text-ink"
            >
              Edit
            </Link>
          </div>

          <div className="mt-[18px] flex w-full items-center justify-between rounded-[14px] bg-peri p-[15px]">
            <p className="text-[12px] leading-[15px] text-ink">Planned semester spending</p>
            <p className="text-right text-[18px] leading-[27px] font-bold text-ink">{show(t.spending)}</p>
          </div>

          <div className="mt-[12px] grid grid-cols-2 gap-px overflow-clip rounded-[14px] border border-line bg-line">
            {tiles.map((tile) => (
              <div key={tile.label} className="flex min-h-[108px] flex-col bg-white p-[13px]">
                <p className="text-[12px] leading-[15px] text-muted-2">{tile.label}</p>
                <p className="py-[4px] text-[16px] leading-[22px] font-semibold tracking-[-0.35px] text-ink">
                  {show(tile.value)}
                </p>
                <p className="mt-auto text-[10px] leading-[15px] text-muted-2">{tile.hint}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-[20px] grid grid-cols-2 rounded-[5px] border border-peri bg-peri-soft p-[18px]">
          <div className="flex flex-col">
            <p className="text-[12px] leading-[15px] text-ink">Projected ending cash</p>
            <p className="pt-[4px] text-[18px] leading-[27px] font-bold text-ink">{show(t.ending)}</p>
          </div>
          <div className="flex flex-col border-l border-[rgba(32,36,42,0.16)] pl-[16px]">
            <p className="text-[12px] leading-[15px] text-ink">Protected reserve</p>
            <p className="pt-[4px] text-[18px] leading-[27px] font-bold text-ink">{show(t.reserve)}</p>
          </div>
          <p className="col-span-2 mt-[16px] border-t border-[rgba(32,36,42,0.16)] pt-[13px] text-[12px] leading-[15px] text-ink">
            {t.aboveReserve >= 0
              ? `Your starting point leaves ${show(t.aboveReserve)} above your reserve.`
              : `Your starting point dips ${show(-t.aboveReserve)} below your reserve.`}
          </p>
        </section>
      </div>
      <FooterButton href="/plan/options">See my 3 plans</FooterButton>
    </Screen>
  );
}
