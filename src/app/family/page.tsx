"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/FigmaImg";
import { PrimaryButton, Screen, TopBar } from "@/components/shell";
import {
  ChatBubble,
  CurrencyToggle,
  DualAmount,
  FooterNav,
  PageTitle,
  Segmented,
  type CurrencyMode,
} from "@/components/ui";
import { computePlans, krw, MONTHS, useApp, usd, type FamilyStatus } from "@/lib/store";

/*
 * Figma: 1491:1927 shared family view · 1491:2440 parent view ·
 * 1491:2083 accept suggested · 1491:2269 confirm new plan · 1491:2395 family conversation
 */

const STATUS_CHIP: Record<FamilyStatus, string> = {
  draft: "draft",
  pending: "shared & pending",
  suggested: "change suggested",
  countered: "counter sent",
  agreed: "agreed",
};

export default function FamilyPage() {
  const app = useApp();
  const { family, totals, money, plan } = app;
  const [view, setView] = useState<"minji" | "parent">("minji");
  const [mode, setMode] = useState<CurrencyMode>("Both");

  const planName = computePlans(totals).find((p) => p.id === plan)!.name;
  const flexTotal = family.status === "agreed" ? family.flex * MONTHS : totals.lifestyle;
  const rows = [
    { label: "Essential expenses", value: totals.essentials },
    { label: "Flexible spending", value: flexTotal },
    { label: "Subscriptions", value: totals.subscriptions },
    { label: "Protected reserve", value: totals.reserve },
  ];

  return (
    <Screen>
      <TopBar back={true} />
      <div className="flex w-full flex-col gap-[24px]">
        <PageTitle>Minji’s Fall 2026 Plan</PageTitle>

        <Segmented
          className="mx-auto h-[45px] w-[353px] rounded-[5px] bg-[#f0f1ef] p-[4px]"
          value={view}
          onChange={setView}
          options={[
            { value: "minji", label: "Minji view" },
            { value: "parent", label: "Preview parent view" },
          ]}
        />

        <section className="mx-auto flex w-[353px] flex-col rounded-[5px]">
          <div className="flex w-full flex-col gap-[12px]">
            <div className="flex w-full items-center gap-[12px]">
              <h2 className="flex-1 pt-[3px] text-[17px] leading-[25.5px] font-semibold text-ink">{planName}</h2>
              <span className="rounded-full bg-mint px-[8px] py-[5px] text-[10px] leading-[15px] font-medium tracking-[1.1px] text-black uppercase">
                {STATUS_CHIP[family.status]}
              </span>
            </div>
            <CurrencyToggle value={mode} onChange={setMode} tone="grey" />
          </div>

          {view === "minji" && family.status === "agreed" ? (
            <AgreedCard mode={mode} />
          ) : (
            <DualAmount
              amount={money.familySupport}
              mode={mode}
              line="63953"
              label={
                <p className="text-[12px] leading-[15px] font-medium tracking-[1.1px] text-ink uppercase">
                  proposed family support
                </p>
              }
            />
          )}

          <CategoryRows rows={rows} mode={mode} withIcons={family.status === "pending" && view === "minji"} />
          <CompareOptions mode={mode} />
        </section>

        {view === "minji" ? <MinjiConversation /> : <ParentRespond />}
      </div>
      <FooterNav />
    </Screen>
  );
}

/* ───────────── pieces ───────────── */

function money(n: number, mode: CurrencyMode) {
  if (mode === "USD") return { main: usd(n) };
  if (mode === "KRW") return { main: krw(n) };
  return { main: usd(n), sub: krw(n) };
}

function CategoryRows({
  rows,
  mode,
  withIcons,
}: {
  rows: { label: string; value: number }[];
  mode: CurrencyMode;
  withIcons: boolean;
}) {
  return (
    <div className="pt-[12px]">
      <div
        className={`flex w-full flex-col overflow-clip rounded-[5px] border ${
          withIcons ? "border-line bg-white" : "border-muted"
        }`}
      >
        {rows.map((r, i) => {
          const m = money(r.value, mode);
          const last = i === rows.length - 1;
          return (
            <div
              key={r.label}
              className={`flex h-[48px] min-h-[48px] items-center justify-between px-[12px] py-[10px] ${
                last ? "" : withIcons ? "border-b border-track" : "border-b border-muted"
              }`}
            >
              {withIcons ? (
                <div className="flex items-center gap-[12px]">
                  <span className="grid size-[32px] place-items-center rounded-[16px] bg-peri-chip">
                    <Icon name="df155" className="size-[18px]" />
                  </span>
                  <span className="text-[12px] leading-[15px] text-black">{r.label}</span>
                </div>
              ) : (
                <span className="font-inter text-[10px] leading-[15px] text-black">{r.label}</span>
              )}
              <div className="flex flex-col items-end gap-px">
                <span
                  className={
                    withIcons
                      ? "text-right text-[12px] leading-[15px] text-black"
                      : "text-right font-inter text-[10px] leading-[10.8px] text-black"
                  }
                >
                  {m.main}
                </span>
                {m.sub && (
                  <span
                    className={
                      withIcons
                        ? "text-right text-[10px] leading-[13.5px] text-black opacity-72"
                        : "text-right font-inter text-[7.2px] leading-[7.776px] text-black opacity-72"
                    }
                  >
                    {m.sub}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompareOptions({ mode }: { mode: CurrencyMode }) {
  const { totals, plan, money: m } = useApp();
  const plans = computePlans(totals);
  return (
    <div className="pt-[12px]">
      <div className="flex w-full flex-col rounded-[16px] bg-[#f8f8f6]">
        <p className="text-[12px] leading-[15px] font-medium tracking-[1.1px] text-black uppercase">
          compare options
        </p>
        <div className="flex flex-col gap-[6px] pt-[8px]">
          {plans.map((p) => {
            const amt = money(m.familySupport, mode);
            return (
              <div
                key={p.id}
                className={`flex h-[39px] min-h-[39px] items-center justify-between rounded-[5px] px-[9px] py-[7px] ${
                  p.id === plan ? "border border-peri bg-peri-soft" : "bg-[#f0f1ef]"
                }`}
              >
                <span className="font-inter text-[9px] leading-[13.5px] text-black">{p.name}</span>
                <span className="flex flex-col items-end gap-px font-inter font-bold text-black">
                  <span className="text-[9px] leading-[9.72px]">{amt.main}</span>
                  {amt.sub && <span className="text-[6.48px] leading-[7px] opacity-72">{amt.sub}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AgreedCard({ mode }: { mode: CurrencyMode }) {
  const router = useRouter();
  const { agreedSupport, confirmPlan, stage } = useApp();
  return (
    <div className="pt-[12px]">
      <div className="flex w-full flex-col gap-[10px] rounded-[20px] border border-[#79da68] bg-mint px-[21px] py-[13px]">
        <DualAmount
          amount={agreedSupport}
          mode={mode}
          line="251be"
          label={
            <p className="text-[12px] leading-[15px] font-medium tracking-[1.1px] text-ink uppercase">
              new plan agreed
            </p>
          }
        />
        <button
          onClick={() => {
            confirmPlan();
            router.push("/");
          }}
          className="flex min-h-[48px] items-center justify-center rounded-[13px] bg-ink px-[24px] py-[14px] text-[12px] leading-[18px] text-white transition active:scale-[0.98]"
        >
          {stage === "during" ? "Back to Home" : "Confirm Semester Plan"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[353px] pt-[12px]">
      <div className="flex w-full flex-col rounded-[5px] border border-line bg-white p-[18px]">
        <h2 className="pt-[3px] text-[17px] leading-[25.5px] font-semibold text-ink">{title}</h2>
        <div className="pt-[14px]">{children}</div>
      </div>
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="grid grid-cols-[44px_1fr_44px] items-center gap-[8px]">
      <button
        aria-label="Decrease"
        onClick={() => onChange(Math.max(0, value - 10))}
        className="flex h-[42px] items-center justify-center rounded-[5px] bg-peri-soft text-[20px] leading-[30px] text-ink active:bg-peri"
      >
        −
      </button>
      <p className="text-center text-ink">
        <span className="text-[25px] leading-[22px] font-semibold tracking-[-0.35px]">{usd(value)}</span>
        <span className="text-[10px] leading-[13.5px]">/mo</span>
      </p>
      <button
        aria-label="Increase"
        onClick={() => onChange(value + 10)}
        className="flex h-[42px] items-center justify-center rounded-[5px] bg-peri-soft text-[20px] leading-[30px] text-ink active:bg-peri"
      >
        +
      </button>
    </div>
  );
}

function OutlineBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-[135px] items-center justify-center rounded-[5px] border border-line bg-white px-[24px] py-[12px] text-center text-[10px] leading-[13.5px] text-ink active:bg-[#f3f3f3]"
    >
      {children}
    </button>
  );
}

function MintBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-[135px] items-center justify-center self-stretch rounded-[5px] border border-mint bg-mint px-[24px] py-[12px] text-center text-[10px] leading-[13.5px] text-black active:brightness-95"
    >
      {children}
    </button>
  );
}

/* Minji's side of the conversation */
function MinjiConversation() {
  const { family, totals, money: m, shareWithParents, minjiAccept, minjiCounter } = useApp();
  const [countering, setCountering] = useState(false);
  const [counter, setCounter] = useState(180);
  const [note, setNote] = useState(
    "Could we meet at $180 a month? I can keep shopping lower and review it again in October.",
  );

  if (family.status === "draft") {
    return (
      <Card title="Family Conversation">
        <p className="pb-[14px] text-[12px] leading-[15px] text-muted">
          Share this plan with HyunWoo to start the conversation. They’ll see every amount in USD and KRW.
        </p>
        <PrimaryButton onClick={shareWithParents} className="w-full">
          Share with parents
        </PrimaryButton>
      </Card>
    );
  }

  const last = family.messages[family.messages.length - 1];
  const suggestedSupport = m.familySupport - (totals.flexibleMonthly - family.flex) * MONTHS;

  return (
    <Card title="Family Conversation">
      <div className="flex w-full flex-col gap-[8px]">
        {family.messages.map((msg, i) => (
          <ChatBubble key={i} m={msg} />
        ))}
        {family.status === "pending" && (
          <ChatBubble m={{ from: "parent", label: "HyunWoo · received", text: "Reviewing..." }} />
        )}
        {family.status === "countered" && (
          <p className="pt-[4px] text-center text-[10px] leading-[13.5px] text-muted">
            Waiting for HyunWoo — try “Preview parent view” to respond.
          </p>
        )}
      </div>

      {family.status === "suggested" && last?.change && (
        <div className="mt-[14px] flex w-full flex-col rounded-[5px] border border-line bg-[#f9faf7] p-[15px]">
          <h3 className="text-[16px] leading-[22px] font-semibold tracking-[-0.35px] text-ink">
            Your parents suggested a change
          </h3>
          <div className="mt-[12px] grid h-[78px] grid-cols-2 overflow-clip rounded-[5px] border border-line">
            <div className="flex flex-col bg-white p-[12px]">
              <p className="text-[10px] leading-[13.5px] text-muted-2">Your flexible budget</p>
              <p className="pt-[10px] text-[20px] leading-[24px] font-semibold text-ink">{usd(last.change[0])}/mo</p>
            </div>
            <div className="flex flex-col border-l border-line bg-mint-soft p-[12px]">
              <p className="text-[10px] leading-[13.5px] text-muted-2">Suggested budget</p>
              <p className="pt-[10px] text-[20px] leading-[24px] font-semibold text-ink">{usd(last.change[1])}/mo</p>
            </div>
          </div>
          <div className="mt-[10px] flex flex-col rounded-[5px] border border-line bg-white px-[12px] py-[4px]">
            {[
              ["Semester spending change", usd((last.change[1] - last.change[0]) * MONTHS)],
              ["Updated family support", usd(suggestedSupport)],
              ["Reserve target", usd(totals.reserve)],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`flex h-[43px] items-center justify-between ${i < 2 ? "border-b border-line" : ""}`}
              >
                <span className="text-[10px] leading-[13.5px] text-muted-2">{k}</span>
                <span className="text-[10px] leading-[13.5px] text-ink">{v}</span>
              </div>
            ))}
          </div>

          {countering ? (
            <div className="mt-[12px] flex flex-col gap-[10px]">
              <p className="text-[12px] leading-[15px] font-medium tracking-[1.1px] text-muted-2 uppercase">
                your counterproposal
              </p>
              <Stepper value={counter} onChange={setCounter} />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[72px] w-full resize-none rounded-[5px] border border-line bg-white p-[11px] text-[12px] leading-[15px] text-ink outline-none focus:border-peri"
              />
              <div className="flex justify-between">
                <OutlineBtn onClick={() => setCountering(false)}>Cancel</OutlineBtn>
                <MintBtn
                  onClick={() => {
                    minjiCounter(counter, note);
                    setCountering(false);
                  }}
                >
                  Send to parents
                </MintBtn>
              </div>
            </div>
          ) : (
            <div className="flex justify-between pt-[12px]">
              <OutlineBtn onClick={() => setCountering(true)}>Propose Another</OutlineBtn>
              <MintBtn onClick={minjiAccept}>Approve Change</MintBtn>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/* HyunWoo's side (Figma 1491:2440) */
function ParentRespond() {
  const { family, totals, money: m, parentSuggest, parentApprove } = useApp();
  const [flex, setFlex] = useState(Math.max(0, family.flex - 80));
  const [comment, setComment] = useState(
    "We can support the semester. Could you try a slightly lower flexible budget and review again in October?",
  );
  const support = m.familySupport - (totals.flexibleMonthly - flex) * MONTHS;
  const minjiMsgs = family.messages.filter((x) => x.from === "minji");
  const latest = minjiMsgs[minjiMsgs.length - 1];

  if (family.status === "draft") {
    return (
      <Card title="Respond to Minji">
        <p className="text-[12px] leading-[15px] text-muted">Minji hasn’t shared a plan yet.</p>
      </Card>
    );
  }

  if (family.status === "agreed" || family.status === "suggested") {
    return (
      <Card title={family.status === "agreed" ? "Plan approved" : "Respond to Minji"}>
        <div className="flex flex-col gap-[8px]">
          {family.messages.map((msg, i) => (
            <ChatBubble key={i} m={msg} />
          ))}
        </div>
        {family.status === "suggested" && (
          <p className="pt-[12px] text-center text-[10px] leading-[13.5px] text-muted">
            Suggestion sent. Switch to “Minji view” to see her side.
          </p>
        )}
      </Card>
    );
  }

  // pending → parent proposes or approves; countered → parent approves Minji's counter
  return (
    <Card title="Respond to Minji">
      {latest && (
        <div className="flex flex-col">
          <ChatBubble m={latest} />
        </div>
      )}
      <div className="mt-[14px] flex w-full flex-col rounded-[5px] border border-line bg-[#f9faf7] p-[15px]">
        {family.status === "countered" ? (
          <div className="flex items-center justify-between rounded-[5px] bg-peri p-[12px]">
            <span className="text-[10px] leading-[13.5px] text-ink">Minji’s counter · family support</span>
            <span className="text-[12px] leading-[15px] font-bold text-ink">
              {usd(m.familySupport - (totals.flexibleMonthly - family.flex) * MONTHS)}
            </span>
          </div>
        ) : (
          <>
            <p className="text-[12px] leading-[15px] font-medium tracking-[1.1px] text-muted-2 uppercase">
              suggested monthly flexible spending
            </p>
            <div className="pt-[7px]">
              <Stepper value={flex} onChange={setFlex} />
            </div>
            <div className="mt-[13px] flex items-center justify-between rounded-[5px] bg-peri p-[12px]">
              <span className="text-[10px] leading-[13.5px] text-ink">Suggested family support</span>
              <span className="text-[12px] leading-[15px] font-bold text-ink">{usd(support)}</span>
            </div>
            <label className="flex w-[283px] flex-col pt-[13px]">
              <span className="pb-[7px] text-[10px] leading-[13.5px] text-muted">Comment to Minji</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[84px] w-full resize-none rounded-[5px] border border-line bg-white p-[11px] text-[12px] leading-[15px] text-ink outline-none focus:border-peri"
              />
            </label>
          </>
        )}
        <div className="flex justify-between pt-[12px]">
          {family.status === "pending" ? (
            <OutlineBtn onClick={() => parentSuggest(flex, comment)}>Suggest change</OutlineBtn>
          ) : (
            <span />
          )}
          <MintBtn onClick={parentApprove}>Approve plan</MintBtn>
        </div>
      </div>
    </Card>
  );
}
