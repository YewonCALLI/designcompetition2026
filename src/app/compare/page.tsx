"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/FigmaImg";
import { Screen, TopBar } from "@/components/shell";
import { Toast } from "@/components/ui";

/* Figma 1501:3741 "travel 1" — what would you like to compare? */

type Category = { key: string; title: string; sub: string; glyph: ReactNode; href?: string };

const CATEGORIES: Category[] = [
  {
    key: "travel",
    title: "Travel",
    sub: "Flights, trains, buses",
    href: "/compare/travel",
    glyph: <Icon name="b6bce" className="absolute top-[11px] left-[6px] h-[20px] w-[28px]" />,
  },
  {
    key: "food",
    title: "Food & Groceries",
    sub: "Restaurants, groceries, cafes",
    glyph: <Icon name="27924" className="absolute top-[11px] left-[10px] h-[20px] w-[22px]" inset="inset-[-2.5%_-2.28%_-2.5%_-2.27%]" />,
  },
  {
    key: "shopping",
    title: "Shopping",
    sub: "Stores, markets, purchases",
    glyph: (
      <span className="absolute top-[8px] left-[9.5px] size-[24px]">
        <Icon name="3ade4" className="absolute inset-[8.33%_13.2%]" inset="inset-[-5%_-5.66%]" />
      </span>
    ),
  },
  {
    key: "activities",
    title: "Activities",
    sub: "Museum, tours, events",
    glyph: (
      <span className="absolute top-[9px] left-[10px] size-[24px]">
        <Icon name="1a652" className="absolute inset-[8.33%]" inset="inset-[-5%]" />
      </span>
    ),
  },
  {
    key: "transport",
    title: "Local Transportation",
    sub: "Subways, taxis, transit passes",
    glyph: <Icon name="0aaa6" className="absolute top-[9px] left-[9.5px] size-[24px]" />,
  },
  {
    key: "stay",
    title: "Accomodation",
    sub: "Hotels, hostels, airbnb",
    glyph: <Icon name="8e317" className="absolute top-[11px] left-[11px] size-[20px]" />,
  },
];

export default function ComparePage() {
  const router = useRouter();
  const [selected, setSelected] = useState("travel");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <Screen>
      <TopBar back="/" backIcon="c00f9" />
      <div className="mt-[14px] flex w-full flex-col px-[24px]">
        <h1 className="pl-px text-[20px] leading-[24px] font-semibold text-black">
          What would you like
          <br />
          to compare?
        </h1>
        <p className="mt-[8px] text-[13px] text-[#7d88a1]">
          Choose a category to see options that fit your
          <br />
          budget and preferences.
        </p>

        <ul className="mt-[20px] flex flex-col gap-[7px]">
          {CATEGORIES.map((c) => {
            const on = c.key === selected;
            return (
              <li key={c.key}>
                <button
                  onClick={() => {
                    setSelected(c.key);
                    if (c.href) router.push(c.href);
                    else setToast(`${c.title} comparisons are coming soon`);
                  }}
                  className={`relative h-[68px] w-full rounded-[10px] text-left transition active:scale-[0.99] ${
                    on ? "bg-[#b3cafd]" : "border border-[#efe9e9] bg-white"
                  }`}
                >
                  <span className="absolute top-[13px] left-[18px] size-[42px]">
                    <Icon name={on ? "0814d" : "988bc"} className="absolute inset-0" />
                    {c.glyph}
                  </span>
                  <span className="absolute top-[17px] left-[74px] text-[14px] font-bold whitespace-nowrap text-[#14182a]">{c.title}</span>
                  <span className="absolute top-[36px] left-[74px] text-[11px] whitespace-nowrap text-[#494a4e]">{c.sub}</span>
                  <Icon name="5fdb7" className="absolute top-[30px] right-[23px] h-[12px] w-[6px]" inset="inset-[-8.33%_-16.67%]" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <Toast show={!!toast}>{toast}</Toast>
    </Screen>
  );
}
