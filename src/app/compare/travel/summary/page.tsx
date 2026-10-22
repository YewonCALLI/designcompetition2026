"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FigmaImg, Icon } from "@/components/FigmaImg";
import { Screen, TopBar } from "@/components/shell";
import { fmtTripRange, TRIP_GOAL, TRIP_SAVED, useApp } from "@/lib/store";

/* Figma 1501:3891 "travel 3" — trip goal, current savings and preferences */

const SAVED = TRIP_SAVED;
const GOAL = TRIP_GOAL;

export default function TravelSummaryPage() {
  const { travel } = useApp();
  const pct = SAVED / GOAL;
  const prefs: { title: string; value: string; glyph: ReactNode }[] = [
    {
      title: "Travel dates",
      value: fmtTripRange(travel.start, travel.end),
      glyph: <Icon name="adc2c" className="absolute top-[9px] left-[9px] size-[20px]" inset="inset-[-2.5%]" />,
    },
    {
      title: "Who is traveling?",
      value: `${travel.people} ${travel.people === 1 ? "person" : "friends"}`,
      glyph: <Icon name="2ac00" className="absolute top-[11px] left-[10px] h-[18.2px] w-[18.154px]" inset="inset-[-1.79%]" />,
    },
    {
      title: "What matters most?",
      value: travel.styles.length ? travel.styles.map((s) => s.replace(" friendly", "-friendly")).join(" · ") : "Anything goes",
      glyph: <Icon name="fd27c" className="absolute top-[10px] left-[15px] h-[18px] w-[9px]" inset="inset-[-2.78%_-5.56%]" />,
    },
  ];

  return (
    <Screen>
      <TopBar back="/compare/travel" backIcon="c00f9" />
      <h1 className="mt-[14px] px-[24px] text-[20px] leading-[24px] font-semibold text-black">Compare Travel Options</h1>

      <div className="mt-[14px] flex flex-col px-[24px]">
        {/* Trip goal */}
        <section className="relative h-[187px] w-full overflow-hidden rounded-[10px] border border-[#c2bfbf] bg-[#f8f8f7]">
          <div className="absolute top-[26px] right-[8.5px] left-[13px] h-[158px] overflow-hidden opacity-86">
            <FigmaImg
              name="b423b"
              ext="png"
              alt="New York City skyline"
              className="absolute top-[-10.76%] left-[-0.07%] h-[117.72%] w-[100.15%]"
            />
          </div>
          <p className="absolute top-[17px] left-[14px] font-inter text-[10px] font-bold text-[#a7b5d6]">YOUR TRIP GOAL</p>
          <p className="absolute top-[25px] left-[14px] font-inter text-[36px] font-bold whitespace-nowrap text-peri [text-shadow:0px_1px_4px_rgba(0,0,0,0.25)]">
            NYC Fall Break
          </p>
        </section>

        {/* Current savings */}
        <section className="relative mt-[17px] h-[151px] w-full rounded-[10px] border border-[#f1efef] bg-white">
          <Icon name="fc22c" className="absolute top-[16.9px] left-[15.9px] h-[33.751px] w-[32.758px]" />
          <Icon name="f2c2a" className="absolute top-[26.2px] left-[22.8px] h-[14.932px] w-[20.213px]" inset="inset-[-1.43%_0_0_0]" />
          <p className="absolute top-[25px] left-[59.6px] text-[13.897px] font-bold text-[#24283d]">Your Current Savings</p>
          <Icon name="eff8b" className="absolute top-[62.5px] right-[17.5px] left-[15.9px] h-0" inset="inset-[-0.5px_0]" />
          <p className="absolute top-[72px] left-[16px] text-[20px] font-bold whitespace-nowrap text-[#24283d]">
            ${SAVED} saved of ${GOAL} goal
          </p>
          <div className="absolute top-[108px] right-[16px] left-[16px] h-[7px] overflow-hidden rounded-[12px] bg-track">
            <div className="h-full origin-left animate-[grow-x_0.9s_cubic-bezier(0.22,1,0.36,1)] rounded-[12px] bg-peri" style={{ width: `${(SAVED / GOAL) * 100}%` }} />
          </div>
          <p className="absolute top-[118px] left-[16px] text-[11px] leading-[16.5px] text-[#737373]">Semester spending progress</p>
          <p className="absolute top-[118px] right-[16px] text-[11px] leading-[16.5px] font-semibold text-ink">
            {Math.round(pct * 100)}% Saved
          </p>
        </section>

        {/* Extra savings */}
        <section className="mt-[9px] h-[69px] w-full rounded-[10px] border border-[#f1efef] bg-[#e7eefd] px-[16px] pt-[9px]">
          <p className="text-[13px] font-bold text-black">You saved an extra $320</p>
          <p className="mt-[3px] text-[11px] text-[#75809b]">
            $180 less on groceries + $140 on lifestyle
            <br />
            Additional savings are included in your ${SAVED} total.
          </p>
        </section>

        <h2 className="mt-[18px] text-[20px] leading-[24px] font-semibold text-black">Your Preferences</h2>

        <div className="mt-[17px] flex flex-col gap-[10px]">
          {prefs.map((p) => (
            <Link
              key={p.title}
              href="/compare/travel"
              className="relative h-[73px] w-full rounded-[10px] bg-white transition active:scale-[0.99]"
            >
              <span className="absolute top-[18px] left-[15px] size-[38px]">
                <Icon name="bb312" className="absolute inset-0" />
                {p.glyph}
              </span>
              <span className="absolute top-[18px] left-[67px] text-[13px] font-bold text-[#19213b]">{p.title}</span>
              <span className="absolute top-[42px] left-[67px] max-w-[250px] truncate text-[11px] text-[#75809b]">{p.value}</span>
              <Icon name="1b5b6" className="absolute top-[30px] right-[16px] h-[14px] w-[7px]" inset="inset-[-7.14%_-14.29%]" />
            </Link>
          ))}
        </div>

        <Link
          href="/compare/travel/options"
          className="mt-[13px] flex h-[42px] w-full items-center justify-center rounded-[10px] bg-mint font-inter text-[14px] font-bold text-black transition active:scale-[0.98]"
        >
          Compare plans
        </Link>
      </div>
    </Screen>
  );
}
