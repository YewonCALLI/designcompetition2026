module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/src/lib/store.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "DEFAULT_MONEY",
    ()=>DEFAULT_MONEY,
    "KRW_PER_USD",
    ()=>KRW_PER_USD,
    "MONTHS",
    ()=>MONTHS,
    "computePlans",
    ()=>computePlans,
    "computeTotals",
    ()=>computeTotals,
    "krw",
    ()=>krw,
    "usd",
    ()=>usd,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const DEFAULT_MONEY = {
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
    reserve: 400
};
const KRW_PER_USD = 1390;
const MONTHS = 4; // Sep – Dec
function computeTotals(m) {
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
        aboveReserve: ending - m.reserve
    };
}
function computePlans(t) {
    const make = (id, name, desc, spendDelta, flex)=>{
        const spending = t.spending + spendDelta;
        const ending = t.resources - spending;
        return {
            id,
            name,
            desc,
            spending,
            ending,
            flexibleMonthly: flex,
            aboveReserve: ending - t.reserve
        };
    };
    return [
        make("essentials", "Essentials First", "Covers the must-haves and keeps the largest safety buffer.", -580, Math.max(0, t.flexibleMonthly - 90)),
        make("balanced", "Balanced Semester", "Keeps essentials covered with room for spring break trip and everyday fun.", 0, t.flexibleMonthly),
        make("flexible", "More Flexible", "Makes more room for extras, but dips below your reserve target.", 690, t.flexibleMonthly + 130)
    ];
}
const Ctx = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AppProvider({ children }) {
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("before");
    const [bankConnected, setBankConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [money, setMoneyState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_MONEY);
    const [plan, setPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("balanced");
    const [family, setFamily] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: "draft",
        flex: DEFAULT_MONEY.dining + DEFAULT_MONEY.shopping,
        messages: []
    });
    const totals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>computeTotals(money), [
        money
    ]);
    const setMoney = (k, v)=>setMoneyState((m)=>({
                ...m,
                [k]: Number.isFinite(v) ? Math.max(0, v) : 0
            }));
    const planName = computePlans(totals).find((p)=>p.id === plan)?.name ?? "Balanced Semester";
    const shareWithParents = ()=>setFamily((f)=>f.status !== "draft" ? f : {
                status: "pending",
                flex: totals.flexibleMonthly,
                messages: [
                    {
                        from: "minji",
                        label: "Minji · plan shared",
                        text: `I chose the ${planName} plan. It leaves room for a TV while keeping ${usd(totals.aboveReserve)} above my reserve.`
                    }
                ]
            });
    const parentSuggest = (flex, comment)=>setFamily((f)=>({
                status: "suggested",
                flex,
                messages: [
                    ...f.messages,
                    {
                        from: "parent",
                        label: "Parent Account · suggested a change",
                        text: comment,
                        change: [
                            f.flex,
                            flex
                        ]
                    }
                ]
            }));
    const parentApprove = ()=>setFamily((f)=>({
                ...f,
                status: "agreed",
                messages: [
                    ...f.messages,
                    {
                        from: "system",
                        label: "Agreement reached",
                        text: `Family support is set to ${usd(supportFor(f.flex))} for the semester.`
                    }
                ]
            }));
    const minjiAccept = parentApprove;
    const minjiCounter = (flex, comment)=>setFamily((f)=>({
                status: "countered",
                flex,
                messages: [
                    ...f.messages,
                    {
                        from: "minji",
                        label: "Minji · counterproposal",
                        text: comment,
                        change: [
                            f.flex,
                            flex
                        ]
                    }
                ]
            }));
    /** Each $1/mo of flexible budget is $4 of family support over the semester. */ function supportFor(flex) {
        return money.familySupport - (totals.flexibleMonthly - flex) * MONTHS;
    }
    const confirmPlan = ()=>setStage("during");
    const resetDemo = ()=>{
        setStage("before");
        setBankConnected(false);
        setMoneyState(DEFAULT_MONEY);
        setPlan("balanced");
        setFamily({
            status: "draft",
            flex: DEFAULT_MONEY.dining + DEFAULT_MONEY.shopping,
            messages: []
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Ctx.Provider, {
        value: {
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
            resetDemo
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/store.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
function useApp() {
    const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(Ctx);
    if (!v) throw new Error("useApp must be used inside AppProvider");
    return v;
}
const fmt = (n)=>Math.round(Math.abs(n)).toLocaleString("en-US");
const usd = (n)=>`${n < 0 ? "−" : ""}$${fmt(n)}`;
const krw = (n)=>`${n < 0 ? "−" : ""}₩${fmt(n * KRW_PER_USD)}`;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1ujxb4ewauxp6._.js.map