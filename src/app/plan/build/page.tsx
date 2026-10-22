"use client";

import { FooterButton, Screen, StepHeader, TopBar } from "@/components/shell";
import { FieldGroup, MoneyField, type Kind } from "@/components/ui";
import { useApp, type MoneyKey } from "@/lib/store";

/* Figma 1501:1823 — "onboarding 3": build your starting point */

type Field = { key: MoneyKey; icon: string; inset?: string; label: string; kind: Kind; note?: string };

const USERS = "inset-[8.33%_11.11%_8.33%_5.56%]";
const GROUPS: { title: string; subtitle: string; shadow?: boolean; fields: Field[] }[] = [
  {
    title: "Money for the semester",
    subtitle: "Cash and income you expect between September and December.",
    fields: [
      { key: "startingCash", icon: "8ab4a", label: "Starting cash", kind: "Fixed" },
      { key: "familySupport", icon: "8dc74", inset: USERS, label: "Family support estimate", kind: "Estimate" },
      { key: "campusIncome", icon: "8ab4a", label: "Campus income", kind: "Recurring", note: "Total for four months" },
    ],
  },
  {
    title: "Monthly essentials",
    subtitle: "The recurring costs you need to cover first.",
    shadow: true,
    fields: [
      { key: "rent", icon: "cf7cc", inset: "inset-[13.89%_16.67%_13.89%_11.11%]", label: "Rent", kind: "Fixed", note: "Monthly" },
      { key: "utilities", icon: "31121", inset: USERS, label: "Utilities", kind: "Estimate", note: "Monthly estimate" },
      { key: "groceries", icon: "4cb58", inset: USERS, label: "Groceries", kind: "Estimate", note: "Monthly average" },
      { key: "transportation", icon: "ec46e", inset: USERS, label: "Transportation", kind: "Estimate" },
      { key: "phone", icon: "c0d8e", inset: "inset-[5.56%_11.11%_11.11%_5.56%]", label: "Phone", kind: "Fixed" },
    ],
  },
  {
    title: "Lifestyle",
    subtitle: "Flexible monthly spending that can change from plan to plan.",
    fields: [
      { key: "dining", icon: "8dc74", inset: USERS, label: "Dining & social", kind: "Estimate" },
      { key: "shopping", icon: "4cb58", inset: USERS, label: "Shopping", kind: "Estimate" },
      {
        key: "subscriptions",
        icon: "5cdfe",
        inset: "inset-[5.56%_11.11%_11.11%_5.56%]",
        label: "Subscriptions",
        kind: "Recurring",
        note: "Netflix, Spotify, and AI tools",
      },
    ],
  },
  {
    title: "One-time goals",
    subtitle: "A planned purchase and the cash buffer you want to protect.",
    fields: [
      { key: "plannedTv", icon: "4cb58", inset: USERS, label: "Planned TV", kind: "Estimate" },
      { key: "springTrip", icon: "ec46e", inset: "inset-[11.11%_11.11%_5.56%_5.56%]", label: "Spring Break Trip", kind: "Estimate" },
    ],
  },
];

const LEGEND: { kind: Kind; hint: string; dot: string }[] = [
  { kind: "Fixed", hint: "known amount", dot: "bg-mint" },
  { kind: "Recurring", hint: "repeats on schedule", dot: "bg-peri" },
  { kind: "Estimate", hint: "average or prediction", dot: "border border-peri bg-white" },
];

export default function BuildPage() {
  const { money, setMoney } = useApp();
  return (
    <Screen>
      <TopBar back={true} />
      <div className="flex w-full flex-col items-center gap-[40px]">
        <StepHeader
          step={3}
          title="Build your starting point"
          subtitle="Confirm what you have and what you expect to spend."
          subtitleWidth="w-[312px]"
        />

        <div className="mx-[24px] flex w-[calc(100%-48px)] flex-col rounded-[5px] border border-line bg-white p-[14px]">
          <p className="text-[16px] leading-[22px] font-semibold tracking-[-0.35px] text-ink">
            How amounts are classified
          </p>
          <div className="flex items-start justify-between pt-[9px]">
            {LEGEND.map((l) => (
              <div key={l.kind} className="flex items-center gap-[4px]">
                <span className={`size-[8px] shrink-0 rounded-[4px] ${l.dot}`} />
                <div className="flex flex-col whitespace-nowrap">
                  <span className="text-[12px] leading-[15px] text-ink">{l.kind}</span>
                  <span className="text-[10px] leading-[13.5px] text-muted-2">{l.hint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {GROUPS.map((g) => (
          <div key={g.title} className="w-full px-[24px]">
          <FieldGroup title={g.title} subtitle={g.subtitle} shadow={g.shadow}>
            {g.fields.map((f, i) => (
              <MoneyField
                key={f.key}
                icon={f.icon}
                iconInset={f.inset}
                label={f.label}
                kind={f.kind}
                note={f.note}
                value={money[f.key]}
                onChange={(v) => setMoney(f.key, v)}
                last={i === g.fields.length - 1}
              />
            ))}
          </FieldGroup>
          </div>
        ))}
      </div>
      <FooterButton href="/plan/review">Confirm my starting point</FooterButton>
    </Screen>
  );
}
