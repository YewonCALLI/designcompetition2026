"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Stage = "before" | "during";

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
  | "reserve";

/** Defaults match the Figma "build your starting point" screen. */
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
  reserve: 400,
};

export const KRW_PER_USD = 1390;
export const MONTHS = 4; // Sep – Dec

export type PlanId = "essentials" | "balanced" | "flexible";

/**
 * Family review flow (Figma: shared family view → parent view →
 * accept suggested → confirm new plan / family conversation).
 */
export type FamilyStatus = "draft" | "pending" | "suggested" | "countered" | "agreed";

export type Message = {
  from: "minji" | "parent" | "system";
  label: string;
  text: string;
  change?: [number, number];
};

type Totals = ReturnType<typeof computeTotals>;

export function computeTotals(m: Record<MoneyKey, number>) {
  const resources = m.startingCash + m.familySupport + m.campusIncome;
  const essentialsMonthly = m.rent + m.utilities + m.groceries + m.transportation + m.phone;
  const flexibleMonthly = m.dining + m.shopping;
  const essentials = essentialsMonthly * MONTHS;
  const lifestyle = flexibleMonthly * MONTHS;
  const subscriptions = m.subscriptions * MONTHS;
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
    /** monthly flexible budget currently on the table */
    flex: number;
    messages: Message[];
  };
  shareWithParents: () => void;
  parentSuggest: (flex: number, comment: string) => void;
  parentApprove: () => void;
  minjiAccept: () => void;
  minjiCounter: (flex: number, comment: string) => void;
  /** family support after any agreed change to the flexible budget */
  agreedSupport: number;
  confirmPlan: () => void;
  resetDemo: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("before");
  const [bankConnected, setBankConnected] = useState(false);
  const [money, setMoneyState] = useState(DEFAULT_MONEY);
  const [plan, setPlan] = useState<PlanId>("balanced");
  const [family, setFamily] = useState<AppState["family"]>({
    status: "draft",
    flex: DEFAULT_MONEY.dining + DEFAULT_MONEY.shopping,
    messages: [],
  });

  const totals = useMemo(() => computeTotals(money), [money]);

  const setMoney = (k: MoneyKey, v: number) =>
    setMoneyState((m) => ({ ...m, [k]: Number.isFinite(v) ? Math.max(0, v) : 0 }));

  const planName = computePlans(totals).find((p) => p.id === plan)?.name ?? "Balanced Semester";

  const shareWithParents = () =>
    setFamily((f) =>
      f.status !== "draft"
        ? f
        : {
            status: "pending",
            flex: totals.flexibleMonthly,
            messages: [
              {
                from: "minji",
                label: "Minji · plan shared",
                text: `I chose the ${planName} plan. It leaves room for a TV while keeping ${usd(
                  totals.aboveReserve,
                )} above my reserve.`,
              },
            ],
          },
    );

  const parentSuggest = (flex: number, comment: string) =>
    setFamily((f) => ({
      status: "suggested",
      flex,
      messages: [
        ...f.messages,
        {
          from: "parent",
          label: "Parent Account · suggested a change",
          text: comment,
          change: [f.flex, flex],
        },
      ],
    }));

  const parentApprove = () =>
    setFamily((f) => ({
      ...f,
      status: "agreed",
      messages: [
        ...f.messages,
        {
          from: "system",
          label: "Agreement reached",
          text: `Family support is set to ${usd(supportFor(f.flex))} for the semester.`,
        },
      ],
    }));

  const minjiAccept = parentApprove;

  const minjiCounter = (flex: number, comment: string) =>
    setFamily((f) => ({
      status: "countered",
      flex,
      messages: [
        ...f.messages,
        { from: "minji", label: "Minji · counterproposal", text: comment, change: [f.flex, flex] },
      ],
    }));

  /** Each $1/mo of flexible budget is $4 of family support over the semester. */
  function supportFor(flex: number) {
    return money.familySupport - (totals.flexibleMonthly - flex) * MONTHS;
  }

  const confirmPlan = () => setStage("during");

  const resetDemo = () => {
    setStage("before");
    setBankConnected(false);
    setMoneyState(DEFAULT_MONEY);
    setPlan("balanced");
    setFamily({ status: "draft", flex: DEFAULT_MONEY.dining + DEFAULT_MONEY.shopping, messages: [] });
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
        parentSuggest,
        parentApprove,
        minjiAccept,
        minjiCounter,
        agreedSupport: supportFor(family.flex),
        confirmPlan,
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
