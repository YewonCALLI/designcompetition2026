"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/FigmaImg";
import { FooterButton, Screen, TopBar } from "@/components/shell";
import { PageTitle } from "@/components/ui";
import { useApp, usd } from "@/lib/store";

/* Figma 1501:3492 — "add financial event" */

const CURRENT_ENDING = 752;
const field =
  "min-h-[48px] w-full rounded-[10px] border-[0.625px] border-[#e5e5e5] bg-white px-[13px] font-inter text-[13px] text-ink-2 outline-none focus:border-peri";

export default function NewEventPage() {
  const router = useRouter();
  const [name, setName] = useState("Laptop Repair");
  const [category, setCategory] = useState("Unexpected Expense");
  const [amount, setAmount] = useState(300);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Planned");
  const [essential, setEssential] = useState(true);
  const [notes, setNotes] = useState("Repair needed for coursework. Cost is still an estimate.");

  const { addJourneyEvent } = useApp();
  const income = category === "Income";
  const delta = income ? amount : -amount;

  return (
    <Screen>
      <TopBar back="/journey" />
      <div className="flex w-full flex-col gap-[24px]">
        <PageTitle>Add Financial Event</PageTitle>

        <div className="flex w-full flex-col gap-[9px] px-[24px]">
          <Label text="Event name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="min-h-[42.88px] w-full rounded-[10px] border-[0.558px] border-[#e5e5e5] bg-white px-[11.614px] font-inter text-[11.614px] text-ink-2 outline-none focus:border-peri" />
          </Label>

          <Label text="Category">
            <Select value={category} onChange={setCategory} options={["Unexpected Expense", "Planned Purchase", "Bill", "Income", "Savings Goal"]} />
          </Label>

          <div className="grid grid-cols-2 gap-[9px]">
            <Label text="Estimated amount">
              <div className={`${field} flex items-center`}>
                <span className="pr-[4px] font-inter text-[16px] leading-[24px] font-medium text-[#737373]">$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full min-w-0 bg-transparent outline-none"
                />
              </div>
            </Label>
            <Label text="Expected date">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
            </Label>
          </div>

          <Label text="Status">
            <Select value={status} onChange={setStatus} options={["Planned", "Completed"]} />
          </Label>

          <label className="flex h-[47px] min-h-[47px] cursor-pointer items-center justify-between rounded-[10px] border-[0.625px] border-[#e5e5e5] bg-white px-[13px]">
            <span className="font-inter text-[10px] leading-[15px] text-ink-2">Essential expense</span>
            <input type="checkbox" checked={essential} onChange={(e) => setEssential(e.target.checked)} className="peer sr-only" />
            <span
              aria-hidden
              className={`grid size-[13px] place-items-center rounded-[2px] border ${
                essential ? "border-ink-2 bg-ink-2" : "border-[#767676] bg-white"
              } peer-focus-visible:ring-2 peer-focus-visible:ring-peri`}
            >
              {essential && <Icon name="3c2de" className="size-[11px]" />}
            </span>
          </label>

          <Label text="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${field} min-h-[145px] resize-none p-[13px] font-sans text-[12px] leading-[18px]`}
            />
          </Label>
        </div>

        <div className="mx-[24px] flex flex-col rounded-[10px] bg-peri p-[14.132px]">
          <p className="text-[8.832px] leading-[11.924px] font-extrabold tracking-[0.8832px] text-black uppercase">
            Projected impact
          </p>
          {[
            ["Current projected ending", usd(CURRENT_ENDING)],
            ["Event estimate", `${delta >= 0 ? "+" : ""}${usd(delta)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex h-[45.8px] items-center justify-between border-b-[0.609px] border-[rgba(17,17,17,0.12)]">
              <span className="text-[10.721px] leading-[16.082px] text-black">{k}</span>
              <span className="text-[10.721px] leading-[16.082px] font-bold text-ink-2">{v}</span>
            </div>
          ))}
          <div className="flex h-[45.8px] items-center justify-between border-b-[0.609px] border-[rgba(17,17,17,0.12)]">
            <span className="text-[11.696px] leading-[17.544px] font-extrabold text-black">Updated projection</span>
            <span className="text-[11.696px] leading-[17.544px] font-black text-ink-2">{usd(CURRENT_ENDING + delta)}</span>
          </div>
          <p className="pt-[8.772px] font-inter text-[7.797px] leading-[11.306px] text-[#665b2f]">
            Actual cash changes only if this event is recorded as completed.
          </p>
        </div>
      </div>
      <FooterButton
        onClick={() => {
          addJourneyEvent({ name: name.trim(), category, amount, income });
          router.push("/journey");
        }}
        disabled={!name.trim()}
      >
        Add to my journey
      </FooterButton>
    </Screen>
  );
}

function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="text-[11px] leading-[16.5px] font-[680] whitespace-nowrap text-[#555]">{text}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${field} cursor-pointer appearance-none pr-[36px] pl-[17px] text-[13px]`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute top-0 right-0 flex h-full w-[20px] items-center justify-center">
        <Icon name="8781c" className="h-[6px] w-[10px]" inset="inset-[0_0_-12.5%_-117.5%]" />
      </span>
    </div>
  );
}
