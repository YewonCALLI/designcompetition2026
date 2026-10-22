"use client";

import { useEffect, useState } from "react";
import { FigmaImg, Icon } from "@/components/FigmaImg";
import { Screen, TopBar } from "@/components/shell";
import { Segmented, Toast } from "@/components/ui";
import { krw, TRIP_GOAL, TRIP_SAVED, useApp, usd } from "@/lib/store";

/* Figma 1501:3979 "travel 4" — travel options against the trip savings */

type Plan = {
  id: "A" | "B" | "C";
  name: string;
  items: [string, number][];
  /** headline price from the design (Plan B's line items add up to $510 there) */
  price?: number;
  image: { name: string; box: string; img: string };
};

const PLANS: Plan[] = [
  {
    id: "A",
    name: "Plan A - Quick Getaway",
    items: [
      ["Bus", 60],
      ["Hostel", 120],
      ["Food", 80],
      ["Activities", 60],
    ],
    image: { name: "e2dfc", box: "top-[3px] left-[15px] h-[62px] w-[78px]", img: "top-[-6.45%] h-[125.81%] w-full" },
  },
  {
    id: "B",
    name: "Plan B - Balanced Trip",
    price: 560,
    items: [
      ["Train", 160],
      ["Hotel", 210],
      ["Food", 80],
      ["Activities", 60],
    ],
    image: { name: "70ef2", box: "top-[4px] left-[12px] h-[63px] w-[88px]", img: "top-[-20.63%] h-[139.68%] w-full" },
  },
  {
    id: "C",
    name: "Plan C - Luxurious Trip",
    items: [
      ["Plane", 300],
      ["Hotel", 270],
      ["Food", 150],
      ["Activities", 100],
    ],
    image: { name: "f42d7", box: "top-[4px] left-[24px] size-[64px]", img: "inset-0 size-full object-cover" },
  },
];

const total = (p: Plan) => p.price ?? p.items.reduce((s, [, v]) => s + v, 0);

function status(cost: number) {
  if (cost <= TRIP_SAVED) return { label: "Affordable now", tone: "bg-[#cefca8]" };
  if (cost <= TRIP_GOAL) return { label: "Within Trip Goal", tone: "bg-[#e4cdf7]" };
  return { label: "Above Trip Goal", tone: "bg-[#ffa49a]" };
}

type Filter = "all" | "budget" | "comfort";

export default function TravelOptionsPage() {
  const { travel } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [chosen, setChosen] = useState<Plan["id"]>("A");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const plans =
    filter === "budget"
      ? PLANS.filter((p) => total(p) <= TRIP_GOAL)
      : filter === "comfort"
        ? [...PLANS].sort((a, b) => total(b) - total(a))
        : PLANS;

  return (
    <Screen>
      <TopBar back="/compare/travel/summary" backIcon="c00f9" />
      <h1 className="mt-[14px] px-[24px] text-[20px] leading-[24px] font-semibold text-black">Travel Options</h1>

      <Segmented
        className="mx-[24px] mt-[18px] h-[33px] rounded-[6.572px] bg-[#f3f3f3] p-[1.972px]"
        activeClass="bg-peri !rounded-[10px] !text-ink-2"
        textClass="h-[29px] text-[12px] leading-[9.858px] font-[750] text-[rgba(115,115,115,0.45)]"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All Plans" },
          { value: "budget", label: "Budget First" },
          { value: "comfort", label: "More Comfort" },
        ]}
      />

      <div className="mt-[16px] px-[24px]">
        <p className="text-[12px] font-bold text-[#19213b]">Based on your ${TRIP_SAVED} savings</p>
        <p className="mt-[2px] text-[11px] text-[#75809b]">Compare what fits now and what needs more saving.</p>
      </div>

      <div className="mt-[16px] flex flex-col gap-[10px] px-[24px]">
        {plans.map((p) => {
          const cost = total(p);
          const s = status(cost);
          const left = TRIP_SAVED - cost;
          const on = chosen === p.id;
          return (
            <article
              key={p.id}
              onClick={() => setChosen(p.id)}
              className={`relative h-[238px] w-full cursor-pointer rounded-[10px] border bg-white transition-colors ${
                on ? "border-peri" : "border-[#d6d6d6]"
              }`}
            >
              <span className={`absolute top-[13px] left-[12px] flex h-[25px] w-[134px] items-center justify-center rounded-[10px] font-inter text-[10px] font-bold text-black ${s.tone}`}>
                {s.label}
              </span>
              <div className="absolute top-[6px] right-[12px] flex flex-col items-end">
                <p className="text-[23px] font-bold text-[#19213b]">{usd(cost)}</p>
                <p className="-mt-[2px] text-[10px] text-[#75809b]">≈ {krw(cost)}</p>
              </div>
              <p className="absolute top-[48px] left-[15px] text-[15px] font-bold whitespace-nowrap text-[#19213b]">{p.name}</p>

              <div className="absolute top-[78px] left-[15px] h-[71px] w-[113px] rounded-[10px] border border-[#e4e4e4] bg-white">
                <div className={`absolute overflow-hidden ${p.image.box}`}>
                  <FigmaImg name={p.image.name} ext="png" className={`pointer-events-none absolute left-0 ${p.image.img}`} />
                </div>
              </div>

              <dl className="absolute top-[79px] right-[12px] left-[139px] flex flex-col gap-[3px]">
                {p.items.map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <dt className="text-[#75809b]">{k}</dt>
                    <dd className="font-bold text-[#19213b]">{usd(v)}</dd>
                  </div>
                ))}
              </dl>

              <Icon name="af70b" className="absolute top-[163px] right-[12px] left-[12px] h-0" inset="inset-[-0.75px_-0.23%]" />
              <p className="absolute top-[170px] left-[12px] font-inter text-[11px] font-bold text-black/60">
                {left >= 0 ? `${usd(left)} remains from your savings` : `Save ${usd(-left)} more to choose this`}
              </p>
              <p className="absolute top-[170px] right-[12px] text-[11px] text-[#75809b]">{travel.people} friends</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChosen(p.id);
                  setToast(
                    left >= 0
                      ? `${p.name.split(" - ")[1]} fits your savings — added to your journey`
                      : `${p.name.split(" - ")[1]} saved as a goal · ${usd(-left)} to go`,
                  );
                }}
                className="absolute top-[195px] right-[12px] left-[12px] flex h-[27px] items-center justify-center rounded-[10px] bg-mint font-inter text-[14px] font-bold text-black transition active:scale-[0.98]"
              >
                View Plan
              </button>
            </article>
          );
        })}
      </div>
      <Toast show={!!toast}>{toast}</Toast>
    </Screen>
  );
}
