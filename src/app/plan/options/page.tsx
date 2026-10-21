"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/FigmaImg";
import { FooterButton, Screen, StepHeader, TopBar } from "@/components/shell";
import { computePlans, useApp, usd } from "@/lib/store";

/* Figma 1491:966 — "decide your plan" (step 5) */

export default function OptionsPage() {
  const router = useRouter();
  const { totals, plan, setPlan, money, shareWithParents } = useApp();
  const plans = computePlans(totals);
  const chosen = plans.find((p) => p.id === plan)!;

  return (
    <Screen>
      <TopBar back={true} />
      <div className="flex w-full flex-col gap-[40px]">
        <StepHeader
          step={5}
          progress={231}
          title={
            <span className="flex items-center justify-between gap-[10px]">
              Decide your plan
              <Link
                href="/plan/build"
                aria-label="Adjust inputs"
                className="flex rounded-[16px] border border-mint bg-mint-soft p-[4px]"
              >
                <Icon name="a7c86" className="size-[14px]" />
              </Link>
            </span>
          }
          subtitle="Choose the balance that feels right for you."
        />

        <div className="flex w-full flex-col items-center gap-[24px] py-[24px]">
          {plans.map((p, i) => {
            const selected = p.id === plan;
            const tag = p.id === "balanced" ? "recommended" : `option ${i + 1}`;
            const below = p.aboveReserve < 0;
            return (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                aria-pressed={selected}
                className={`flex w-[353px] flex-col gap-[12px] overflow-clip rounded-[5px] border-[1.397px] p-[12px] text-left transition-colors ${
                  selected ? "border-[#79ff5d] bg-mint" : "border-peri bg-peri-soft"
                }`}
              >
                <div className="flex w-full flex-col">
                  <div className="flex h-[26px] w-full items-center justify-between">
                    <p
                      className={`text-[12px] leading-[15px] font-medium tracking-[1.1px] uppercase ${
                        selected ? "text-black" : "text-peri-ink"
                      }`}
                    >
                      {tag}
                    </p>
                    {selected ? (
                      <span className="grid size-[24px] place-items-center rounded-[12px] border-[1.397px] border-[#20251f] bg-[#20251f]">
                        <Icon name="34784" className="size-[15px]" />
                      </span>
                    ) : (
                      <span className="size-[24px] rounded-[12px] border-[1.397px] border-[#7a87b7]" />
                    )}
                  </div>
                  <p className="text-[20px] leading-[24px] font-semibold text-ink">{p.name}</p>
                  <p className="pt-[4px] text-[10px] leading-[15px] text-muted-2">{p.desc}</p>
                </div>

                <div className="flex w-full flex-col">
                  <div className="grid grid-cols-[76px_1fr] items-center gap-[16px] pb-[17px]">
                    <div className="grid size-[76px] place-items-center rounded-[38px] border-[10.478px] border-white/92 bg-white/42">
                      <span className="text-[10px] leading-[15px] font-extrabold text-[#20251f]">
                        {usd(p.spending)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] leading-[15px] text-muted-2">Total semester spending</p>
                      <p className="pt-[2px] text-[24px] leading-[30px] font-bold tracking-[-0.45px] text-[#20251f]">
                        {usd(p.spending)}
                      </p>
                      <p className="pt-[2px] text-[10px] leading-[15px] text-muted-2">
                        {usd(p.ending)} projected ending cash
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t-[0.699px] border-[rgba(114,124,111,0.18)] py-[14px]">
                    <div>
                      <p className="text-[10px] leading-[15px] text-muted-2">Monthly flexible</p>
                      <p className="pt-[3px] text-[14px] leading-[21px] font-bold text-[#20251f]">
                        {usd(p.flexibleMonthly)}
                      </p>
                    </div>
                    <div className="border-l-[0.699px] border-[rgba(114,124,111,0.18)] pl-[18px]">
                      <p className="text-[10px] leading-[15px] text-muted-2">Family support</p>
                      <p className="pt-[3px] text-[14px] leading-[21px] font-bold text-[#20251f]">
                        {usd(money.familySupport)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex h-[30px] items-center">
                  <span
                    className={`rounded-full px-[8px] py-[5px] text-[9px] leading-[13.5px] font-bold ${
                      below ? "bg-[#f3c4bb] text-[#8b4b42]" : selected ? "bg-white text-black" : "bg-mint text-black"
                    }`}
                  >
                    {below ? `${usd(-p.aboveReserve)} below reserve` : `${usd(p.aboveReserve)} above reserve`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <FooterButton
        onClick={() => {
          shareWithParents();
          router.push("/family");
        }}
      >
        Continue with {chosen.name}
      </FooterButton>
    </Screen>
  );
}
