"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/FigmaImg";
import { Screen, TopBar } from "@/components/shell";
import { fmtDate, TRAVEL_STYLES, useApp } from "@/lib/store";

/* Figma 1501:3815 "travel 2" — compare travel options: tell us about the trip */

export default function TravelFormPage() {
  const { travel, setTravel } = useApp();
  const toggleStyle = (s: string) =>
    setTravel({ styles: travel.styles.includes(s) ? travel.styles.filter((x) => x !== s) : [...travel.styles, s] });

  return (
    <Screen>
      <TopBar back="/compare" backIcon="c00f9" />
      <h1 className="mt-[14px] px-[24px] text-[20px] leading-[24px] font-semibold text-black">Compare Travel Options</h1>
      <div className="mx-[24px] mt-[27px] h-[114px]">
        <Icon name="59b14" className="size-full" inset="inset-[-0.79%_-0.26%]" />
      </div>

      <div className="mt-[33px] flex flex-col gap-[9px] px-[24px]">
        <Field title="Travel place" sub="Where are you planning to travel?" glyph={<Icon name="57fef" className="absolute top-[11px] left-[8px] h-[15.6px] w-[21.396px]" />}>
          <div className="mt-[4px] flex items-center">
            <Pill value={travel.from} label="From" onChange={(v) => setTravel({ from: v })} />
            <span className="w-[27px] pl-[8px] text-[11px] text-black/35">to</span>
            <Pill value={travel.to} label="To" onChange={(v) => setTravel({ to: v })} />
          </div>
        </Field>

        <Field title="Travel dates" sub="Whn are you planning to travel?" glyph={<Icon name="adc2c" className="absolute top-[9px] left-[9px] size-[20px]" inset="inset-[-2.5%]" />}>
          <div className="mt-[4px] flex items-center">
            <DatePill value={travel.start} label="Start date" onChange={(v) => setTravel({ start: v })} />
            <span className="w-[27px] pl-[8px] text-[11px] text-black/35">to</span>
            <DatePill value={travel.end} label="End date" onChange={(v) => setTravel({ end: v })} />
          </div>
        </Field>

        <Field title="Who is traveling?" sub="How many people?" glyph={<Icon name="2ac00" className="absolute top-[12px] left-[10px] h-[18.2px] w-[18.154px]" inset="inset-[-1.79%]" />}>
          <div className="mt-[10px] ml-[4px] flex items-center gap-[9px]">
            <button
              aria-label="Fewer people"
              onClick={() => setTravel({ people: Math.max(1, travel.people - 1) })}
              className="relative h-[17px] w-[18px] rounded-[4px] bg-[#f4f3f3]"
            >
              <Icon name="a4a64" className="absolute top-[8.5px] left-[6px] h-0 w-[6px]" inset="inset-[-0.35px_-5.89%]" />
            </button>
            <span className="w-[7px] text-[11px] text-black" aria-live="polite">
              {travel.people}
            </span>
            <button
              aria-label="More people"
              onClick={() => setTravel({ people: Math.min(9, travel.people + 1) })}
              className="relative h-[17px] w-[18px] rounded-[4px] bg-[#f4f3f3]"
            >
              <Icon name="4448c" className="absolute top-[6px] left-[6px] size-[6px]" inset="inset-[-6.25%]" />
            </button>
          </div>
        </Field>

        <Field title="Travel style" sub="What matters most?" tall glyph={<Icon name="fd27c" className="absolute top-[10px] left-[15px] h-[18px] w-[9px]" inset="inset-[-2.78%_-5.56%]" />}>
          <div className="mt-[5px] flex w-[215px] flex-wrap gap-x-[4px] gap-y-[5px]">
            {TRAVEL_STYLES.map((s) => {
              const on = travel.styles.includes(s);
              return (
                <button
                  key={s}
                  aria-pressed={on}
                  onClick={() => toggleStyle(s)}
                  className={`h-[25px] rounded-[10px] px-[9px] text-[11px] whitespace-nowrap text-black/55 transition-colors ${
                    on ? "bg-peri" : "bg-[#f4f3f3]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Field>

        <Link
          href="/compare/travel/summary"
          className="mt-[5px] flex h-[42px] w-full items-center justify-center rounded-[10px] bg-mint font-inter text-[14px] font-bold text-black transition active:scale-[0.98]"
        >
          See Travel Options
        </Link>
      </div>
    </Screen>
  );
}

function Field({ title, sub, glyph, tall, children }: { title: string; sub: string; glyph: ReactNode; tall?: boolean; children: ReactNode }) {
  return (
    <section className={`relative w-full rounded-[10px] border border-[#e8e8e8] bg-white pr-[12px] pb-[12px] pl-[67px] ${tall ? "min-h-[129px]" : "min-h-[96px]"}`}>
      <span className="absolute top-[18px] left-[15px] size-[38px]">
        <Icon name="bb312" className="absolute inset-0" />
        {glyph}
      </span>
      <p className="pt-[18px] text-[13px] font-bold text-[#19213b]">{title}</p>
      <p className="text-[11px] text-[#75809b]">{sub}</p>
      {children}
    </section>
  );
}

function Pill({ value, label, onChange }: { value: string; label: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className="h-[25px] w-[101px] rounded-[10px] bg-[#f4f3f3] px-[9px] text-[11px] text-black/55 outline-none focus:ring-1 focus:ring-peri"
    />
  );
}

function DatePill({ value, label, onChange }: { value: string; label: string; onChange: (v: string) => void }) {
  return (
    <label className="relative flex h-[25px] w-[101px] items-center rounded-[10px] bg-[#f4f3f3] px-[9px] text-[11px] whitespace-nowrap text-black/55 focus-within:ring-1 focus-within:ring-peri">
      {fmtDate(value)}
      <input
        type="date"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}
