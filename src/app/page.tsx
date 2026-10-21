"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { FigmaImg, Icon } from "@/components/FigmaImg";
import { PrimaryButton, Screen, TopBar } from "@/components/shell";
import { FooterNav, MoneyField } from "@/components/ui";
import { krw, useApp, usd, type Stage } from "@/lib/store";

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
      <div className="flex min-h-[98px] w-full items-end justify-between px-[20px] pt-[24px] pb-[8px]">
        <div className="flex items-end gap-[12px]">
          <Avatar variant={stage === "during" ? "during" : "before"} />
          <h1 className="h-[44px] pt-[7px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] whitespace-nowrap text-ink-2">
            Hi, Minji.
          </h1>
        </div>
        {/* DemoControl — switches which point of the story Home shows */}
        <label className="relative mb-[2px] flex h-[22.6px] w-[108px] items-center overflow-clip rounded-[7px] bg-[#f3f3f3]">
          <span className="sr-only">Demo stage</span>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as Stage)}
            className="h-full w-full cursor-pointer appearance-none bg-transparent pr-[22px] pl-[10px] font-inter text-[8px] text-ink-2 outline-none"
          >
            <option value="before">Before semester</option>
            <option value="during">During semester</option>
          </select>
          <span className="pointer-events-none absolute top-0 right-0 flex h-full w-[20px] items-center justify-center">
            <Icon name="822c8" className="h-[6px] w-[10px]" />
          </span>
        </label>
      </div>

      <div className="flex w-full items-center justify-between px-[20px] py-[12px]">
        <div className="flex w-[190px] items-center gap-[4px]">
          <Icon
            name={stage === "during" ? "c0bc6" : "7ed1c"}
            className="h-[18.772px] w-[15.726px]"
            inset="inset-[-2.66%_-3.18%_-1.37%_0]"
          />
          <div className="flex w-[74px] flex-col items-start leading-[15px]">
            <p className="w-full text-[12px] font-bold text-ink">KRW</p>
            <p className="w-full text-center text-[10px] text-muted">Home Currency</p>
          </div>
        </div>
        <Link
          href="/family"
          className="flex items-center gap-[4px] rounded-[5px] bg-mint px-[4px] py-[2px]"
        >
          <Icon name="e8f4d" className="h-[16px] w-[14px]" />
          <span className="text-[10px] leading-[15px] font-medium text-ink">HyunWoo Kim</span>
        </Link>
      </div>
    </>
  );
}

/* ───────────── Figma 1491:217 — first page, before planning ───────────── */

function BeforePlanning() {
  return (
    <>
      <div className="flex w-full justify-center py-[24px]">
        <div className="relative flex h-[417px] w-[353px] flex-col justify-end gap-[10px] py-[17px]">
          <Icon name="5cb74" className="absolute inset-0" inset="inset-[-4.8%_-10.2%_-12.47%_-10.2%]" />
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

/* ───────────── Figma 1491:1118 — Home, during the semester ───────────── */

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
    body: "Lifestyle budget is a little lower after the trip. Your monthly check-in opens Nov 1.",
  },
  Dec: {
    title: "December · finish line",
    body: "Semester review unlocks Dec 20 — see what you planned, what changed, and what carried you.",
  },
};
const MONTHS = ["Sep", "Oct", "Nov", "Dec"] as const;
const MONTH_X = [24, 127, 232, 325.5]; // label centres inside the card (design px)

function DuringSemester() {
  const { money, setMoney } = useApp();
  const [range, setRange] = useState<"Monthly" | "Semester">("Monthly");
  const [month, setMonth] = useState<(typeof MONTHS)[number]>("Oct");
  const mult = range === "Monthly" ? 1 : 4;
  const totalSpent = 2500 * mult;
  const balance = 7500;
  const note = MONTH_NOTES[month];
  const mi = MONTHS.indexOf(month);

  return (
    <div className="flex w-full flex-col">
      {/* Date chip */}
      <div className="relative h-[28px] w-full">
        <Icon name="20c81" className="absolute top-[8px] left-[23.9px] size-[14px]" inset="inset-[-3.57%]" />
        {[27, 30, 33].map((x) => (
          <span key={x} className="absolute top-[15px] size-[2px]" style={{ left: x }}>
            <FigmaImg name="a8864" className="size-full" />
          </span>
        ))}
        <button className="absolute top-[3.5px] left-[43px] flex h-[18.9px] w-[84px] items-center rounded-[5.25px] bg-[#e8e8e8] pl-[4px] shadow-[0px_1.05px_4.2px_0px_rgba(0,0,0,0.25)]">
          <span className="font-inter text-[11px] leading-[16.5px] font-extrabold whitespace-nowrap text-black">
            Oct 1, 2026
          </span>
          <Icon name="26be8" className="absolute top-[4.5px] left-[69px] size-[11px]" />
        </button>
      </div>

      {/* Current balance card */}
      <section className="relative mx-auto mt-[8px] h-[227px] w-[350px] rounded-[17px] border border-line bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <p className="absolute top-[29px] left-[21px] text-[11px] leading-[16.5px] text-[#737373]">
          Current Balance
        </p>
        <p className="absolute top-[51px] left-[21px] text-[52px] leading-[52px] font-bold tracking-[-3.12px] text-ink-2">
          {usd(balance)}
        </p>
        <p className="absolute top-[114px] left-[21px] text-[15px] leading-[16.5px] text-[#737373]">
          ≈ {krw(balance)} KRW
        </p>
        <div className="absolute top-[147px] left-[21px] h-[13px] w-[314px] overflow-hidden rounded-[12px] bg-track">
          <div className="h-full w-[125px] rounded-[12px] bg-mint" />
        </div>
        <p className="absolute top-[169px] left-[21px] text-[11px] leading-[16.5px] text-[#737373]">
          Semester spending progress
        </p>
        <p className="absolute top-[169px] left-[283px] text-[11px] leading-[16.5px] font-semibold text-ink">
          40% used
        </p>
        {/* oc-target illustration */}
        <div className="absolute top-[3px] left-[265px] flex h-[69.704px] w-[78.301px] items-center justify-center">
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
              <Icon name="a4d22" className="absolute inset-[1.83%_0.94%_0_0]" inset="inset-[-1.94%_-1.53%_0_0]" />
            </div>
          </div>
        </div>
        <div className="absolute top-[61.2px] left-[274.7px] flex h-[18.794px] w-[63.453px] items-center justify-center">
          <p className="h-[11.857px] w-[62.518px] flex-none rotate-[-6.44deg] font-inter text-[12.688px] leading-[10.468px] font-extrabold text-black">
            On track!
          </p>
        </div>
      </section>

      {/* My Spendings */}
      <h2 className="mt-[7px] px-[22px] text-[24px] leading-[36.72px] font-[760] tracking-[-1.53px] text-ink">
        My Spendings
      </h2>
      <div className="mx-auto mt-[9px] grid h-[38px] w-[353px] grid-cols-2 rounded-[11px] bg-[#f3f3f3] p-[3px]">
        {(["Monthly", "Semester"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`flex min-h-[32px] items-center justify-center rounded-[8px] text-[10px] leading-[15px] font-[750] transition-colors ${
              range === r ? "bg-mint text-ink-2" : "bg-white/10 text-[#737373]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <p className="mt-[11px] px-[26px] text-[11px] leading-[16.5px] text-[#737373]">
        Your {range === "Monthly" ? "monthly" : "semester"} spending based on category
      </p>

      <section className="relative mx-auto mt-[12.5px] h-[238px] w-[350px] rounded-[17px] bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <div className="absolute top-[28px] left-[11px] h-[130px] w-[128.7px]">
          <FigmaImg name="64e22" className="size-full" />
        </div>
        <p className="absolute top-[71px] left-[75.5px] -translate-x-1/2 text-center text-[11px] leading-[19px] font-bold whitespace-nowrap text-ink">
          Total spent
        </p>
        <p className="absolute top-[89px] left-[75.5px] -translate-x-1/2 text-center text-[11px] leading-[19px] font-bold whitespace-nowrap text-ink">
          {usd(totalSpent)}
        </p>

        {SPENDING.map((s, i) => (
          <div key={s.name} className="absolute right-[15px] left-[159px] flex h-[23px] items-center" style={{ top: 23 + i * 35 }}>
            <span className="relative size-[23px] shrink-0">
              <FigmaImg name={s.dot} className="size-full" />
            </span>
            <span className="ml-[8px] text-[11px] leading-[19px] font-bold text-black">{s.name}</span>
            <span className="ml-[6px] text-[11px] leading-[19px] font-bold text-[#959595]">{s.pct}%</span>
            <span className="ml-auto text-[11px] leading-[19px] font-bold text-black">{usd(s.amount * mult)}</span>
          </div>
        ))}
        {/* category glyphs drawn over the legend dots */}
        <Icon name="eee92" className="absolute top-[33.4px] left-[163.5px] h-[12px] w-[13.5px]" inset="inset-[-4.69%_-4.17%]" />
        <Icon name="8ff65" className="absolute top-[40.9px] left-[168px] h-[4.6px] w-[4.5px]" inset="inset-[-12.5%]" />
        <Icon name="46ea7" className="absolute top-[70.6px] left-[163.5px] h-[11px] w-[12px]" inset="inset-[-4.58%_-4.17%]" />
        <Icon name="e0231" className="absolute top-[104.8px] left-[165.3px] h-[11.7px] w-[10.2px]" inset="inset-[-4.17%_-4.76%]" />
        <Icon name="4448a" className="absolute top-[140.2px] left-[165.5px] h-[11.3px] w-[10px]" inset="inset-[-4.17%_-4.69%]" />

        <p className="absolute top-[168px] left-[21px] text-[11px] leading-[16.5px] text-[#737373]">
          October Remaining
        </p>
        <p className="absolute top-[190px] left-[21px] whitespace-nowrap text-black">
          <span className="text-[24px] leading-[16.5px] font-bold">{usd(780)}</span>
          <span className="text-[11px] leading-[16.5px]"> ≈ {krw(780)} KRW</span>
        </p>
      </section>

      {/* My Journey */}
      <div className="mt-[12px] flex items-baseline justify-between px-[22px]">
        <h2 className="text-[24px] leading-[36.72px] font-[760] tracking-[-1.53px] text-ink">My Journey</h2>
        <Link href="/journey" className="pr-[9px] font-inter text-[11px] leading-[16.5px] text-[#737373] underline">
          Explore
        </Link>
      </div>
      <section className="relative mx-auto mt-[11px] h-[180px] w-[350px] rounded-[17px] border border-[rgba(0,0,0,0.12)] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.36)]">
        <Icon name="eb41b" className="absolute top-[45px] left-[21px] h-0 w-[309.5px]" inset="inset-[-3px_-0.97%]" />
        {MONTHS.map((m, i) => {
          const active = m === month;
          const x = MONTH_X[i];
          return (
            <button
              key={m}
              aria-label={m}
              aria-pressed={active}
              onClick={() => setMonth(m)}
              className="absolute top-[24px] flex w-[44px] -translate-x-1/2 flex-col items-center"
              style={{ left: x }}
            >
              <span className={`relative transition-all ${active ? "size-[26px]" : "mt-[6.7px] size-[12.6px]"}`}>
                <FigmaImg name={active ? "ef4a8" : "de2b1"} className="size-full" />
              </span>
              <span
                className={`absolute top-[33px] text-[11px] leading-[19px] font-bold ${active ? "text-black" : "text-[#737373]"}`}
              >
                {m}
              </span>
            </button>
          );
        })}
        <div className="absolute top-[94px] left-[15px] w-[320px] font-inter text-[#737373]">
          <p className="flex items-center gap-[6px] text-[14px] leading-[16.5px] font-bold text-black">
            {note.title}
            {mi === 1 && <Icon name="dd903" className="size-[16px]" inset="inset-[4.69%_6.19%_3.18%_4.69%]" />}
          </p>
          <p className="mt-[3px] text-[11px] leading-[16.5px]">{note.body}</p>
        </div>
      </section>

      {/* Check next */}
      <article className="mx-auto mt-[3px] flex h-[85.967px] w-[353px] items-center justify-between rounded-[17px] bg-peri p-[17px]">
        <div className="flex w-[160px] flex-col">
          <p className="pt-[7px] font-inter text-[8px] leading-[12px] tracking-[0.56px] text-ink-2 uppercase">
            Check next
          </p>
          <p className="pt-[8px] font-inter text-[16px] leading-[24px] whitespace-nowrap text-ink-2">
            Compare Travel Options
          </p>
        </div>
        <Link
          href="/journey"
          className="flex min-h-[39px] items-center justify-center rounded-[13px] bg-mint px-[17px] font-inter text-[13px] leading-[19.5px] font-[750] text-ink-2"
        >
          Open
        </Link>
      </article>

      {/* Upcoming bills */}
      <p className="mt-[20px] px-[22px] font-inter text-[16px] leading-[24px] text-ink-2">Upcoming Bills</p>
      <div className="mx-auto mt-[9px] flex w-[353px] flex-col overflow-clip rounded-[17px] border border-line bg-white px-[18px] py-[4px]">
        <MoneyField icon="df155" label="Dining & social" value={money.dining} onChange={(v) => setMoney("dining", v)} />
        <MoneyField icon="30643" label="Shopping" value={money.shopping} onChange={(v) => setMoney("shopping", v)} />
        <MoneyField
          icon="3fcff"
          label="Subscriptions"
          kind="Recurring"
          note="Netflix, Spotify, and AI tools"
          value={money.subscriptions}
          onChange={(v) => setMoney("subscriptions", v)}
          last
        />
      </div>
    </div>
  );
}
