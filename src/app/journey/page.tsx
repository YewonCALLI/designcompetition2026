"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/FigmaImg";
import { Screen, TopBar } from "@/components/shell";
import { FooterNav, Toast } from "@/components/ui";
import { krw, usd } from "@/lib/store";
import { useStepReveal } from "@/lib/useStepReveal";

/* Figma 1491:1670 "Journey" (+ 1491:1344 variant) and the transaction-row fragments 1491:1335–1343 */

type EventId = "plan" | "family" | "paycheck" | "checkin" | "trip" | "laptop" | "rebalance" | "wrapped";

const DETAILS: Record<EventId, { title: string; rows: { date: string; name: string; amount: number }[]; note?: string }> = {
  plan: {
    title: "Semester Plan Created",
    rows: [
      { date: "Sep 01", name: "Balanced Semester", amount: 7500 },
      { date: "Sep 02", name: "Rent and Utilities", amount: -1150 },
    ],
  },
  family: { title: "Family Funding Received", rows: [{ date: "Sep 01", name: "HyunWoo Kim", amount: 5000 }] },
  paycheck: { title: "Campus Paycheck", rows: [{ date: "Sep 12", name: "Library desk job", amount: 420 }] },
  checkin: {
    title: "Monthly Check In",
    rows: [
      { date: "Sep 30", name: "Groceries under plan", amount: 120 },
      { date: "Sep 30", name: "Delivery skipped", amount: 200 },
    ],
    note: "$320 saved in September moved to your fall-break trip fund.",
  },
  trip: { title: "Fall Break Trip", rows: [{ date: "Oct 12", name: "NYC trip · from savings", amount: -700 }] },
  laptop: {
    title: "Laptop Repair",
    rows: [{ date: "Today", name: "Repair estimate", amount: -420 }],
    note: "Unexpected expense. Your October map shows why — in both currencies — so you don’t have to explain from scratch.",
  },
  rebalance: { title: "Budget Rebalanced", rows: [{ date: "Nov 12", name: "Lifestyle reduced after repair", amount: -180 }] },
  wrapped: { title: "Semester Wrapped", rows: [{ date: "Dec 20", name: "Saved this semester", amount: 320 }] },
};

export default function JourneyPage() {
  const [open, setOpen] = useState<EventId | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Steps of the timeline appear one after another as they scroll into view.
  const timeline = useRef<HTMLDivElement>(null);
  useStepReveal(timeline);

  return (
    <Screen className="overflow-x-clip">
      <div ref={timeline} className="relative -mt-[28px] h-[1495px] w-[393px] shrink-0">
        {/* header */}
        <div className="absolute top-[40px] left-0 w-full">
          <TopBar />
        </div>
        <div className="absolute top-[90px] left-[1.5px] h-0 w-[391.5px]">
          <Icon name="797dc" className="size-full" inset="inset-[-0.5px_0]" />
        </div>
        <p className="absolute top-[116px] left-[21px] font-inter text-[10px] leading-[13.5px] font-extrabold tracking-[1px] whitespace-nowrap text-[#737373] uppercase">
          Finish the semester · Dec 20
        </p>
        <h1 className="absolute top-[133px] left-[17px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] whitespace-nowrap text-ink-2">
          Semester Journey
        </h1>
        <p className="absolute top-[180px] left-[18px] font-inter text-[11px] leading-[16.5px] whitespace-nowrap text-[#737373]">
          See how every choice shapes your semester journey!
        </p>

        {/* Segmented actions */}
        <div className="absolute top-[209px] left-[16px] grid h-[38px] w-[353px] grid-cols-2 rounded-[11px] p-[3px]">
          <Link
            href="/journey/new"
            className="flex min-h-[32px] items-center justify-center rounded-[8px] bg-mint font-inter text-[10px] leading-[15px] font-[750] text-ink-2"
          >
            + Add new event
          </Link>
          <button
            onClick={() => setToast("Journey shared with HyunWoo")}
            className="flex min-h-[32px] items-center justify-center rounded-[8px] font-inter text-[10px] leading-[15px] font-[750] text-[#737373]"
          >
            Share journey
          </button>
        </div>

        {/* path */}
        <div className="absolute top-[275px] left-[95px] h-[1002px] w-[163.5px]">
          <Icon name="65b58" className="size-full" inset="inset-[-0.4%_-2.45%]" />
        </div>
        <div className="absolute top-[275px] left-[243px] size-[97px] overflow-clip">
          <Icon name="bf086" className="absolute inset-[8.35%_2.5%_8.29%_2.49%]" />
        </div>

        {/* Sep 01 · plan created */}
        <EventCard id="plan" onOpen={setOpen} className="top-[261px] left-[28px] h-[66.468px] w-[217px] rounded-[9.123px] border-[0.652px] border-black">
          <Tile className="top-[14.34px] left-[12.38px] size-[38.447px] rounded-[3.91px] bg-peri" />
          <Icon name="0b1af" className="absolute top-[23.46px] left-[22.81px] h-[18.898px] w-[18.246px]" inset="inset-[-3.45%_-3.57%]" />
          <SmallText top={7.17} left={62.56} date="Sep 01" title="Semester Plan Created" sub="$7,500 total budget" />
        </EventCard>

        {/* Sep 01 · family funding */}
        <EventCard id="family" onOpen={setOpen} className="top-[362px] left-[149px] h-[66.3px] w-[220.35px] rounded-[9.1px] border-[0.65px] border-black">
          <Tile className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[3.9px] bg-peri" />
          <Icon name="2ac00" className="absolute top-[24.7px] left-[21.67px] h-[18.2px] w-[18.154px]" inset="inset-[-1.79%]" />
          <SmallText top={7.15} left={62.4} date="Sep 01" title="Family Funding Received" sub="+$5,000" />
        </EventCard>

        {/* Sep 12 · paycheck */}
        <EventCard id="paycheck" onOpen={setOpen} className="top-[461px] left-[32px] h-[66.3px] w-[216.45px] rounded-[9.1px] border-[0.65px] border-black">
          <Tile className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[3.9px] bg-peri" />
          <Icon name="bc8b2" className="absolute top-[24.7px] left-[18.72px] h-[17.652px] w-[23.837px]" inset="inset-[-0.67%_0_0_0]" />
          <SmallText top={7.15} left={62.4} date="Sep 12" title="Campus Paycheck" sub="+$420" />
        </EventCard>

        {/* nc-ranking illustration + saved badge */}
        <div data-step={3} className="step absolute top-[547px] left-[178.5px] h-[65px] w-[80px]">
          <Icon name="2c1a6" className="size-full" inset="inset-[-0.33%_-0.26%]" />
        </div>
        <div data-step={3} className="step absolute top-[578px] left-[247px] h-[10px] w-[61px] rounded-[5px] bg-[rgba(152,251,203,0.44)]" />
        <p data-step={3} className="step absolute top-[574px] left-[243px] text-[11.25px] leading-[13.953px] font-semibold whitespace-nowrap text-ink">
          $320 Saved!
        </p>

        {/* Oct 1 · monthly check-in */}
        <EventCard
          id="checkin"
          onOpen={setOpen}
          className="top-[593px] left-[58.16px] h-[134px] w-[260.672px] rounded-[10.992px] border-[0.785px] shadow-[0px_4.188px_4.188px_0px_rgba(0,0,0,0.25)] border-black"
        >
          <Tile className="top-[16.5px] left-[14.25px] size-[44.25px] rounded-[4.5px] bg-mint" />
          <Icon name="fccef" className="absolute top-[27.75px] left-[28.27px] h-[22.5px] w-[16.458px]" inset="inset-[-1.67%_-2.28%]" />
          <Icon name="9367c" className="absolute top-[8.25px] left-[222.02px] h-[24.75px] w-[20.199px]" inset="inset-[-1.52%_-1.86%_-1.53%_-1.86%]" />
          <p className="absolute top-[11.25px] left-[71.25px] text-[12px] leading-[13.53px] text-[#9199a2]">Oct 1</p>
          <p className="absolute top-[30.23px] left-[72px] text-[15px] leading-[13.53px] whitespace-nowrap text-black">
            Monthly Check In
          </p>
          <div className="absolute top-[51.75px] left-[72.38px] text-[11.25px] leading-[13.953px] whitespace-pre text-[#737373]">
            <p className="font-semibold text-ink">You&apos;re on track!</p>
            <p>Would you like to share</p>
            <p>first progress with parents?</p>
          </div>
        </EventCard>
        <button
          onClick={() => setToast("October progress shared with HyunWoo")}
          data-step={3}
          className="step absolute top-[694px] left-[131px] z-10 h-[23px] w-[161px] rounded-[8px] bg-mint text-center text-[12.558px] leading-[18.837px] font-bold text-black active:brightness-95"
        >
          Share
        </button>

        {/* Oct 12 · trip */}
        <EventCard id="trip" onOpen={setOpen} className="top-[748px] left-[149px] h-[78px] w-[216.45px] rounded-[9.1px] border-[0.65px] border-black">
          <Tile className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[3.9px] bg-peri" />
          <Icon name="57fef" className="absolute top-[27.3px] left-[20.7px] h-[15.6px] w-[21.4px]" />
          <p className="absolute top-[9.75px] left-[61.75px] text-[10.4px] leading-[11.726px] text-[#9199a2]">Oct 12</p>
          <p className="absolute top-[26.2px] left-[62.4px] text-[13px] leading-[11.726px] whitespace-nowrap text-black">
            Fall Break Trip
          </p>
          <div className="absolute top-[43.06px] left-[62.4px] text-[9.75px] leading-[12.093px] font-bold whitespace-pre text-ink">
            <p className="text-[#a1a2a4]">Savings used</p>
            <p>$700 planned trip budget</p>
          </div>
        </EventCard>

        {/* Today · laptop repair */}
        <EventCard
          id="laptop"
          onOpen={setOpen}
          className="top-[878px] left-[68.16px] h-[104px] w-[298.552px] rounded-[12.552px] border-[0.897px] border-[#e00d0d] shadow-[0px_4.379px_4.379px_0px_rgba(0,0,0,0.25)]"
        >
          <Tile className="top-[19.72px] left-[17.04px] size-[52.897px] rounded-[5.379px] bg-peri" />
          <Icon name="fcc30" className="absolute top-[35.9px] left-[28.44px] h-[21.5px] w-[30.4px]" inset="inset-[-2.08%_-1.48%_-2.08%_-1.47%]" />
          <Icon name="23ec3" className="absolute top-[8px] left-[259.1px] size-[28.6px]" inset="inset-[-2.4%_-2.41%]" />
          <p className="absolute top-[13.45px] left-[85.17px] text-[14.345px] leading-[16.174px] text-[#9199a2]">Today</p>
          <p className="absolute top-[36.14px] left-[86.07px] text-[17.931px] leading-[16.174px] whitespace-nowrap text-black">
            Laptop Repair
          </p>
          <div className="absolute top-[59.39px] left-[86.07px] text-[13.448px] leading-[16.679px] font-bold whitespace-nowrap text-[#a1a2a4]">
            <p>Unexpected expense</p>
            <p className="text-black">Expected $420</p>
          </div>
        </EventCard>

        {/* Nov 12 · rebalanced */}
        <EventCard id="rebalance" onOpen={setOpen} className="top-[1013px] left-[21px] h-[79.3px] w-[216.45px] rounded-[9.1px] border-[0.65px] border-[#ebc140]">
          <Tile className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[3.9px] bg-peri" />
          <Icon name="38697" className="absolute top-[28.6px] left-[21.45px] h-[11.7px] w-[20.8px]" inset="inset-[-2.78%_-1.56%]" />
          <p className="absolute top-[9.75px] left-[61.75px] text-[10.4px] leading-[11.726px] text-[#9199a2]">Nov 12</p>
          <p className="absolute top-[26.2px] left-[62.4px] text-[13px] leading-[11.726px] whitespace-nowrap text-black">
            Budget Rebalanced
          </p>
          <div className="absolute top-[43.06px] left-[62.4px] text-[9.75px] leading-[12.093px] whitespace-nowrap text-ink">
            <p className="font-semibold text-[#a1a2a4]">Lifestyle reduced after repair</p>
            <p className="font-bold">$180 lifestyle budget left</p>
          </div>
        </EventCard>
        <div className="absolute top-[1045px] left-[288px] h-[56px] w-[78.94px] overflow-clip">
          <Icon name="b415e" className="absolute inset-[0.66%_0.53%_0.66%_0.47%]" inset="inset-[-1.22%_-0.86%]" />
        </div>

        {/* Dec 20 · wrapped */}
        <EventCard id="wrapped" onOpen={setOpen} className="top-[1128px] left-[68px] h-[107.712px] w-[294px] rounded-[12.36px] border-[0.883px] border-black">
          <Tile className="top-[19.42px] left-[16.78px] size-[52.09px] rounded-[5.297px] bg-mint" />
          <Icon name="64d7d" className="absolute top-[31px] left-[26.5px] size-[30px]" inset="inset-[-1.47%_-1.47%_-1.48%_-1.47%]" />
          <p className="absolute top-[13.24px] left-[83.88px] text-[14.126px] leading-[15.927px] text-[#9199a2]">Dec 20</p>
          <p className="absolute top-[35.59px] left-[84.76px] text-[17.658px] leading-[15.927px] whitespace-nowrap text-black">
            Semester Wrapped
          </p>
          <div className="absolute top-[58.49px] left-[84.76px] text-[13.243px] leading-[16.425px] whitespace-nowrap text-ink">
            <p className="font-semibold text-[#a1a2a4]">Review spending and goals</p>
            <p className="font-bold">$320 Saved</p>
          </div>
        </EventCard>

        {/* ⇄ detail buttons along the path */}
        {(
          [
            ["plan", 236, 284],
            ["family", 139, 386],
            ["paycheck", 239, 484],
            ["checkin", 49, 646],
            ["trip", 139, 778],
            ["laptop", 58, 917],
            ["rebalance", 228, 1043],
            ["wrapped", 58, 1172],
          ] as [EventId, number, number][]
        ).map(([id, x, y]) => (
          <button
            key={id}
            data-step={STEP[id]}
            aria-label={`${DETAILS[id].title} details`}
            onClick={() => setOpen(id)}
            className="step absolute z-10 grid size-[20.4px] place-items-center overflow-clip rounded-[10.2px] border-[0.85px] border-[#a9b8e9] bg-white shadow-[0px_0px_0px_2.55px_rgba(248,250,252,0.85)] active:scale-90"
            style={{ left: x, top: y }}
          >
            <Icon name="b5d83" className="size-[9.35px]" />
          </button>
        ))}

        {/* recap */}
        <article data-step={8} className="step absolute top-[1266.36px] left-[21px] flex h-[191.212px] w-[341px] flex-col rounded-[18.354px] bg-mint p-[20.286px]">
          <p className="font-inter text-[9.66px] leading-[13.041px] font-extrabold tracking-[0.966px] text-[#737373] uppercase">
            Unlocked
          </p>
          <p className="pt-[6.762px] text-[22.218px] leading-[33.327px] whitespace-nowrap text-ink-2">
            Your Semester, In Review.
          </p>
          <p className="pt-[6.762px] pb-[15.456px] text-[9.66px] leading-[14.007px] text-[#37604c]">
            See what you planned, what changed, and what carried you through.
          </p>
          <button
            onClick={() => setToast("Your semester review unlocks on Dec 20")}
            className="h-[47.329px] w-[300.435px] rounded-[12.558px] bg-ink-2 text-center text-[12.558px] leading-[18.837px] font-bold text-white active:scale-[0.98]"
          >
            See My Recap
          </button>
        </article>
        <div className="absolute top-[1244px] left-[310px] size-[71px] overflow-clip">
          <Icon name="38844" className="absolute inset-[2.8%_2.5%]" />
        </div>
      </div>

      <EventSheet id={open} onClose={() => setOpen(null)} onAction={setToast} />
      <Toast show={!!toast}>{toast}</Toast>
      <FooterNav />
    </Screen>
  );
}

/* ───────────── helpers ───────────── */

const STEP: Record<EventId, number> = {
  plan: 0,
  family: 1,
  paycheck: 2,
  checkin: 3,
  trip: 4,
  laptop: 5,
  rebalance: 6,
  wrapped: 7,
};

function EventCard({
  id,
  onOpen,
  className,
  children,
}: {
  id: EventId;
  onOpen: (id: EventId) => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      data-step={STEP[id]}
      onClick={() => onOpen(id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(id)}
      className={`absolute step cursor-pointer border-solid bg-app transition-transform hover:-translate-y-px active:scale-[0.99] ${className}`}
    >
      {children}
    </div>
  );
}

function Tile({ className }: { className: string }) {
  return <span className={`absolute ${className}`} />;
}

function SmallText({ top, left, date, title, sub }: { top: number; left: number; date: string; title: string; sub: string }) {
  return (
    <div className="absolute w-[109.5px]" style={{ top, left }}>
      <p className="pt-[2.6px] text-[10.4px] leading-[11.75px] text-[#9199a2]">{date}</p>
      <p className="pt-[5.9px] text-[13px] leading-[11.75px] whitespace-nowrap text-black">{title}</p>
      <p className="pt-[6.4px] text-[9.75px] leading-[12.1px] font-bold whitespace-nowrap text-ink">{sub}</p>
    </div>
  );
}

/* Bottom sheet built from the "Sep 02 · Rent and Utilities · −$1,150" row fragments */
function EventSheet({
  id,
  onClose,
  onAction,
}: {
  id: EventId | null;
  onClose: () => void;
  onAction: (msg: string) => void;
}) {
  const d = id ? DETAILS[id] : null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition ${d ? "visible" : "invisible"}`}
      aria-hidden={!d}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity ${d ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-[393px] rounded-t-[22px] bg-app px-[20px] pt-[12px] pb-[32px] transition-transform duration-300 ${
          d ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-[16px] h-[4px] w-[40px] rounded-full bg-track" />
        {d && (
          <>
            <p className="mb-[12px] text-[20px] leading-[24px] font-semibold text-ink">{d.title}</p>
            <div className="flex flex-col gap-[10px]">
              {d.rows.map((r) => (
                <div key={r.date + r.name} className="relative flex h-[100px] items-center gap-[16px] overflow-clip rounded-[14px] border border-black px-[16px]">
                  <span className="grid size-[60px] shrink-0 place-items-center rounded-[6px] bg-[#d9d9d9]">
                    <Icon name="ebda7" className="size-[28px]" inset="inset-[-1.79%]" />
                  </span>
                  <div className="flex flex-col">
                    <p className="text-[16px] leading-[18.04px] text-[#9199a2]">{r.date}</p>
                    <p className="py-[2.255px] text-[20px] leading-[18.04px] text-black">{r.name}</p>
                    <p className="pt-[5.64px] text-[15px] leading-[18.604px] font-bold text-ink">
                      {r.amount > 0 ? "+" : ""}
                      {usd(r.amount)} <span className="text-[11px] font-normal text-muted">≈ {krw(r.amount)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {d.note && <p className="mt-[14px] text-[12px] leading-[16px] text-muted">{d.note}</p>}
            {id === "laptop" && (
              <button
                onClick={() => {
                  onClose();
                  onAction("Help request sent with your October map");
                }}
                className="mt-[16px] flex h-[48px] w-full items-center justify-center rounded-[5px] bg-mint text-[14px] font-bold text-black"
              >
                Ask parents for help
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

