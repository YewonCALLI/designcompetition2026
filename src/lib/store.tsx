"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/** Where Minji is in the story; switched with the demo control on Home. */
export type Stage = "before" | "during" | "end";

export type MoneyKey =
  | "startingCash"
  | "familySupport"
  | "campusIncome"
  | "rent"
  | "utilities"
  | "groceries"
  | "transportation"
  | "phone"
  | "dining"
  | "shopping"
  | "subscriptions"
  | "plannedTv"
  | "springTrip"
  | "reserve";

/** Defaults match the Figma "build your starting point" screen (1501:1823). */
export const DEFAULT_MONEY: Record<MoneyKey, number> = {
  startingCash: 1200,
  familySupport: 4500,
  campusIncome: 2000,
  rent: 980,
  utilities: 90,
  groceries: 260,
  transportation: 45,
  phone: 40,
  dining: 160,
  shopping: 70,
  subscriptions: 48,
  plannedTv: 220,
  springTrip: 1500,
  reserve: 400,
};

/** Fixed rate snapshot from 2026-10-21 (1 USD ≈ 1,327 KRW), not live. */
export const KRW_PER_USD = 1327;
export const MONTHS = 4; // Sep – Dec

export type PlanId = "essentials" | "balanced" | "flexible";

type Totals = ReturnType<typeof computeTotals>;

export function computeTotals(m: Record<MoneyKey, number>) {
  const resources = m.startingCash + m.familySupport + m.campusIncome;
  const essentialsMonthly = m.rent + m.utilities + m.groceries + m.transportation + m.phone;
  const flexibleMonthly = m.dining + m.shopping;
  const essentials = essentialsMonthly * MONTHS;
  const lifestyle = flexibleMonthly * MONTHS;
  const subscriptions = m.subscriptions * MONTHS;
  // The spring break trip is saved for separately, so only the TV counts here.
  const oneTime = m.plannedTv;
  const spending = essentials + lifestyle + subscriptions + oneTime;
  const ending = resources - spending;
  return {
    resources,
    essentialsMonthly,
    flexibleMonthly,
    essentials,
    lifestyle,
    subscriptions,
    oneTime,
    spending,
    ending,
    reserve: m.reserve,
    aboveReserve: ending - m.reserve,
  };
}

/** The three generated scenarios; "balanced" is exactly the user's inputs. */
export function computePlans(t: Totals) {
  const make = (id: PlanId, name: string, desc: string, spendDelta: number, flex: number) => {
    const spending = t.spending + spendDelta;
    const ending = t.resources - spending;
    return { id, name, desc, spending, ending, flexibleMonthly: flex, aboveReserve: ending - t.reserve };
  };
  return [
    make(
      "essentials",
      "Essentials First",
      "Covers the must-haves and keeps the largest safety buffer.",
      -580,
      Math.max(0, t.flexibleMonthly - 90),
    ),
    make(
      "balanced",
      "Balanced Semester",
      "Keeps essentials covered with room for spring break trip and everyday fun.",
      0,
      t.flexibleMonthly,
    ),
    make(
      "flexible",
      "More Flexible",
      "Makes more room for extras, but dips below your reserve target.",
      690,
      t.flexibleMonthly + 130,
    ),
  ];
}

/**
 * Family Space (Figma 1501:2437 / 1501:3586).
 * draft → Minji hasn't sent a plan · suggested → Mom asked for a lower flexible budget ·
 * agreed → the adjusted plan is approved and funded.
 */
export type FamilyStatus = "draft" | "suggested" | "agreed";

export type ChatMonth = "September" | "October" | "November";

export type ChatMessage = { from: "minji" | "mom"; text: string; time: string };

/** Mom's suggestion: flexible budget from the plan's amount down to this. */
export const SUGGESTED_FLEX = 150;

/** The event Minji adds from "Add Financial Event" (Figma: Laptop Repair). */
export type JourneyEvent = { name: string; category: string; amount: number; income: boolean };

export const DEFAULT_EVENT: JourneyEvent = { name: "Laptop Repair", category: "Unexpected Expense", amount: 420, income: false };

export type TravelPrefs = {
  from: string;
  to: string;
  start: string;
  end: string;
  people: number;
  styles: string[];
};

/** "2026-10-12" → "Oct. 12, 2026" (the travel form's pill format) */
export const fmtDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "Pick a date";
  const m = d.toLocaleDateString("en-US", { month: "short" });
  return `${m}. ${d.getDate()}, ${d.getFullYear()}`;
};

/** "Oct 12–15 · 4 days" */
export const fmtTripRange = (start: string, end: string) => {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return "Pick your dates";
  const days = Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1;
  const m = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
  const range = m(a) === m(b) ? `${m(a)} ${a.getDate()}–${b.getDate()}` : `${m(a)} ${a.getDate()} – ${m(b)} ${b.getDate()}`;
  return `${range} · ${days} day${days === 1 ? "" : "s"}`;
};

/** NYC fall-break fund (Figma travel 3): saved so far vs. the goal */
export const TRIP_SAVED = 400;
export const TRIP_GOAL = 700;

export const TRAVEL_STYLES = ["Budget friendly", "Food", "Fastest", "Most comfortable", "Easy transit"];

type AppState = {
  stage: Stage;
  setStage: (s: Stage) => void;
  money: Record<MoneyKey, number>;
  setMoney: (k: MoneyKey, v: number) => void;
  totals: Totals;
  bankConnected: boolean;
  setBankConnected: (b: boolean) => void;
  plan: PlanId;
  setPlan: (p: PlanId) => void;
  family: {
    status: FamilyStatus;
    /** monthly flexible budget in the plan Minji sent */
    originalFlex: number;
    /** monthly flexible budget currently on the table */
    flex: number;
    /** messages typed in the composer, per month thread */
    extra: Record<ChatMonth, ChatMessage[]>;
  };
  shareWithParents: () => void;
  acceptChange: () => void;
  proposeFlex: (flex: number) => void;
  sendMessage: (month: ChatMonth, text: string) => void;
  /** family support after any agreed change to the flexible budget */
  agreedSupport: number;
  travel: TravelPrefs;
  setTravel: (p: Partial<TravelPrefs>) => void;
  /** mid-semester journey: the added event, and whether the rest of the semester has played out */
  journey: { event: JourneyEvent | null; revealed: boolean };
  addJourneyEvent: (e: JourneyEvent) => void;
  revealJourney: () => void;
  resetDemo: () => void;
};

const Ctx = createContext<AppState | null>(null);

const EMPTY_THREADS: Record<ChatMonth, ChatMessage[]> = { September: [], October: [], November: [] };

const DEFAULT_TRAVEL: TravelPrefs = {
  from: "Pittsburgh, PA",
  to: "New york, NY",
  start: "2026-10-12",
  end: "2026-10-15",
  people: 2,
  styles: ["Budget friendly", "Food", "Easy transit"],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("before");
  const [bankConnected, setBankConnected] = useState(false);
  const [money, setMoneyState] = useState(DEFAULT_MONEY);
  const [plan, setPlan] = useState<PlanId>("balanced");
  const [travel, setTravelState] = useState(DEFAULT_TRAVEL);
  const [journey, setJourney] = useState<AppState["journey"]>({ event: null, revealed: false });
  const initialFlex = DEFAULT_MONEY.dining + DEFAULT_MONEY.shopping;
  const [family, setFamily] = useState<AppState["family"]>({
    status: "draft",
    originalFlex: initialFlex,
    flex: initialFlex,
    extra: EMPTY_THREADS,
  });

  // Demo links can open a point of the story directly, e.g. /journey?stage=end
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("stage");
    // Read after hydration so the server render (always "before") still matches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s === "before" || s === "during" || s === "end") setStage(s);
  }, []);

  const totals = useMemo(() => computeTotals(money), [money]);

  const setMoney = (k: MoneyKey, v: number) =>
    setMoneyState((m) => ({ ...m, [k]: Number.isFinite(v) ? Math.max(0, v) : 0 }));

  const shareWithParents = () => {
    const flex = computePlans(totals).find((p) => p.id === plan)?.flexibleMonthly ?? totals.flexibleMonthly;
    setFamily((f) => ({
      ...f,
      status: "suggested",
      originalFlex: flex,
      flex: Math.min(flex, SUGGESTED_FLEX),
    }));
  };

  const acceptChange = () => setFamily((f) => ({ ...f, status: "agreed" }));

  const proposeFlex = (flex: number) =>
    setFamily((f) => ({
      ...f,
      status: "agreed",
      flex,
      extra: {
        ...f.extra,
        September: [
          ...f.extra.September,
          { from: "minji", text: `Could we meet in the middle at ${usd(flex)}/mo for flexible spending?`, time: "Aug 13 · 9:12 PM" },
          { from: "mom", text: "That works for us. Approved!", time: "Aug 14 · 7:40 AM" },
        ],
      },
    }));

  const sendMessage = (month: ChatMonth, text: string) =>
    setFamily((f) => ({
      ...f,
      extra: { ...f.extra, [month]: [...f.extra[month], { from: "minji", text, time: "Just now" }] },
    }));

  /** Each $1/mo of flexible budget is $4 of family support over the semester. */
  const agreedSupport = money.familySupport - (family.originalFlex - family.flex) * MONTHS;

  const setTravel = (p: Partial<TravelPrefs>) => setTravelState((t) => ({ ...t, ...p }));

  const addJourneyEvent = (event: JourneyEvent) => setJourney({ event, revealed: false });
  const revealJourney = () => setJourney((j) => ({ ...j, revealed: true }));

  const resetDemo = () => {
    setStage("before");
    setBankConnected(false);
    setMoneyState(DEFAULT_MONEY);
    setPlan("balanced");
    setTravelState(DEFAULT_TRAVEL);
    setJourney({ event: null, revealed: false });
    setFamily({ status: "draft", originalFlex: initialFlex, flex: initialFlex, extra: EMPTY_THREADS });
  };

  return (
    <Ctx.Provider
      value={{
        stage,
        setStage,
        money,
        setMoney,
        totals,
        bankConnected,
        setBankConnected,
        plan,
        setPlan,
        family,
        shareWithParents,
        acceptChange,
        proposeFlex,
        sendMessage,
        agreedSupport,
        travel,
        setTravel,
        journey,
        addJourneyEvent,
        revealJourney,
        resetDemo,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}

const fmt = (n: number) => Math.round(Math.abs(n)).toLocaleString("en-US");
export const usd = (n: number) => `${n < 0 ? "−" : ""}$${fmt(n)}`;
export const krw = (n: number) => `${n < 0 ? "−" : ""}₩${fmt(n * KRW_PER_USD)}`;
