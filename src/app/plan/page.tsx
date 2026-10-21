"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/FigmaImg";
import { PrimaryButton, Screen, StepHeader, TopBar } from "@/components/shell";
import { useApp } from "@/lib/store";

/* Figma 1491:328 — "lets map out your sem" (step 1) */

const PROMISES = [
  { title: "Read-only access", body: "AVIA cannot move money." },
  { title: "Private by default", body: "Parents don’t see private transactions." },
  { title: "You’re in control", body: "Edit findings or disconnect anytime." },
];

export default function PlanStartPage() {
  const router = useRouter();
  const { setBankConnected } = useApp();
  const [permission, setPermission] = useState(false);

  return (
    <Screen>
      <TopBar back="/" />
      <div className="flex w-full flex-col gap-[40px]">
        <StepHeader
          step={1}
          progress={56}
          title="Let’s map out your semester"
          subtitle="You don’t need to know every number. Choose a starting point and we’ll guide you from there."
        />

        <div className="flex w-full flex-col gap-[24px] px-[20px]">
          <p className="text-[16px] leading-[15px] font-bold text-muted uppercase">methods</p>

          {/* Connect my bank */}
          <div className="flex w-full flex-col gap-[32px] rounded-[5px] border border-peri bg-peri-soft px-[16px] py-[24px]">
            <div className="flex w-full flex-col gap-[20px]">
              <div className="flex w-full flex-col">
                <div className="flex w-full justify-end">
                  <span className="rounded-[5px] bg-mint px-[8px] py-[2px] text-[12px] leading-[15px] font-medium text-black uppercase">
                    easiest start
                  </span>
                </div>
                <div className="flex items-center gap-[9px]">
                  <Icon name="1b56d" className="h-[40.218px] w-[48px]" inset="inset-[-1.24%_-1.04%_-1.24%_0]" />
                  <p className="text-[20px] leading-[24px] font-semibold whitespace-nowrap text-black">
                    Connect My Bank
                  </p>
                </div>
              </div>

              <ul className="flex w-full flex-col gap-[16px]">
                {PROMISES.map((p) => (
                  <li key={p.title} className="relative flex w-full items-center gap-[16px] px-[24px]">
                    <span className="absolute top-[6.78px] left-[20.5px] size-[24px] rounded-[4.516px] border-[0.903px] border-black" />
                    <Icon name="31e79" className="size-[19px]" />
                    <div className="flex flex-col gap-[8px] leading-[15px] text-black">
                      <p className="text-[14px] font-semibold">{p.title}</p>
                      <p className="text-[12px]">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <label className="flex w-full cursor-pointer items-center justify-between">
              <span className="text-[14px] leading-[24px] font-semibold text-black">Give AVIA permission</span>
              <input
                type="checkbox"
                checked={permission}
                onChange={(e) => setPermission(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`grid size-[24px] place-items-center rounded-[5px] transition-colors ${
                  permission ? "bg-ink text-white" : "bg-[#d9d9d9]"
                } peer-focus-visible:ring-2 peer-focus-visible:ring-peri`}
              >
                {permission && (
                  <svg viewBox="0 0 16 16" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                )}
              </span>
            </label>

            <div className="flex w-full flex-col items-center">
              <PrimaryButton
                disabled={!permission}
                onClick={() => {
                  setBankConnected(true);
                  router.push("/plan/found");
                }}
              >
                Connect
              </PrimaryButton>
              {!permission && (
                <p className="mt-[8px] text-[10px] leading-[15px] text-muted">
                  Tick “Give AVIA permission” to connect.
                </p>
              )}
            </div>
          </div>

          {/* Enter it myself */}
          <Link
            href="/plan/build"
            className="flex w-full items-center gap-[20px] rounded-[5px] border border-[#e1e1e1] bg-white px-[24px] py-[12px] transition active:scale-[0.99]"
          >
            <div className="flex flex-1 items-center gap-[9px]">
              <span className="flex rounded-[24.5px] bg-mint pt-[12px] pr-[12px] pb-[13px] pl-[13px]">
                <Icon name="aa2e8" className="size-[18px]" />
              </span>
              <div className="flex flex-col whitespace-nowrap text-black">
                <p className="text-[16px] leading-[22px] font-semibold tracking-[-0.35px]">Enter It Myself</p>
                <p className="text-[12px] leading-[24px]">Use a simple guided budget form</p>
              </div>
            </div>
            <span className="flex-none rotate-180 -scale-y-100">
              <Icon name="cf3b0" className="h-[22.002px] w-[22.001px]" inset="inset-[-2.27%]" />
            </span>
          </Link>
        </div>
      </div>
    </Screen>
  );
}
