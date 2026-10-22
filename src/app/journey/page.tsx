"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode, type Ref, type RefObject } from "react";
import { Icon } from "@/components/FigmaImg";
import { Screen, TopBar } from "@/components/shell";
import { FooterNav } from "@/components/ui";
import { DEFAULT_EVENT, krw, useApp, usd, type JourneyEvent } from "@/lib/store";
import { useStepReveal } from "@/lib/useStepReveal";

/*
 * Figma 1501:3028 "mid-semester" and 1501:3262 "end-semester".
 * Mid-semester runs as a story: the map ends at the NYC trip → "Add Financial Event" adds
 * Laptop Repair below it → one tap plays out Budget Rebalanced → Semester Wrapped → recap unlocked.
 * End of semester shows the whole map.
 */

type EventId = "plan" | "family" | "rent" | "checkin" | "trip" | "laptop" | "rebalance" | "wrapped";

const DETAILS: Record<EventId, { title: string; rows: { date: string; name: string; amount: number }[]; note?: string }> = {
  plan: { title: "Semester Plan Created", rows: [{ date: "Sep 01", name: "Balanced Semester", amount: 7500 }] },
  family: { title: "Family Funding Received", rows: [{ date: "Sep 01", name: "HyunWoo Kim", amount: 5000 }] },
  rent: {
    title: "Rent and Utilities",
    rows: [
      { date: "Sep 01", name: "Rent", amount: -980 },
      { date: "Sep 01", name: "Utilities", amount: -170 },
    ],
  },
  checkin: {
    title: "Monthly Check In",
    rows: [
      { date: "Sep 30", name: "Groceries under plan", amount: 180 },
      { date: "Sep 30", name: "Lifestyle under plan", amount: 140 },
    ],
    note: "$320 saved in September moved to your fall-break trip fund.",
  },
  trip: { title: "NYC Trip", rows: [{ date: "Oct 12", name: "Fall break · from savings", amount: -700 }] },
  laptop: {
    title: "Laptop Repair",
    rows: [{ date: "Today", name: "Repair estimate", amount: -420 }],
    note: "Unexpected expense. Your October map shows why — in both currencies — so you don’t have to explain from scratch.",
  },
  rebalance: { title: "Budget Rebalanced", rows: [{ date: "Nov 12", name: "Lifestyle reduced after repair", amount: -180 }] },
  wrapped: { title: "Semester Wrapped", rows: [{ date: "Dec 20", name: "Saved this semester", amount: 320 }] },
};

const KRW = "font-semibold text-[#929292]";

/* The timeline keeps the design's frame coordinates; this box (x 22→370, from y 221) is scaled to fit the 24px margins. */
const X0 = 22;
const W = 348;
const Y0 = 221;
/** design y where the visible timeline ends, and where the drawn path is clipped, for each step of the story */
const BOTTOM = { base: 840, event: 996, revealed: 1462 };
const PATH_END = { base: 800, event: 930, revealed: 1281 };

/** Sequential entrance delays (ms) once the rest of the semester is revealed */
const REVEAL = { rebalance: 150, wrapped: 650, unlock: 1150 };

export default function JourneyPage() {
  const { stage, journey, revealJourney } = useApp();
  const end = stage === "end";
  const showEvent = end || journey.event !== null;
  const revealed = end || journey.revealed;
  const event = journey.event ?? DEFAULT_EVENT;
  const phase = revealed ? "revealed" : showEvent ? "event" : "base";
  const [open, setOpen] = useState<EventId | null>(null);

  // Steps of the timeline rise in one after another as they scroll into view.
  const timeline = useRef<HTMLDivElement>(null);
  useStepReveal(timeline, 160, stage);
  const scale = useFitScale(timeline, W);

  // Bring the newly added event into view, then follow the reveal down to the recap.
  const eventCard = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (end || !journey.event || journey.revealed) return;
    const t = setTimeout(() => eventCard.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 450);
    return () => clearTimeout(t);
  }, [end, journey.event, journey.revealed]);
  useEffect(() => {
    if (end || !journey.revealed) return;
    const t = setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 500);
    return () => clearTimeout(t);
  }, [end, journey.revealed]);

  /** one tap after the new event plays out the rest of the semester */
  const canReveal = showEvent && !revealed;

  return (
    <Screen>
      <TopBar />
      <div className="px-[24px] pt-[17.5px]">
        <h1 className="text-[34px] leading-[36.72px] font-[760] tracking-[-1.53px] whitespace-nowrap text-ink-2">
          Semester Journey
        </h1>
        <p className="mt-[8px] text-[11px] leading-[16.5px] text-[#737373]">See how every choice shapes your semester journey!</p>

        {/* Share map / add event */}
        <div className="mt-[14px] flex items-center justify-end gap-[24px]">
          <Link
            href="/family"
            aria-label="Share my map with family"
            className="flex rounded-[16px] border border-mint bg-mint-soft p-[4px] transition active:scale-90"
          >
            <Icon name="98f04" className="size-[22px]" />
          </Link>
          <Link
            href="/journey/new"
            aria-label="Add financial event"
            className="flex rounded-[16px] border border-mint bg-mint-soft p-[4px] transition active:scale-90"
          >
            <Icon name="e56c7" className="h-[20px] w-[19px]" />
          </Link>
        </div>
      </div>

      <div
        ref={timeline}
        className="relative mx-[24px] overflow-clip [overflow-clip-margin:8px] transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ height: (BOTTOM[phase] - Y0) * scale }}
        onClick={
          canReveal
            ? (e) => {
                // taps on cards/links keep their own action; the empty map plays out the semester
                if (!(e.target as HTMLElement).closest("a,button")) revealJourney();
              }
            : undefined
        }
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, transform: `scale(${scale})` }}>
          {/* zero-height origin for the design coordinates: no box of its own, so it neither covers the header buttons nor stretches the page */}
          <div className="absolute h-0 w-[393px]" style={{ left: -X0, top: -Y0 }}>
            {/* The winding path, drawn as far as the story has gone */}
            <div
              className="absolute top-[271px] left-[92px] w-[171.5px] overflow-hidden transition-[height] duration-[1600ms] ease-[cubic-bezier(0.45,0,0.2,1)]"
              style={{ height: PATH_END[phase] - 271 }}
            >
              <Icon name="bf0c9" className="absolute top-[4px] left-[4px] h-[1002px] w-[163.5px]" inset="inset-[-0.4%_-2.45%]" />
            </div>
            <Icon name="bf086" className="absolute top-[275px] left-[243px] size-[97px]" inset="inset-[8.35%_2.5%_8.29%_2.49%]" />

            {/* Sep 01 · Semester Plan Created */}
            <Card id="plan" onOpen={setOpen} step={0} className="top-[261px] left-[29px] h-[66.468px] w-[217px] border-[0.652px] border-black">
              <IconBox className="top-[14.34px] left-[12.38px] size-[38.447px] rounded-[3.91px] bg-peri">
                <Icon name="0b1af" className="h-[18.898px] w-[18.246px]" inset="inset-[-3.45%_-3.57%]" />
              </IconBox>
              <Texts left={62.56} date="Sep 01" title="Semester Plan Created" titleSize="text-[13.033px]">
                $7,500 total budget
              </Texts>
            </Card>

            {/* Sep 01 · Family Funding Received */}
            <Card id="family" onOpen={setOpen} step={1} className="top-[362px] left-[150px] h-[66.3px] w-[220.35px] border-[0.65px] border-black">
              <IconBox className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[3.9px] bg-peri">
                <Icon name="2ac00" className="h-[18.2px] w-[18.154px]" inset="inset-[-1.79%]" />
              </IconBox>
              <Texts left={62.4} date="Sep 01" title="Family Funding Received">
                <AmountLine width={149} value={`+${usd(5000)}`} krwOf={5000} />
              </Texts>
            </Card>

            {/* Sep 01 · Rent and Utilities */}
            <Card id="rent" onOpen={setOpen} step={2} className="top-[461px] left-[33px] h-[66.3px] w-[216.45px] rounded-[9.1px] border-[0.65px] border-black">
              <IconBox className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[3.9px] bg-peri">
                <Icon name="7d201" className="h-[17.653px] w-[23.837px]" inset="inset-[-0.67%_0_0_0]" />
              </IconBox>
              <Texts left={62.4} date="Sep 01" title="Rent and Utilities">
                <AmountLine width={145} value={usd(-1150)} krwOf={1150} />
              </Texts>
            </Card>

            {/* Oct 1 · Monthly Check In */}
            <div className="absolute top-[574px] left-[244px] z-[1]">
              <span className="absolute top-[4px] left-[4px] h-[10px] w-[61px] rounded-[5px] bg-[rgba(152,251,203,0.44)]" />
              <p className="relative text-[11.25px] leading-[13.953px] font-semibold whitespace-nowrap text-ink">$320 Saved!</p>
            </div>
            <Icon name="9f477" className="absolute top-[530px] left-[179px] h-[63px] w-[80.348px]" inset="inset-[-0.33%_-0.26%]" />
            <div
              data-step="3"
              className="step absolute top-[593px] left-[59.16px] h-[134px] w-[260.672px] rounded-[10px] border-[0.785px] border-black bg-app shadow-[0px_4.188px_4.188px_0px_rgba(0,0,0,0.25)]"
            >
              <button className="absolute inset-0 rounded-[10px]" aria-label="Monthly Check In details" onClick={() => setOpen("checkin")} />
              <IconBox className="top-[16.5px] left-[14.25px] size-[44.25px] rounded-[10px] bg-mint">
                <Icon name="58349" className="h-[22.5px] w-[16.458px]" inset="inset-[-1.67%_-2.28%]" />
              </IconBox>
              <Icon name="2df2c" className="absolute top-[8.25px] left-[222.02px] h-[24.75px] w-[20.199px]" inset="inset-[-1.52%_-1.86%_-1.53%_-1.86%]" />
              <p className="pointer-events-none absolute top-[11.25px] left-[71.25px] text-[12px] leading-[13.53px] text-[#9199a2]">Oct 1</p>
              <p className="pointer-events-none absolute top-[30.23px] left-[72px] text-[15px] leading-[13.53px] whitespace-nowrap text-black">
                Monthly Check In
              </p>
              <div className="pointer-events-none absolute top-[51.75px] left-[72.38px] text-[11.25px] leading-[13.953px] font-medium whitespace-nowrap">
                <p className="font-semibold text-ink">You&apos;re on track!</p>
                <p className="text-[#737373]">Would you like to share</p>
                <p className="text-[#737373]">first progress with parents?</p>
              </div>
              <Link
                href="/family"
                className="absolute top-[101px] left-[72.84px] flex h-[23px] w-[161px] items-center justify-center rounded-[10px] bg-mint text-[12.558px] leading-[18.837px] font-bold text-black transition active:scale-[0.97]"
              >
                Share
              </Link>
            </div>

            {/* Oct 12 · NYC Trip */}
            <Card id="trip" onOpen={setOpen} step={4} className="top-[748px] left-[150px] h-[78px] w-[216.45px] border-[0.65px] border-black">
              <IconBox className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[10px] bg-peri">
                <Icon name="65ecc" className="h-[15.6px] w-[21.396px]" />
              </IconBox>
              <Texts left={62.4} date="Oct 12" title="NYC Trip">
                <span className="block text-[#a1a2a4]">Savings used</span>
                $700 planned trip budget
              </Texts>
            </Card>
            <DetailDot top={284} left={236} id="plan" onOpen={setOpen} />
            <DetailDot top={386} left={139} id="family" onOpen={setOpen} />
            <DetailDot top={484} left={239} id="rent" onOpen={setOpen} />
            {/* left-centre of the Monthly Check In box (box: top 593, h 134, left 59) */}
            <DetailDot top={650} left={49} id="checkin" onOpen={setOpen} />
            <DetailDot top={778} left={139} id="trip" onOpen={setOpen} />

            {/* Today · the event added from "Add Financial Event" (Laptop Repair) */}
            {showEvent && (
              <>
                <Card
                  ref={eventCard}
                  id="laptop"
                  onOpen={canReveal ? () => revealJourney() : setOpen}
                  appear={end ? undefined : 0}
                  step={5}
                  className="top-[878px] left-[69.16px] h-[104px] w-[298.552px] border-[0.897px] border-[#e00d0d] shadow-[0px_4.379px_4.379px_0px_rgba(0,0,0,0.25)]"
                >
                  <IconBox className="top-[19.72px] left-[17.03px] size-[52.897px] rounded-[10px] bg-peri">
                    <Icon name="f493a" className="h-[21.517px] w-[30.405px]" inset="inset-[-2.08%_-1.48%_-2.08%_-1.47%]" />
                  </IconBox>
                  <Icon name="433be" className="absolute top-[8.07px] left-[259.17px] h-[28.69px] w-[28.617px]" inset="inset-[-2.4%_-2.41%]" />
                  <p className="pointer-events-none absolute top-[13.45px] left-[85.17px] text-[14.345px] leading-[16.174px] text-[#9199a2]">
                    Today
                  </p>
                  <p className="pointer-events-none absolute top-[36.14px] left-[86.07px] max-w-[168px] truncate text-[17.931px] leading-[18px] whitespace-nowrap text-black">
                    {event.name}
                  </p>
                  <div className="pointer-events-none absolute top-[59.39px] left-[86.07px] text-[13.448px] leading-[16.679px] font-bold whitespace-nowrap text-[#a1a2a4]">
                    <p>{sentenceCase(event.category)}</p>
                    <AmountLine
                      width={200}
                      value={`Expected ${event.income ? "+" : ""}${usd(event.amount)}`}
                      krwOf={event.amount}
                      valueClass="text-black"
                      krwClass="text-[10px]"
                    />
                  </div>
                </Card>
                <DetailDot top={917} left={58} id="laptop" onOpen={setOpen} />
              </>
            )}

            {revealed && (
              <>
                {/* Nov 12 · Budget Rebalanced */}
                <Card
                  id="rebalance"
                  onOpen={setOpen}
                  appear={REVEAL.rebalance}
                  className="top-[1013px] left-[22px] h-[79.3px] w-[216.45px] border-[0.65px] border-[#ebc140]"
                >
                  <IconBox className="top-[14.3px] left-[12.35px] size-[38.35px] rounded-[10px] bg-peri">
                    <Icon name="a015e" className="h-[11.7px] w-[20.8px]" inset="inset-[-2.78%_-1.56%]" />
                  </IconBox>
                  <Texts left={62.4} date="Nov 12" title="Budget Rebalanced">
                    <span className="block font-semibold text-[#a1a2a4]">Lifestyle reduced after repair</span>
                    $180 lifestyle budget left
                  </Texts>
                </Card>
                <div
                  className="step step-in absolute top-[1045px] left-[289px] h-[56px] w-[78.94px] overflow-clip"
                  style={{ animationDelay: `${REVEAL.rebalance}ms` }}
                >
                  <Icon name="8ba4f" className="absolute inset-[0.66%_0.53%_0.66%_0.47%]" inset="inset-[-1.22%_-0.86%]" />
                </div>
                <DetailDot top={1043} left={228} id="rebalance" onOpen={setOpen} delay={REVEAL.rebalance} />

                {/* Dec 20 · Semester Wrapped */}
                <Card
                  id="wrapped"
                  onOpen={setOpen}
                  href="/recap"
                  appear={REVEAL.wrapped}
                  className="top-[1128px] left-[69px] h-[107.712px] w-[294px] border-[0.883px] border-black"
                >
                  <IconBox className="top-[19.42px] left-[16.77px] size-[52.09px] rounded-[10px] bg-mint">
                    <Icon name="fee2c" className="size-[30.018px]" inset="inset-[-1.47%]" />
                  </IconBox>
                  <p className="pointer-events-none absolute top-[13.24px] left-[83.88px] text-[14.126px] leading-[15.927px] text-[#9199a2]">
                    Dec 20
                  </p>
                  <p className="pointer-events-none absolute top-[35.59px] left-[84.76px] text-[17.658px] leading-[15.927px] whitespace-nowrap text-black">
                    Semester Wrapped
                  </p>
                  <div className="pointer-events-none absolute top-[58.49px] left-[84.76px] text-[13.243px] leading-[16.425px] whitespace-nowrap">
                    <p className="font-semibold text-[#a1a2a4]">Review spending and goals</p>
                    <AmountLine width={197} value="$320 Saved" krwOf={320} valueClass="font-bold text-ink" krwClass="text-[10px]" />
                  </div>
                </Card>
                <DetailDot top={1172} left={58} id="wrapped" onOpen={setOpen} delay={REVEAL.wrapped} />

                {/* Recap unlocked */}
                <article
                  className="step step-in absolute top-[1266.36px] left-[22px] flex h-[191.212px] w-[341px] flex-col rounded-[10px] bg-mint p-[20.286px]"
                  style={{ animationDelay: `${REVEAL.unlock}ms` }}
                >
                  <p className="font-inter text-[9.66px] leading-[13.041px] font-extrabold tracking-[0.966px] text-[#737373] uppercase">
                    Unlocked
                  </p>
                  <h2 className="pt-[6.762px] text-[22.218px] leading-[33.327px] whitespace-nowrap text-ink-2">
                    Your Semester, In Review.
                  </h2>
                  <p className="pt-[6.762px] pb-[15.456px] text-[9.66px] leading-[14.007px] text-[#37604c]">
                    See what you planned, what changed, and what carried you through.
                  </p>
                  <Link
                    href="/recap"
                    className="flex h-[47.329px] w-[300.435px] items-center justify-center rounded-[12.558px] bg-ink-2 text-[12.558px] leading-[18.837px] font-bold text-white transition active:scale-[0.98]"
                  >
                    See My Recap
                  </Link>
                </article>
                <div
                  className="step step-in absolute top-[1244px] left-[310px] size-[71px] overflow-clip"
                  style={{ animationDelay: `${REVEAL.unlock}ms` }}
                >
                  <Icon name="38844" className="absolute inset-[2.8%_2.5%]" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <EventSheet id={open} event={event} onClose={() => setOpen(null)} />
      <FooterNav />
    </Screen>
  );
}

/* ───────────── Pieces ───────────── */

/** Width of the timeline box ÷ the design width, kept in sync as the screen resizes. */
function useFitScale(ref: RefObject<HTMLElement | null>, designWidth: number) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / designWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, designWidth]);
  return scale;
}

const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/** "+$5,000 … ≈ ₩6,635,000 KRW" sized to stay inside its card */
function AmountLine({
  width,
  value,
  krwOf,
  valueClass = "",
  krwClass = "text-[10px]",
}: {
  width: number;
  value: string;
  krwOf: number;
  valueClass?: string;
  krwClass?: string;
}) {
  return (
    <p className="flex items-baseline justify-between gap-[6px] whitespace-nowrap" style={{ width }}>
      <span className={valueClass}>{value}</span>
      <span className={`${KRW} ${krwClass}`}>≈ {krw(Math.abs(krwOf))} KRW</span>
    </p>
  );
}

function Card({
  ref,
  id,
  onOpen,
  href,
  step,
  appear,
  className,
  children,
}: {
  ref?: Ref<HTMLButtonElement>;
  id: EventId;
  onOpen: (id: EventId) => void;
  href?: string;
  /** order in the scroll-in reveal */
  step?: number;
  /** cards added during the story animate in right away, after this delay (ms) */
  appear?: number;
  className: string;
  children: ReactNode;
}) {
  const live = appear !== undefined;
  const cls = `step absolute rounded-[10px] bg-app text-left transition active:scale-[0.98] ${live ? "step-in" : ""} ${className}`;
  const props = { className: cls, ...(live ? { style: { animationDelay: `${appear}ms` } } : { "data-step": step }) };
  if (href)
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  return (
    <button ref={ref} onClick={() => onOpen(id)} {...props}>
      {children}
    </button>
  );
}

function IconBox({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`absolute flex items-center justify-center ${className}`}>{children}</span>;
}

/** date / title / bold detail stack used by the small cards */
function Texts({
  left,
  date,
  title,
  titleSize = "text-[13px]",
  children,
}: {
  left: number;
  date: string;
  title: string;
  titleSize?: string;
  children: ReactNode;
}) {
  return (
    <>
      <p className="absolute top-[9.75px] text-[10.4px] leading-[11.726px] text-[#9199a2]" style={{ left: left - 0.65 }}>
        {date}
      </p>
      <p className={`absolute top-[26.2px] leading-[11.726px] whitespace-nowrap text-black ${titleSize}`} style={{ left }}>
        {title}
      </p>
      <div className="absolute top-[43.06px] text-[9.75px] leading-[12.093px] font-bold whitespace-nowrap text-ink" style={{ left }}>
        {children}
      </div>
    </>
  );
}

function DetailDot({
  top,
  left,
  id,
  onOpen,
  delay,
}: {
  top: number;
  left: number;
  id: EventId;
  onOpen: (id: EventId) => void;
  /** dots added during the story fade in with their card */
  delay?: number;
}) {
  return (
    <button
      aria-label={`${DETAILS[id].title} details`}
      onClick={() => onOpen(id)}
      className={`absolute z-[2] grid size-[20.4px] place-items-center overflow-clip rounded-[10.2px] border-[0.85px] border-[#a9b8e9] bg-white shadow-[0px_0px_0px_2.55px_rgba(248,250,252,0.85)] transition hover:scale-110 ${
        delay !== undefined ? "step step-in" : ""
      }`}
      style={{ top, left, animationDelay: delay !== undefined ? `${delay}ms` : undefined }}
    >
      <Icon name="b5d83" className="size-[9.35px]" />
    </button>
  );
}

function EventSheet({ id, event, onClose }: { id: EventId | null; event: JourneyEvent; onClose: () => void }) {
  const router = useRouter();
  const d =
    id === "laptop"
      ? {
          ...DETAILS.laptop,
          title: event.name,
          rows: [{ date: "Today", name: sentenceCase(event.category), amount: event.income ? event.amount : -event.amount }],
        }
      : id
        ? DETAILS[id]
        : null;
  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center transition ${d ? "visible" : "invisible"}`} aria-hidden={!d}>
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
                <div key={r.date + r.name} className="flex items-center justify-between rounded-[10px] border-[0.65px] border-black bg-white px-[16px] py-[12px]">
                  <div className="flex flex-col">
                    <p className="text-[10.4px] leading-[11.726px] text-[#9199a2]">{r.date}</p>
                    <p className="pt-[4px] text-[13px] leading-[15px] text-black">{r.name}</p>
                  </div>
                  <p className="text-right text-[13px] font-bold text-ink">
                    {r.amount > 0 ? "+" : ""}
                    {usd(r.amount)}
                    <span className="block text-[10px] font-normal text-[#929292]">≈ {krw(r.amount)} KRW</span>
                  </p>
                </div>
              ))}
            </div>
            {d.note && <p className="mt-[14px] text-[12px] leading-[16px] text-muted">{d.note}</p>}
            {id === "laptop" && (
              <button
                onClick={() => router.push("/family")}
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
