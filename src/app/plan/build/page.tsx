"use client";

import { FooterButton, Screen, StepHeader, TopBar } from "@/components/shell";
import { FieldGroup, MoneyField, type Kind } from "@/components/ui";
import { useApp, type MoneyKey } from "@/lib/store";

/* Figma 1491:516 — "build your starting point" (step 3) */

type Field = { key: MoneyKey; icon: string; label: string; kind: Kind; note?: string };

const GROUPS: { title: string; subtitle: string; shadow?: boolean; fields: Field[] }[] = [
  {
    title: "Money for the semester",
    subtitle: "Cash and income you expect between September and December.",
    fields: [
      { key: "startingCash", icon: "512d2", label: "Starting cash", kind: "Fixed" },
      { key: "familySupport", icon: "92159", label: "Family support estimate", kind: "Estimate" },
      { key: "campusIncome", icon: "d19c9", label: "Campus income", kind: "Recurring", note: "Total for four months" },
    ],
  },
  {
    title: "Monthly essentials",
    subtitle: "The recurring costs you need to cover first.",
    shadow: true,
    fields: [
      { key: "rent", icon: "ed1ee", label: "Rent", kind: "Fixed", note: "Monthly" },
      { key: "utilities", icon: "595f5", label: "Utilities", kind: "Estimate", note: "Monthly estimate" },
      { key: "groceries", icon: "fae60", label: "Groceries", kind: "Estimate", note: "Monthly average" },
      { key: "transportation", icon: "fb22b", label: "Transportation", kind: "Estimate" },
      { key: "phone", icon: "41666", label: "Phone", kind: "Fixed" },
    ],
  },
  {
    title: "Lifestyle",
    subtitle: "Flexible monthly spending that can change from plan to plan.",
    fields: [
      { key: "dining", icon: "df155", label: "Dining & social", kind: "Estimate" },
      { key: "shopping", icon: "30643", label: "Shopping", kind: "Estimate" },
      { key: "subscriptions", icon: "3fcff", label: "Subscriptions", kind: "Recurring", note: "Netflix, Spotify, and AI tools" },
    ],
  },
  {
    title: "One-time goals",
    subtitle: "A planned purchase and the cash buffer you want to protect.",
    fields: [
      { key: "plannedTv", icon: "df61d", label: "Planned TV", kind: "Estimate" },
      { key: "reserve", icon: "55483", label: "Spring Break Trip", kind: "Fixed" },
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
          progress={166}
          title="Build your starting point"
          subtitle="Confirm what you have and what you expect to spend."
          subtitleWidth="w-[312px]"
        />

        <div className="flex w-[353px] flex-col rounded-[5px] border border-line bg-white p-[14px]">
          <p className="text-[16px] leading-[22px] font-semibold tracking-[-0.35px] text-ink">
            How amounts are classified
          </p>
          <div className="grid grid-cols-3 gap-[7px] pt-[9px]">
            {LEGEND.map((l) => (
              <div key={l.kind} className="grid grid-cols-[8px_1fr] items-center gap-x-[5px]">
                <span className={`row-span-2 size-[8px] rounded-[4px] ${l.dot}`} />
                <span className="text-[9px] leading-[13.5px] font-semibold text-ink">{l.kind}</span>
                <span className="text-[7px] leading-[11px] whitespace-nowrap text-muted-2">{l.hint}</span>
              </div>
            ))}
          </div>
        </div>

        {GROUPS.map((g) => (
          <FieldGroup key={g.title} title={g.title} subtitle={g.subtitle} shadow={g.shadow}>
            {g.fields.map((f, i) => (
              <MoneyField
                key={f.key}
                icon={f.icon}
                label={f.label}
                kind={f.kind}
                note={f.note}
                value={money[f.key]}
                onChange={(v) => setMoney(f.key, v)}
                last={i === g.fields.length - 1}
              />
            ))}
          </FieldGroup>
        ))}
      </div>
      <FooterButton href="/plan/review">Confirm my starting point</FooterButton>
    </Screen>
  );
}
