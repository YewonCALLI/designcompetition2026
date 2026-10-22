"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { FigmaImg, Icon } from "@/components/FigmaImg";
import { ProgressSegments, Screen, TopBar } from "@/components/shell";

/* Figma 1501:2605 "sem review" — Fall 2026 Recap, slides 1501:2606 / 2660 / 2761 / 2868 */

const SLIDES = [BigPicture, WhereItWent, PlanVsReality, Receipt];

export default function RecapPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const Slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  return (
    <Screen className="pb-[72px]">
      <TopBar back="/journey" />
      <div className="flex w-full flex-col gap-[24px]">
        <div className="px-[24px] pt-[24px] pb-[8px]">
          <h1 className="h-[44px] pt-[7px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] whitespace-nowrap text-ink-2">
            Fall 2026 Recap
          </h1>
        </div>
        <div className="flex w-full justify-center px-[24px]">
          <ProgressSegments total={SLIDES.length} done={i + 1} segment="flex-1" />
        </div>
      </div>

      <div className="flex w-full justify-center px-[24px] py-[24px]">
        <div key={i} className="w-full animate-[recap-in_0.5s_cubic-bezier(0.22,1,0.36,1)]">
          <Slide />
        </div>
      </div>

      {/* Slide pager */}
      <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[393px] -translate-x-1/2 items-center justify-between bg-white px-[24px] py-[12px]">
        <button
          aria-label="Previous slide"
          disabled={i === 0}
          onClick={() => setI(i - 1)}
          className="size-[24px] transition disabled:opacity-30"
        >
          <Icon name="8bd45" className="size-[24px]" />
        </button>
        <p className="text-[10px] leading-[13.5px] text-ink">
          {i + 1}/{SLIDES.length}
        </p>
        <button
          aria-label={last ? "Finish recap" : "Next slide"}
          onClick={() => (last ? router.push("/journey") : setI(i + 1))}
          className="flex size-[24px] items-center justify-center"
        >
          <span className="flex-none rotate-180 -scale-y-100">
            <Icon name="cf3b0" className="h-[22.002px] w-[22.001px]" inset="inset-[-2.27%]" />
          </span>
        </button>
      </nav>
    </Screen>
  );
}

function Section({ tone, label, fixed = true, children }: { tone: string; label: string; fixed?: boolean; children: ReactNode }) {
  return (
    <section className={`flex w-full flex-col gap-[8px] overflow-clip rounded-[10px] p-[24px] ${fixed ? "h-[726px]" : ""} ${tone}`}>
      <div className="h-[23.75px] w-full">
        <p className="pt-[5px] text-[12px] leading-[15px] font-medium tracking-[1.1px] whitespace-nowrap text-black">{label}</p>
      </div>
      {children}
    </section>
  );
}

const H = "text-[34px] leading-[36.72px] tracking-[-1.53px] text-ink text-balance";
const BIG = "text-[52px] leading-[52px] font-bold tracking-[-3.12px] whitespace-nowrap";

/* 1 — the big picture */
function BigPicture() {
  return (
    <Section tone="bg-mint" label="the big picture">
      <div className="flex h-[365px] w-full flex-col pt-[120px]">
        <div className="flex flex-col gap-[12px]">
          <p className={`w-full ${H}`}>
            One semester.
            <br />A lot of money moves.
          </p>
          <div className="h-[70px] pt-[18px]">
            <p className={`${BIG} text-black`}>$7,700</p>
          </div>
          <p className="pt-[10px] text-[12px] leading-[15px] text-ink">
            Total resources from starting cash, family support, and campus income.
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-end overflow-clip px-[4px] py-[32px]">
        <FigmaImg name="733bc" className="h-[140.227px] w-[145.864px]" />
      </div>
    </Section>
  );
}

/* 2 — where it went */
const LEGEND = [
  { name: "Housing", amount: "$4,280", dot: "bg-ink" },
  { name: "Groceries", amount: "$1,020", dot: "bg-peri" },
  { name: "Shopping", amount: "$217", dot: "bg-white" },
  { name: "Dining & social", amount: "$612", dot: "bg-mint" },
];

function WhereItWent() {
  return (
    <Section tone="bg-peri-soft" label="where it went">
      <div className="flex w-full flex-col pt-[42px]">
        <p className={`w-full font-normal ${H}`}>Most of your money kept life running.</p>
        <p className="pt-[10px] text-[12px] leading-[15px] whitespace-nowrap text-ink">
          Housing was your largest cost, followed by groceries.
        </p>
      </div>
      {/* donut chart with its RENT / FOOD / LIFE / TV labels and "Total spent" baked in (305 × 278) */}
      <div className="flex w-full justify-center pt-[20px]">
        <FigmaImg
          name="recap-where-it-went"
          ext="png"
          alt="Total spent $6,850: rent, food, life and TV"
          className="aspect-[305/278] w-full max-w-[305px] animate-[recap-in_0.8s_cubic-bezier(0.22,1,0.36,1)]"
        />
      </div>
      <div className="grid w-full grid-cols-2 gap-y-[4px] pt-[24px]">
        {LEGEND.map((l) => (
          <div key={l.name} className="flex h-[14px] items-center gap-[4px] px-[8px]">
            <span className={`size-[10px] shrink-0 rounded-[10px] border border-[rgba(32,36,42,0.12)] ${l.dot}`} />
            <div className="flex flex-1 items-center justify-between text-[10px] leading-[13.5px] whitespace-nowrap text-ink">
              <span>{l.name}</span>
              <span className="w-[32px]">{l.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* 3 — plan vs. reality */
function PlanVsReality() {
  return (
    <Section tone="bg-peri" label="plan vs. reality">
      <div className="flex h-[220px] w-full flex-col pt-[55px]">
        <p className={`font-normal whitespace-nowrap ${H}`}>
          Your plan bent.
          <br />
          It didn’t break.
        </p>
        <div className="h-[70px] pt-[18px]">
          <p className={`${BIG} text-ink`}>$142</p>
        </div>
        <p className="pt-[10px] text-[12px] leading-[15px] whitespace-nowrap text-ink">
          under your agreed semester spending plan.
        </p>
      </div>
      <div className="w-full pt-[18px]">
        <div className="flex flex-col rounded-[10px] bg-[#f8f8f8] p-[16px]">
          <Bar label="Agreed plan" value="$6,992" width="100%" color="bg-ink" className="pt-[10px]" />
          <Bar label="Actual spending" value="$6,850" width="98.2%" color="bg-mint" className="py-[10px]" />
        </div>
      </div>
      <div className="w-full pt-[10px]">
        <div className="flex flex-col rounded-[10px] bg-mint p-[15px] font-inter text-ink">
          <p className="text-[9px] leading-[13.5px]">TV win</p>
          <p className="pt-[5px] pb-[2px] text-[20px] leading-[30px] font-bold">$31 under plan</p>
          <p className="text-[9px] leading-[13.5px] text-[#42613e]">$220 planned · $189 actual</p>
        </div>
      </div>
      <div className="flex w-full justify-center pt-[8px]">
        <Icon name="97643" className="h-[150.001px] w-[191.305px]" inset="inset-[-0.33%_-0.26%]" />
      </div>
    </Section>
  );
}

function Bar({ label, value, width, color, className }: { label: string; value: string; width: string; color: string; className: string }) {
  return (
    <div className={className}>
      <div className="flex justify-between font-inter text-ink">
        <span className="text-[9px] leading-[13.5px]">{label}</span>
        <span className="w-[33.5px] text-[10px] leading-[15px]">{value}</span>
      </div>
      <div className="mt-[5px] h-[13px] rounded-[8px]">
        <div
          className={`h-[13px] origin-left animate-[grow-x_0.9s_cubic-bezier(0.22,1,0.36,1)] rounded-[8px] ${color}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}

/* 4 — your receipt */
const IN = [
  ["Starting cash", "$1,200"],
  ["Family support", "$4,500"],
  ["Campus income", "$2,000"],
];
const OUT = [
  ["Rent & utilities", "$4,280"],
  ["Groceries", "$1,020"],
  ["Transportation", "$180"],
  ["Phone", "$160"],
  ["Subscriptions", "$192"],
  ["Dining & social", "$612"],
  ["Shopping", "$217"],
  ["TV purchase", "$189"],
];
const SUMMARY: [string, string, boolean?][] = [
  ["Agreed plan", "$6,992"],
  ["Actual spending", "$6,850"],
  ["Under plan", "$142"],
  ["ENDING CASH", "$850", true],
  ["ABOVE $400 RESERVE", "$450", true],
];

function Receipt() {
  return (
    <Section tone="bg-mint-soft" label="your receipt" fixed={false}>
      <div className="w-full pt-[4px]">
        <div className="flex items-center px-[8px]">
          <div className="flex w-full flex-col bg-white px-[20px] pt-[22px] pb-[31px] text-ink drop-shadow-[7px_8px_0px_#20242a]">
            <div className="flex flex-col items-center border-b border-dashed border-ink pb-[14px] text-center">
              <p className="text-[20px] leading-[24px] font-bold">AVIA</p>
              <p className="pt-[3px] text-[12px] leading-[15px] font-medium tracking-[1.1px]">SEMESTER RECEIPT</p>
              <p className="pt-[8px] text-[10px] leading-[13.5px]">
                Minji Kim · Fall 2026
                <br />
                August 01 — December 20
              </p>
            </div>
            <ReceiptBlock title="MONEY IN" rows={IN} total={["TOTAL RESOURCES", "$7,700"]} />
            <ReceiptBlock title="MONEY OUT" rows={OUT} total={["TOTAL SPENT", "$6,850"]} />
            <div className="flex flex-col border-b border-dashed border-ink py-[12px]">
              {SUMMARY.map(([k, v, b]) => (
                <Line key={k} k={k} v={v} bold={b} />
              ))}
            </div>
            <p className="pt-[15px] text-center text-[10px] leading-[15px] font-medium tracking-[1.1px] whitespace-nowrap">
              semester complete. ready for what’s next?
            </p>
            <div className="flex justify-center pt-[12px]">
              <div className="flex h-[58.334px] w-[54.467px] items-center justify-center">
                <FigmaImg name="18802" className="h-[57.705px] w-[53.792px] flex-none rotate-[-0.67deg]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ReceiptBlock({ title, rows, total }: { title: string; rows: string[][]; total: [string, string] }) {
  return (
    <div className="flex flex-col border-b border-dashed border-ink py-[12px]">
      <p className="text-[10px] leading-[15px] font-medium tracking-[1.1px]">{title}</p>
      <div className="pt-[7px]">
        {rows.map(([k, v]) => (
          <Line key={k} k={k} v={v} />
        ))}
      </div>
      <div className="pt-[5px]">
        <div className="border-t border-line pt-[5px]">
          <Line k={total[0]} v={total[1]} bold />
        </div>
      </div>
    </div>
  );
}

function Line({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex min-h-[18px] items-center justify-between text-[10px] leading-[13.5px] ${bold ? "font-semibold" : ""}`}>
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
