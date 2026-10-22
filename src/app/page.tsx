"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { FigmaImg, Icon } from "@/components/FigmaImg";
import { PrimaryButton, Screen, TopBar } from "@/components/shell";
import { FooterNav, MoneyField } from "@/components/ui";
import { krw, useApp, usd, type Stage } from "@/lib/store";
import { useStepReveal } from "@/lib/useStepReveal";

export default function HomePage() {
  const { stage } = useApp();
  return (
    <Screen>
      <TopBar />
      <HomeHeader />
      {stage === "before" ? <BeforePlanning /> : <DuringSemester />}
      <FooterNav />
    </Screen>
  );
}

/* Avatar + greeting + demo stage switch + currency / linked parent row */
function HomeHeader() {
  const { stage, setStage } = useApp();
  return (
    <>
      <div className="flex w-full items-end justify-between px-[24px] pt-[24px] pb-[8px]">
        <div className="flex items-end gap-[12px]">
          <Avatar />
          <h1 className="h-[44px] pt-[7px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] whitespace-nowrap text-ink-2">
            Hi, Minji.
          </h1>
        </div>
        {/* DemoControl — switches which point of the story the app shows */}
        <label className="relative mb-[2px] flex h-[22.6px] w-[108px] items-center overflow-clip rounded-[7px] bg-[#f3f3f3]">
          <span className="sr-only">Demo stage</span>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as Stage)}
            className="h-full w-full cursor-pointer appearance-none bg-transparent pr-[22px] pl-[10px] font-inter text-[8px] text-ink-2 outline-none"
          >
            <option value="before">Before semester</option>
            <option value="during">During semester</option>
            <option value="end">End of semester</option>
          </select>
          <span className="pointer-events-none absolute top-0 right-0 flex h-full w-[20px] items-center justify-center">
            <Icon name="822c8" className="h-[6px] w-[10px]" />
          </span>
        </label>
      </div>

      <div className="flex w-full items-center justify-between px-[24px] py-[12px]">
        <div className="flex w-[190px] items-center gap-[4px]">
          <Icon
            name={stage === "before" ? "8ba07" : "ac808"}
            className="h-[18.772px] w-[15.726px]"
            inset="inset-[-2.66%_-3.18%_-1.37%_0]"
          />
          <div className="flex w-[74px] flex-col items-start leading-[15px]">
            <p className="w-full text-[12px] font-bold text-ink">KRW</p>
            <p className="w-full text-center text-[10px] text-muted">Home Currency</p>
          </div>
        </div>
        <Link href="/family" className="flex items-center gap-[4px] rounded-[5px] bg-mint px-[4px] py-[2px]">
          <Icon name="e8f4d" className="h-[16px] w-[14px]" />
          <span className="text-[10px] leading-[15px] font-medium text-ink">HyunWoo Kim</span>
        </Link>
      </div>
    </>
  );
}

/* ───────────── Figma 1501:1518 — first page, before planning ───────────── */

function BeforePlanning() {
  return (
    <>
      <div className="flex w-full justify-center px-[24px] py-[24px]">
        <div className="relative flex h-[417px] w-full flex-col justify-end gap-[10px] py-[17px]">
          <Icon name="84f8c" className="absolute inset-0" inset="inset-[-4.8%_-10.2%_-12.47%_-10.2%]" />
          <div className="relative flex w-full flex-col gap-[12px]">
            <div className="flex flex-col">
              <p className="px-[20px] text-[11px] leading-[16px] font-bold tracking-[1.1px] whitespace-nowrap text-[#65739e]">
                YOUR FIRST PLAN
              </p>
              <p className="px-[20px] pt-[7px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] text-ink">
                Fall Semester is
                <br />
                starting soon
              </p>
            </div>
            <div className="flex flex-col items-center py-[12px]">
              <PrimaryButton href="/plan">Plan My Semester</PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[12px] px-[24px] py-[28px]">
        <div className="flex w-full justify-center">
          <div className="size-[58px] animate-pulse rounded-[29px] border-[8px] border-mint" />
        </div>
        <p className="text-center text-[16px] leading-[22px] text-muted">Your patterns will appear here</p>
      </div>
    </>
  );
}

/* ───────────── Figma 1501:1271 — Home, during the semester ───────────── */

const SPENDING = [
  { name: "Housing", pct: 62, amount: 1550, dot: "1ca5f" },
  { name: "Groceries", pct: 13, amount: 325, dot: "4e3fb" },
  { name: "Lifestyle", pct: 22, amount: 545, dot: "d7bae" },
  { name: "Subscriptions", pct: 3, amount: 80, dot: "b5982" },
];

const MONTH_NOTES: Record<string, { title: string; body: string }> = {
  Sep: {
    title: "September wrapped!",
    body: "Rent paid on time and $120 under your grocery plan. That went straight to the trip fund.",
  },
  Oct: {
    title: "You are in October!",
    body: "Your fall-break trip is getting closer. Explore how your choices affect your savings.",
  },
  Nov: {
    title: "Coming up in November",
    body: "Lifestyle budget is a little lower after the laptop repair. Your monthly check-in opens Nov 1.",
  },
  Dec: {
    title: "December · finish line",
    body: "Semester review unlocks Dec 20 — see what you planned, what changed, and what carried you.",
  },
};
const MONTHS = ["Sep", "Oct", "Nov", "Dec"] as const;
/** dot centres inside the 350px timeline card (design px); the track runs 21 → 326 */
const MONTH_X = [23.3, 128, 233.8, 326.8];
/** how far along the (fluid) track each month sits */
const frac = (i: number) => (MONTH_X[i] - 21) / 305;

function DuringSemester() {
  const { stage, money, setMoney } = useApp();
  const [range, setRange] = useState<"Monthly" | "Semester">("Monthly");
  const [month, setMonth] = useState<(typeof MONTHS)[number]>(stage === "end" ? "Dec" : "Oct");
  const mult = range === "Monthly" ? 1 : 4;
  const balance = 7500;
  const note = MONTH_NOTES[month];
  const mi = MONTHS.indexOf(month);

  const root = useRef<HTMLDivElement>(null);
  useStepReveal(root, 160, stage);

  return (
    <div ref={root} className="flex w-full flex-col gap-[12px]">
      {/* Date chip */}
      <div className="flex items-center gap-[5px] px-[24px]">
        <Icon name="efb57" className="h-[14px] w-[13.964px]" inset="inset-[-3.57%_-3.58%]" />
        <button className="flex h-[18.9px] w-[84px] items-center gap-[3px] rounded-[4px] bg-[#e8e8e8] px-[4px] pt-px drop-shadow-[0px_1.05px_2.1px_rgba(0,0,0,0.25)]">
          <span className="font-inter text-[11px] leading-[16.5px] font-extrabold whitespace-nowrap text-black">
            {stage === "end" ? "Dec 1, 2026" : "Oct 1, 2026"}
          </span>
          <Icon name="26be8" className="size-[11px]" />
        </button>
      </div>

      <div className="flex w-full flex-col items-center gap-[24px] px-[24px]">
        {/* Current balance card */}
        <section
          data-step=""
          className="step relative h-[215px] w-full rounded-[10px] border border-line bg-white pt-[9px] pr-[15px] pb-[24px] pl-[16px]"
        >
          <div className="absolute top-[35px] right-[25px] left-[16px] flex flex-col gap-[13px]">
            <div className="flex flex-col gap-[5px]">
              <p className="text-[10px] leading-[13.5px] text-[#737373]">Current Balance</p>
              <div className="flex flex-col gap-[11px]">
                <p className="text-[52px] leading-[36.72px] font-[760] tracking-[-1.53px] text-ink-2">{usd(balance)}</p>
                <p className="text-[15px] leading-[16.5px] text-[#737373]">≈ {krw(balance)} KRW</p>
              </div>
            </div>
            <div className="h-[13px] w-full overflow-hidden rounded-[12px] bg-track">
              <div className="h-full w-[125px] rounded-[12px] bg-mint" />
            </div>
            <div className="flex items-start justify-between text-[10px] whitespace-nowrap">
              <p className="leading-[13.5px] text-[#737373]">Semester spending progress</p>
              <p className="leading-[15px] font-bold text-ink">40% used</p>
            </div>
          </div>
          {/* oc-target illustration + "On track!" */}
          <div className="absolute top-[9px] right-[16.7px] flex h-[69.704px] w-[78.301px] items-center justify-center">
            <div className="flex-none rotate-[16.96deg]">
              <div className="relative h-[52.817px] w-[65.751px] overflow-clip">
                <div
                  className="absolute inset-[6.33%_32.99%_9.43%_3.71%] flex items-center justify-center"
                  style={{ containerType: "size" }}
                >
                  <div className="h-[hypot(25.6913cqw,78.7915cqh)] w-[hypot(74.3087cqw,-21.2085cqh)] flex-none rotate-[-16.96deg]">
                    <FigmaImg name="46ded" className="size-full" />
                  </div>
                </div>
                <Icon name="0abc4" className="absolute inset-[1.83%_0.94%_0_0]" inset="inset-[-1.94%_-1.54%_0_0]" />
              </div>
            </div>
          </div>
          <div className="absolute top-[67.2px] right-[21.85px] flex h-[18.794px] w-[63.453px] items-center justify-center">
            <p className="h-[11.857px] w-[62.518px] flex-none rotate-[-6.44deg] font-inter text-[12.688px] leading-[10.468px] font-extrabold text-black">
              On track!
            </p>
          </div>
        </section>

        {/* Monthly / Semester */}
        <div data-step="" className="step grid h-[38px] w-full grid-cols-2 rounded-[10px] bg-[#f3f3f3] p-[3px]">
          {(["Monthly", "Semester"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`flex min-h-[32px] items-center justify-center rounded-[8px] px-[8px] text-[10px] leading-[13.5px] font-semibold transition-colors ${
                range === r ? "bg-mint text-ink-2" : "bg-white/10 text-[#737373]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Spending by category */}
        <div data-step="" className="step flex w-full flex-col gap-[15px]">
          <p className="text-[12px] leading-[15px] text-[#737373]">
            Your {range === "Monthly" ? "monthly" : "semester"} spending based on category
          </p>
          <section className="flex items-center justify-between rounded-[10px] bg-white px-[12px] py-[24px]">
            <div className="flex w-[131.672px] flex-col items-center gap-[10px]">
              <div className="relative h-[129px] w-[128.672px]">
                <FigmaImg name="cade1" className="absolute inset-0 size-full" />
                <div className="absolute top-[44px] left-[34px] flex w-[61px] flex-col items-center text-center text-[11px] leading-[19px] font-bold whitespace-nowrap text-ink">
                  <p>Total spent</p>
                  <p>{usd(2500 * mult)}</p>
                </div>
              </div>
              <p className="w-full text-center text-[11px] leading-[16.5px] text-[#737373]">
                {stage === "end" ? "December Remaining" : "October Remaining"}
              </p>
            </div>
            <div className="relative h-[128px] w-[176px]">
              {SPENDING.map((s, i) => (
                <div key={s.name} className="absolute right-0 left-0 flex h-[23px] items-center" style={{ top: i * 35 }}>
                  <FigmaImg name={s.dot} className="size-[23px] shrink-0" />
                  <span className="ml-[8px] text-[11px] leading-[19px] font-bold text-black">{s.name}</span>
                  <span className="ml-[6px] text-[11px] leading-[19px] font-bold text-[#959595]">{s.pct}%</span>
                  <span className="ml-auto text-[11px] leading-[19px] font-bold text-black">{usd(s.amount * mult)}</span>
                </div>
              ))}
              {/* category glyphs drawn over the legend dots */}
              <Icon name="2d46c" className="absolute top-[5px] left-[4.53px] h-[12px] w-[13.466px]" inset="inset-[-4.69%_-4.18%]" />
              <Icon name="3d4f7" className="absolute top-[12.5px] left-[9.02px] h-[4.5px] w-[4.489px]" inset="inset-[-12.5%_-12.53%]" />
              <Icon name="b4dc0" className="absolute top-[42px] left-[4.53px] h-[10.909px] w-[11.97px]" inset="inset-[-4.58%_-4.18%]" />
              <Icon name="2c09c" className="absolute top-[75.93px] left-[6.34px] h-[11.643px] w-[10.162px]" inset="inset-[-4.17%_-4.77%]" />
              <Icon name="d9ac7" className="absolute top-[111px] left-[6.53px] h-[11.25px] w-[9.975px]" inset="inset-[-4.17%_-4.7%]" />
            </div>
          </section>
        </div>

        {/* Month timeline */}
        <section data-step="" className="step relative h-[168px] w-full rounded-[10px] border border-track bg-white">
          <Icon name="7d420" className="absolute top-[45px] right-[24px] left-[21px] h-0" inset="inset-[-3px_-0.98%]" />
          {/* progress fill: runs from Sep to the selected month */}
          <div
            aria-hidden
            className="absolute top-[42px] left-[21px] h-[6px] rounded-full bg-[linear-gradient(90deg,#6f7cf7,#8f99fb_55%,#b5c9ff)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `calc(${frac(mi)} * (100% - 45px))` }}
          />
          {MONTHS.map((m, i) => {
            const active = m === month;
            const done = i < mi;
            return (
              <button
                key={m}
                aria-label={m}
                aria-pressed={active}
                onClick={() => setMonth(m)}
                className="absolute top-[31px] flex h-[50px] w-[44px] -translate-x-1/2 flex-col items-center"
                style={{ left: `calc(21px + ${frac(i)} * (100% - 45px))` }}
              >
                <span
                  className={`relative transition-all duration-300 ${active ? "size-[26px]" : "mt-[6.7px] size-[12.6px]"}`}
                >
                  <FigmaImg name={active ? "5134b" : done ? "25101" : "9488c"} className="size-full" />
                </span>
                <span className="absolute top-[30px] text-[11px] leading-[19px] font-bold text-black">{m}</span>
              </button>
            );
          })}
          <div className="absolute top-[94px] right-[15px] left-[15px] font-inter text-[#737373]">
            <p className="flex items-center gap-[6px] text-[14px] leading-[16.5px] font-bold text-black">
              {note.title}
              {mi === 1 && <Icon name="dd903" className="size-[16px]" inset="inset-[4.69%_6.19%_3.18%_4.69%]" />}
            </p>
            <p className="mt-[3px] text-[11px] leading-[16.5px]">{note.body}</p>
          </div>
        </section>

        {/* Check next */}
        <article
          data-step=""
          className="step flex h-[85.967px] w-full items-center justify-between rounded-[10px] bg-peri p-[17px]"
        >
          <div className="flex w-[157.773px] flex-col">
            <p className="pt-[7px] font-inter text-[8px] leading-[12px] tracking-[0.56px] text-ink-2 uppercase">
              Check next
            </p>
            <p className="pt-[8px] font-inter text-[16px] leading-[24px] whitespace-nowrap text-ink-2">
              {stage === "end" ? "Semester Recap" : "Compare Options"}
            </p>
          </div>
          <Link
            href={stage === "end" ? "/recap" : "/compare"}
            className="flex min-h-[39px] items-center justify-center rounded-[10px] bg-mint px-[17px] font-inter text-[13px] leading-[19.5px] font-[750] text-ink-2 transition active:scale-[0.97]"
          >
            Open
          </Link>
        </article>

        {/* Upcoming bills */}
        <div data-step="" className="step flex w-full flex-col items-center gap-[10px]">
          <p className="w-full text-[20px] leading-[24px] font-semibold text-ink-2">Upcoming Bills</p>
          <div className="flex w-full flex-col overflow-clip rounded-[5px] border border-line bg-white px-[18px] py-[4px] shadow-[0px_8px_13px_0px_rgba(68,88,112,0.04)]">
            <MoneyField
              icon="cf7cc"
              iconInset="inset-[13.89%_16.67%_13.89%_11.11%]"
              label="Rent"
              kind="Fixed"
              note="Monthly"
              value={1150}
            />
            <MoneyField
              icon="de063"
              iconInset="inset-[14.7%_14.22%_18.64%_11.11%]"
              label="Electricity"
              kind="Estimate"
              note="Monthly estimate"
              value={money.utilities}
              onChange={(v) => setMoney("utilities", v)}
            />
            <MoneyField icon="3efdf" label="Water" kind="Estimate" note="Monthly average" value={40} last />
          </div>
        </div>
      </div>
    </div>
  );
}
