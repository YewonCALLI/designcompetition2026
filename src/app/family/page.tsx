"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/FigmaImg";
import { Screen, TopBar } from "@/components/shell";
import { FooterNav } from "@/components/ui";
import { krw, MONTHS, SUGGESTED_FLEX, useApp, usd, type ChatMessage, type ChatMonth } from "@/lib/store";

/*
 * Figma 1501:2437 "onboading 6" (plan negotiation, before the semester) and
 * 1501:3586 "shared family view" (October laptop support, during the semester).
 */

const PLAN_TOTAL = 7500;

export default function FamilyPage() {
  const { stage, family } = useApp();
  const inSemester = stage !== "before";
  const [open, setOpen] = useState<ChatMonth | null>(inSemester ? "October" : "September");
  const toggle = (m: ChatMonth) => setOpen((o) => (o === m ? null : m));
  // Follow the demo stage: the in-semester view opens on October.
  const [openFor, setOpenFor] = useState(inSemester);
  if (openFor !== inSemester) {
    setOpenFor(inSemester);
    setOpen(inSemester ? "October" : "September");
  }

  const badge = inSemester
    ? "Approved"
    : family.status === "agreed"
      ? "new plan agreed"
      : family.status === "suggested"
        ? "plan shared"
        : "draft";

  return (
    <Screen>
      <TopBar back="/" />

      <div className="flex w-full flex-col">
        <div className="px-[24px] pt-[24px] pb-[8px]">
          <h1 className="h-[44px] pt-[7px] text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] whitespace-nowrap text-ink-2">
            Family Space
          </h1>
        </div>
        <p className="px-[24px] text-[12px] leading-[15px] text-[#697189]">
          Your conversations, decisions, and shared progress.
        </p>
      </div>

      <div className="mt-[24px] flex w-full justify-center px-[24px]">
        <div className="flex w-full flex-col gap-[24px]">
          {/* Shared semester plan */}
          <section className="flex flex-col items-center gap-[12px] rounded-[10px] bg-peri p-[12px]">
            <div className="flex w-full items-center justify-between px-[3px]">
              <p className="text-[10.04px] font-bold text-black">SHARED SEMESTER PLAN</p>
              <span className="rounded-[10px] bg-mint px-[8px] py-[5px] text-[10px] leading-[15px] font-medium tracking-[1.1px] whitespace-nowrap text-black">
                {badge}
              </span>
            </div>
            <div className="flex w-full flex-col gap-px px-[3px] text-black">
              <p className="text-[25.556px] font-bold">{usd(PLAN_TOTAL)}</p>
              <div className="flex items-start justify-between text-[12px] leading-[15px] whitespace-nowrap">
                <p>≈ {krw(PLAN_TOTAL)} KRW</p>
                <Link href="/plan/review" className="text-right font-medium tracking-[1.1px]">
                  view plan details →
                </Link>
              </div>
            </div>
          </section>

          {/* Conversation history */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-end justify-between whitespace-nowrap">
              <h2 className="text-[20px] leading-[24px] font-semibold text-[#20243b]">Conversation History</h2>
              <p className="text-right text-[12px] leading-[15px] font-medium tracking-[1.1px] text-[#9096a6]">FALL 2026</p>
            </div>

            <MonthPanel
              month="September"
              subtitle={inSemester ? "4 messages" : "Initial Proposed Plan"}
              open={open === "September"}
              onToggle={() => toggle("September")}
            >
              <SeptemberThread />
            </MonthPanel>

            <MonthPanel
              month="October"
              subtitle={inSemester ? "Monthly update & laptop support" : "Upcoming monthly check-in"}
              open={open === "October"}
              onToggle={() => toggle("October")}
            >
              {inSemester ? <OctoberThread /> : <UpcomingThread month="October" />}
            </MonthPanel>

            <MonthPanel
              month="November"
              subtitle="Upcoming monthly check-in"
              open={open === "November"}
              onToggle={() => toggle("November")}
            >
              <UpcomingThread month="November" />
            </MonthPanel>

            <Composer month={open ?? (inSemester ? "October" : "September")} />
          </div>
        </div>
      </div>

      <FooterNav />
    </Screen>
  );
}

/* ───────────── Month accordion ───────────── */

function MonthPanel({
  month,
  subtitle,
  open,
  onToggle,
  children,
}: {
  month: ChatMonth;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section
      className={`overflow-clip rounded-[10px] transition-colors ${
        open ? "bg-white" : "border-[0.9px] border-[#e2e6ef] bg-white"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`relative flex h-[64px] w-full flex-col items-start rounded-[10px] px-[15.5px] pt-[16.4px] text-left ${
          open ? "bg-peri-soft" : ""
        }`}
      >
        <span className="text-[12.513px] font-bold text-[#20243b]">{month}</span>
        <span className="mt-[2px] text-[10px] text-[#747b99]">{subtitle}</span>
        <span className={`absolute top-[29px] right-[19.2px] flex ${open ? "-scale-y-100" : ""}`}>
          <Icon name={open ? "3c04e" : "33214"} className="h-[6.383px] w-[12.767px]" inset="inset-[-14%_-7%]" />
        </span>
      </button>
      {open && <div className="pb-[18px]">{children}</div>}
    </section>
  );
}

/* ───────────── Shared building blocks ───────────── */

function ViewFullUpdate() {
  return (
    <div className="flex justify-end pt-[31px] pr-[26px]">
      <Link href="/journey" className="text-[9px] font-medium text-black underline">
        View full update
      </Link>
    </div>
  );
}

/** "October budget update" summary card (Figma 1501:3628 group). */
function UpdateCard({
  title,
  date,
  left,
  right,
  progress,
  icon,
}: {
  title: string;
  date: string;
  left: { label: string; value: string; sub?: string };
  right: { label: string; value: string };
  /** 0–1 fill of the right-hand bar */
  progress: number;
  icon: string;
}) {
  return (
    <div className="relative mx-[16px] mt-[6px] h-[132px] rounded-[13.6px] border-[0.9px] border-[#e1e5f3] bg-[#fafbff]">
      <Icon name="e2689" className="absolute top-[15.8px] left-[13.65px] h-[30.938px] w-[30.028px]" />
      <Icon name={icon} className="absolute top-[24.3px] left-[20px] h-[13.695px] w-[18.529px]" inset="inset-[-1.43%_0_0_0]" />
      <p className="absolute top-[15.8px] left-[53.69px] text-[12.739px] font-bold whitespace-nowrap text-[#24283d]">{title}</p>
      <p className="absolute top-[35.8px] left-[53.69px] text-[10.009px] whitespace-nowrap text-[#798194]">{date}</p>
      <Link
        href="/journey"
        className="absolute top-[14px] right-[13px] rounded-[10px] bg-mint px-[12px] py-[4px] text-[12px] leading-[15px] font-medium tracking-[1.1px] whitespace-nowrap text-black uppercase"
      >
        map view
      </Link>
      <Icon name="ef6a6" className="absolute top-[57.7px] right-[13.65px] left-[13.65px] h-0" inset="inset-[-0.45px_0]" />
      <div className="absolute top-[67.7px] left-[15.47px] flex flex-col">
        <p className="text-[10.009px] whitespace-nowrap text-[#7e8596]">{left.label}</p>
        <p className="mt-[2.7px] text-[12px] font-bold whitespace-nowrap text-[#24283d]">{left.value}</p>
        {left.sub && <p className="mt-[4px] text-[9.75px] font-bold whitespace-nowrap text-[#929292]">{left.sub}</p>}
      </div>
      <div className="absolute top-[67.7px] left-[156.51px] flex flex-col">
        <p className="text-[10.009px] whitespace-nowrap text-[#7e8596]">{right.label}</p>
        <p className="mt-[2.7px] text-[12px] font-bold whitespace-nowrap text-[#24283d]">{right.value}</p>
      </div>
      <div className="absolute top-[108.4px] left-[156.51px] h-[6.373px] w-[149.231px] overflow-hidden rounded-full">
        <Icon name="903be" className="absolute inset-0" />
        <div className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-700" style={{ width: `${progress * 100}%` }}>
          <Icon name="691f2" className="h-[6.373px] w-[149.231px]" />
        </div>
      </div>
    </div>
  );
}

function Sender({ who, time, className = "mt-[37px]" }: { who: "minji" | "mom"; time: string; className?: string }) {
  return (
    <div className={`flex items-center pl-[21px] ${className}`}>
      <Avatar who={who === "mom" ? "mom" : "minjiChat"} />
      <p className="ml-[6.5px] text-[10.919px] font-bold text-black">{who === "mom" ? "Mom" : "Minji"}</p>
      <p className="ml-[6.5px] text-[10.009px] text-[#8a8f9e]">{time}</p>
    </div>
  );
}

function Bubble({ who, children }: { who: "minji" | "mom"; children: ReactNode }) {
  return (
    <div
      className={`ml-[53px] flex min-h-[62px] w-[266px] items-center rounded-[10px] px-[13px] py-[10px] text-[11px] leading-[1.0005] text-[#24283c] ${
        who === "mom" ? "bg-peri-soft" : "bg-mint-soft"
      }`}
    >
      <p className="w-[213px]">{children}</p>
    </div>
  );
}

function ExtraMessages({ messages }: { messages: ChatMessage[] }) {
  return messages.map((m, i) => (
    <div key={i}>
      <Sender who={m.from} time={m.time} className="mt-[16px]" />
      <div className="mt-[4px]">
        <Bubble who={m.from}>{m.text}</Bubble>
      </div>
    </div>
  ));
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[10.009px] ${bold ? "font-bold text-[#24283d]" : "text-[#757c90]"}`}>{label}</span>
      <span className="text-right text-[11.829px] font-bold text-[#24283d]">{value}</span>
    </div>
  );
}

function FundingReceived({ detail }: { detail: string }) {
  return (
    <div className="relative mx-[16px] mt-[16px] flex h-[51.9px] items-center rounded-[11px] border-[0.9px] border-[#d9d9d9] bg-[rgba(185,247,172,0.61)] pl-[9px]">
      <span className="relative grid size-[24px] shrink-0 place-items-center rounded-[4.516px] border-[0.903px] border-black">
        <Icon name="95c84" className="size-[11px]" inset="inset-[-9.09%]" />
      </span>
      <div className="ml-[6px] flex flex-col gap-[5px] font-inter text-black">
        <p className="text-[10.919px] leading-[13px] font-bold">Funding received</p>
        <p className="text-[10.009px] leading-[12px]">{detail}</p>
      </div>
    </div>
  );
}

/* ───────────── September: proposed plan → adjustment → agreement (1501:2437) ───────────── */

function SeptemberThread() {
  const { stage, family, money, totals, acceptChange, proposeFlex, agreedSupport } = useApp();
  const [proposing, setProposing] = useState(false);
  const [counter, setCounter] = useState(190);
  const status = stage === "before" ? family.status : "agreed";

  if (status === "draft") {
    return (
      <div className="flex flex-col items-center gap-[12px] px-[24px] pt-[28px] text-center">
        <p className="text-[12px] leading-[15px] text-[#697189]">
          No plan shared yet. Choose a plan and send it to your family to start the conversation.
        </p>
        <Link href="/plan/options" className="rounded-[10px] bg-mint px-[16px] py-[8px] text-[12px] font-bold text-black">
          Choose a plan
        </Link>
      </div>
    );
  }

  // Jumping straight into the semester (demo control) shows the agreed story from the design.
  const story = stage !== "before" && family.status === "draft";
  const newFlex = story ? Math.min(family.originalFlex, SUGGESTED_FLEX) : family.flex;
  const support = story ? money.familySupport - (family.originalFlex - newFlex) * MONTHS : agreedSupport;
  const flexDiff = family.originalFlex - newFlex;
  return (
    <>
      <ViewFullUpdate />
      <UpdateCard
        title="Fall 2026 plan proposal"
        date="Shared Aug 12, 2026"
        icon="c1369"
        left={{ label: "Semester spending", value: usd(totals.spending), sub: `≈ ${krw(totals.spending)} KRW` }}
        right={{ label: "NYC trip savings", value: "$0 saved of $700" }}
        progress={0.02}
      />

      <Sender who="minji" time="Aug 12 · 10:24 AM" />
      <Bubble who="minji">Here is my proposed budget for the new semester.</Bubble>

      <Sender who="mom" time="Aug 13 · 8:03 AM" className="mt-[16px] pl-[16px]" />
      <div className="mt-[1px]">
        <div className="ml-[48px] flex min-h-[62px] w-[266px] items-center rounded-[10px] bg-peri-soft px-[7px]">
          <p className="w-[248px] text-[12px] leading-[15px] text-ink">
            We can support the semester. Could you try a slightly lower flexible budget?
          </p>
        </div>
      </div>

      {/* Adjustment proposed */}
      <div className="relative mt-[20px] ml-[50px] w-[266px] rounded-[11px] border-[0.9px] border-[#d7ddf4] bg-white px-[14px] pt-[12.75px] pb-[11px]">
        <div className="flex items-start gap-[9px]">
          <span className="relative size-[27.3px] shrink-0">
            <Icon name="55a6a" className="absolute inset-0" />
            <Icon name="2a09e" className="absolute top-[5.4px] left-[8px] h-[16px] w-[12px]" inset="inset-[-3.12%_-4.17%]" />
          </span>
          <div className="flex flex-col">
            <p className="text-[11.829px] font-bold whitespace-nowrap text-[#25283d]">Adjustment proposed</p>
            <p className="text-[10.009px] whitespace-nowrap text-[#7a8095]">Less Flexible Spending</p>
          </div>
        </div>
        <div className="mt-[6px] border-t-[0.9px] border-[#e1e5f3] pt-[8px]">
          <div className="flex flex-col gap-[7px]">
            <Row label="Original Plan" value={usd(family.originalFlex)} />
            <Row label="New Plan" value={usd(newFlex)} />
          </div>
        </div>
        <div className="mt-[8px] flex items-start justify-between border-t-[0.9px] border-[#e1e5f3] pt-[10px]">
          <span className="pt-[4px] text-[10.009px] font-bold text-[#24283d]">Updated family support</span>
          <div className="flex flex-col items-end">
            <span className="text-[15.469px] font-bold text-[#504dab]">{usd(support)}</span>
            <span className="text-[9.099px] text-[#798095]">≈ {krw(support)}</span>
          </div>
        </div>

        {status === "suggested" && !proposing && (
          <div className="mt-[6px] grid grid-cols-2">
            <button
              onClick={() => setProposing(true)}
              className="h-[17px] rounded-[4px] bg-track text-center text-[9px] font-medium text-ink"
            >
              Propose Another
            </button>
            <button onClick={acceptChange} className="h-[17px] rounded-[4px] bg-mint text-center text-[9px] font-medium text-ink">
              Accept Change
            </button>
          </div>
        )}
        {status === "suggested" && proposing && (
          <form
            className="mt-[6px] flex items-center gap-[6px]"
            onSubmit={(e) => {
              e.preventDefault();
              proposeFlex(Math.max(0, Math.min(counter, family.originalFlex)));
              setProposing(false);
            }}
          >
            <label className="flex h-[22px] flex-1 items-center gap-[2px] rounded-[4px] border border-line px-[6px] text-[10px]">
              <span className="text-muted">$</span>
              <input
                type="number"
                inputMode="numeric"
                autoFocus
                aria-label="Your flexible budget per month"
                value={counter}
                onChange={(e) => setCounter(Number(e.target.value))}
                className="w-full min-w-0 bg-transparent font-bold outline-none"
              />
              <span className="text-muted">/mo</span>
            </label>
            <button type="submit" className="h-[22px] rounded-[4px] bg-mint px-[10px] text-[9px] font-medium text-ink">
              Send
            </button>
          </form>
        )}
        {status === "agreed" && (
          <p className="mt-[6px] h-[17px] rounded-[4px] bg-mint text-center text-[9px] leading-[17px] font-medium text-ink">
            Change accepted
          </p>
        )}
      </div>

      <ExtraMessages messages={family.extra.September} />

      {status === "agreed" && (
        <FundingReceived detail={`Aug. 14 · Budget adjusted · ${flexDiff > 0 ? "−" : "+"}${usd(Math.abs(flexDiff))}`} />
      )}
    </>
  );
}

/* ───────────── October: monthly update + laptop support request (1501:3586) ───────────── */

function OctoberThread() {
  const { family } = useApp();
  return (
    <>
      <ViewFullUpdate />
      <UpdateCard
        title="October budget update"
        date="Shared Oct 15, 2026"
        icon="e5697"
        left={{ label: "Remaining budget", value: "$780" }}
        right={{ label: "NYC trip savings", value: "$400 saved of $700" }}
        progress={400 / 700}
      />

      <Sender who="minji" time="Oct 20 · 10:24 AM" />
      <Bubble who="minji">My laptop broke, so I need to update my budget. I shared the details below.</Bubble>

      {/* Support request */}
      <div className="mt-[13px] ml-[53px] w-[266px] rounded-[11px] border-[0.9px] border-[#d7ddf4] bg-white px-[14px] pt-[12.7px] pb-[13px]">
        <div className="flex items-start gap-[9px]">
          <span className="relative size-[27.3px] shrink-0">
            <Icon name="565fa" className="absolute inset-0" />
            <Icon name="30f3c" className="absolute top-[5.4px] left-[8px] h-[16px] w-[12px]" inset="inset-[-3.12%_-4.17%]" />
          </span>
          <div className="flex flex-col">
            <p className="text-[11.829px] font-bold whitespace-nowrap text-[#25283d]">Support request</p>
            <p className="text-[10.009px] whitespace-nowrap text-[#7a8095]">Laptop replacement</p>
          </div>
        </div>
        <div className="mt-[5px] flex flex-col gap-[7px] border-t-[0.9px] border-[#e1e5f3] pt-[9px] pr-[1px]">
          <Row label="Estimated cost" value="$950" />
          <Row label="Emergency fund" value="$600" />
        </div>
        <div className="mt-[8px] flex items-start justify-between border-t-[0.9px] border-[#e1e5f3] pt-[8px]">
          <span className="pt-[6px] text-[10.009px] font-bold text-[#24283d]">Extra support requested</span>
          <div className="flex flex-col items-end">
            <span className="text-[15.469px] font-bold text-[#504dab]">$350</span>
            <span className="text-[9.099px] text-[#798095]">≈ {krw(350)}</span>
          </div>
        </div>
        <p className="mt-[3px] h-[17px] rounded-[4px] bg-mint text-center text-[9px] leading-[17px] font-medium text-ink">
          Approved by family
        </p>
      </div>

      <Sender who="mom" time="Oct 21 · 8:03 AM" className="mt-[11px]" />
      <Bubble who="mom">
        Of course! We approved $350.
        <br />
        Let us know when you receive it.
      </Bubble>

      <ExtraMessages messages={family.extra.October} />

      <FundingReceived detail="Oct 22 · Journey updated · +$350" />
    </>
  );
}

function UpcomingThread({ month }: { month: ChatMonth }) {
  const { family } = useApp();
  return (
    <>
      <p className="px-[16px] pt-[16px] text-[11px] leading-[15px] text-[#838a9b]">
        Your {month} check-in opens on {month === "October" ? "Oct 1" : "Nov 1"}. Share your map with your family when it does.
      </p>
      <ExtraMessages messages={family.extra[month]} />
    </>
  );
}

/* ───────────── Message composer (1501:3730) ───────────── */

function Composer({ month }: { month: ChatMonth }) {
  const { sendMessage } = useApp();
  const [text, setText] = useState("");
  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(month, t);
    setText("");
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="relative flex h-[46.933px] w-full items-center rounded-full border-[0.9px] border-[#e7eaf1] bg-[#f5f6fa]"
    >
      <span className="absolute top-[10.4px] left-[12.2px] grid size-[25.272px] place-items-center" aria-hidden>
        <Icon name="8ae3a" className="absolute inset-0" />
        <Icon name="c8633" className="size-[10.831px]" inset="inset-[-4.17%]" />
      </span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message your family..."
        aria-label={`Message your family about ${month}`}
        className="h-full w-full rounded-full bg-transparent pr-[50px] pl-[48.3px] text-[11.733px] text-ink outline-none placeholder:text-[#9a9fb0]"
      />
      <button
        type="submit"
        aria-label="Send"
        className="absolute top-[8.6px] right-[13.1px] size-[28.882px] transition active:scale-90"
      >
        <Icon name="19653" className="absolute inset-0" />
        <Icon name="98845" className="absolute top-[9.9px] left-[3.6px] h-[10.831px] w-[19.856px]" inset="inset-[-4.17%_-2.27%]" />
        <Icon name="ff8ec" className="absolute top-[11.3px] left-[8.4px] h-[5.88px] w-[13.317px]" inset="inset-[-7.68%_-3.39%]" />
      </button>
    </form>
  );
}
