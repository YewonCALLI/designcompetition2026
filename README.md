# AVIA — 학기 예산 앱 프로토타입

Figma `hpc-design` 파일의 22개 노드를 Next.js 16 (App Router) + TypeScript + Tailwind CSS v4로 구현한 클릭 가능한 프로토타입입니다.

## 실행

```bash
npm install
npm run assets   # Figma 아이콘·일러스트 SVG를 public/assets 로 내려받기 (최초 1회)
npm run dev      # http://localhost:3000
```

> **`npm run assets`는 2026-10-27 전에 실행하세요.** Figma MCP가 발급한 에셋 링크는 7일 후 만료됩니다.
> 만료됐다면 `scripts/figma-assets.json`에 적힌 노드에서 `get_design_context`를 다시 호출해 새 id로 바꾸면 됩니다.
> 에셋이 없는 동안에도 레이아웃은 그대로 유지되고, 이미지 자리만 비어 보입니다.

브라우저 개발자 도구에서 모바일 뷰(393px 폭, iPhone 14/15급)로 보는 것을 권장합니다.

## 플로우 (화면 → Figma 노드)

| 경로 | 화면 | Figma |
| --- | --- | --- |
| `/` | 홈 — 학기 전 (Plan My Semester) | 1491:217 |
| `/plan` | 1단계 · 학기 계획 시작 (은행 연결 / 직접 입력) | 1491:328 |
| `/plan/found` | 2단계 · 거래 내역 분석 결과 | 1491:420 |
| `/plan/build` | 3단계 · 시작점 입력 (모든 금액 편집 가능) | 1491:516 |
| `/plan/review` | 4단계 · 시작점 검토 (USD / KRW / Both) | 1491:841 |
| `/plan/options` | 5단계 · 3가지 플랜 중 선택 | 1491:966 |
| `/family` | 가족 공유 뷰 — 대기 → 변경 제안 → 역제안/수락 → 합의 | 1491:1927, 2440, 2083, 2269, 2395 |
| `/` | 홈 — 학기 중 (잔액, 카테고리 지출, 월별 저니, 예정 청구서) | 1491:1118, 2604 |
| `/journey` | 학기 저니 맵 (이벤트 탭 → 상세 시트) | 1491:1670, 1344, 1335–1343 |
| `/journey/new` | 금융 이벤트 추가 (예상 영향 실시간 계산) | 1491:1344 |

데모 순서: 홈 → Plan My Semester → (권한 체크 후) Connect → … → Continue with Balanced Semester →
가족 뷰에서 **Preview parent view** 탭으로 부모 입장에서 Suggest change → **Minji view**에서 Approve Change 또는 Propose Another →
합의 후 Confirm Semester Plan → 학기 중 홈 → JOURNEY 탭.
홈 상단의 “Before semester / During semester” 드롭다운으로 언제든 단계를 전환할 수 있습니다.

## 구조

```
src/
  app/                 라우트별 화면
  components/
    shell.tsx          Screen, StatusBar, TopBar, StepHeader, PrimaryButton, FooterButton
    ui.tsx             MoneyField, KindChip, CurrencyToggle, DualAmount, Segmented, ChatBubble, FooterNav, Toast
    FigmaImg.tsx       Figma 에셋 슬롯 (FigmaImg, Icon)
    Avatar.tsx         민지 아바타 (마스크 레이어)
  lib/store.tsx        공유 상태 + 예산 계산 (환율 $1 = ₩1,390, 4개월)
scripts/
  figma-assets.json        노드별 에셋 목록
  fetch-figma-assets.mjs   에셋 다운로드 스크립트
```

## 디자인과 다르게 처리한 부분

- 금액은 입력값에서 실시간 계산합니다. 기본값으로는 Figma 숫자가 그대로 나오지만, Figma 안에서 서로 맞지 않던 값
  (예: 4단계 “expected semester resources $3,546”, 홈의 원화 환산)은 입력값·환율 기준으로 일관되게 표시됩니다.
- 1단계 제목 오타 “map our” → “map out”.
- 2단계·이벤트 추가 화면에는 다음으로 넘어갈 버튼이 없어 하단 버튼(“Use this as my starting point”, “Add to my journey”)을 추가했습니다.
- TRANSFERS 탭은 별도 디자인이 없어 가족 공유 뷰(`/family`)로 연결했습니다.
- “See My Recap”(12월 리뷰)은 디자인이 없어 안내 토스트만 띄웁니다.
- `1491:2718`(IMPORTANT INFO)은 화면이 아닌 메모 섹션이라 플로우 설계 참고용으로만 사용했습니다.
