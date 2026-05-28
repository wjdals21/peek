# DESIGN.md — Peek

디자인 가이드라인 및 컴포넌트 스펙 정의서.
코드 작성 시 이 파일의 토큰과 스펙을 기준으로 한다.

---

## 1. 디자인 무드

| 항목 | 방향 |
|---|---|
| 전체 무드 | 클린·미니멀 — 흰색 배경, 충분한 여백 |
| 카드·컴포넌트 | 글래스모피즘 — 반투명 배경 + 소프트 섀도우 |
| 포인트 컬러 | 블루 계열 — 신뢰감, 차분함 |
| 배경 | 순수 흰색 (`#FFFFFF`) — 카드와 섀도우가 선명하게 부각 |
| 전체 느낌 | 현대적이고 세련됨, 과하지 않은 깊이감 |

---

## 2. 컬러 팔레트

### Primary — Blue

| 토큰 | 값 | 용도 |
|---|---|---|
| `--blue-50` | `#EFF6FF` | 배지 배경, 태그, 버튼 보조 배경 |
| `--blue-100` | `#DBEAFE` | 카드 테두리, 강조 영역 |
| `--blue-200` | `#BFDBFE` | 호버 테두리, 구분선 |
| `--blue-300` | `#93C5FD` | 비활성 아이콘, 힌트 |
| `--blue-400` | `#60A5FA` | 요약 불릿 도트, 보조 아이콘 |
| `--blue-500` | `#3B82F6` | 섹션 레이블, 힌트 텍스트 |
| `--blue-600` | `#2563EB` | **Primary 버튼, 주요 액션 (메인 컬러)** |
| `--blue-700` | `#1D4ED8` | 버튼 보조 텍스트, 배지 텍스트 |
| `--blue-800` | `#1E40AF` | 레이블, 코드 텍스트 |
| `--blue-900` | `#1E3A8A` | 제목, 링크 제목, 폴더명 |

### Semantic

| 토큰 | 배경 | 테두리 | 텍스트 | 용도 |
|---|---|---|---|---|
| 성공 (낮은 중복) | `#F0FDF4` | `#BBF7D0` | `#15803D` | 중복률 낮음 뱃지 |
| 경고 (보통 중복) | `#FFFBEB` | `#FDE68A` | `#B45309` | 중복률 보통 뱃지 |
| 오류 (높은 중복) | `#FEF2F2` | `#FECACA` | `#B91C1C` | 중복률 높음 뱃지, 에러 메시지 |
| 뉴트럴 | `#F9FAFB` | `#E5E7EB` | `#6B7280` | 콘텐츠 유형 뱃지 |

### 배경

| 토큰 | 값 | 용도 |
|---|---|---|
| 페이지 배경 | `#FFFFFF` | 전체 배경 |
| 카드 배경 | `#FFFFFF` | 링크 카드, 폴더 카드 |
| 글래스 섹션 | `rgba(255,255,255,0.85)` | 디자인 시스템 섹션, 그룹 박스 |
| 폴더 아이콘 | `#EFF6FF` | 폴더 카드 내 아이콘 배경 |
| 진행바 배경 | `#EFF6FF` | 중복률 바 배경 |

---

## 3. 타이포그래피

| 역할 | 크기 | 굵기 | 색상 | 용도 |
|---|---|---|---|---|
| h1 페이지 제목 | 22px | 500 | `#1E3A8A` | 앱 타이틀 등 최상위 제목 |
| h2 섹션 제목 | 18px | 500 | `#1E3A8A` | 탭 내 주요 섹션 |
| h3 카드 제목 | 16px | 500 | `#1E3A8A` | 카드 그룹 제목 |
| 링크 제목 | 14px | 500 | `#1E3A8A` | 링크 카드 제목, 폴더명 |
| 본문 | 13px | 400 | `#4B5563` | 요약 텍스트, 설명 |
| 섹션 레이블 | 11px | 500 | `Blue 500 65%` | uppercase, letter-spacing 0.7px |
| 힌트·메타 | 11px | 400 | `Blue 500 50%` | 저장 시간, 힌트 메시지 |

- **행간**: 제목 1.3~1.4 / 본문 1.55~1.6
- **폰트**: `var(--font-sans)` (시스템 기본 산세리프)
- **굵기**: 400(본문), 500(제목·레이블) 두 가지만 사용

---

## 4. 섀도우

```css
--shadow-subtle: 0 1px 3px rgba(59,130,246,0.07);
--shadow-soft:   0 4px 20px rgba(59,130,246,0.08), 0 1px 4px rgba(0,0,0,0.05);
--shadow-card:   0 8px 32px rgba(59,130,246,0.11), 0 2px 8px rgba(0,0,0,0.06);
--shadow-btn:    0 2px 12px rgba(37,99,235,0.28);
```

| 토큰 | 용도 |
|---|---|
| `--shadow-subtle` | 아이콘 배경, 미세한 깊이감 |
| `--shadow-soft` | 입력 필드, 소형 컴포넌트 |
| `--shadow-card` | 링크 카드, 폴더 카드, 주요 컨테이너 |
| `--shadow-btn` | Primary 버튼 |

---

## 5. 테두리 반경 (Border Radius)

| 토큰 | 값 | 용도 |
|---|---|---|
| 4px | `4px` | 미세 요소, 코드 블록 |
| `--border-radius-md` | `8px` | 버튼, 입력 필드, 뱃지 기본 |
| `--border-radius-lg` | `12px` | 카드, 주요 컨테이너 |
| `--border-radius-xl` | `16px` | 모달, 바텀시트 |
| `20px` | `20px` | 태그, 뱃지 pill, 필터 칩 |
| `50%` | `50%` | 아바타, 원형 아이콘 |

---

## 6. 스페이싱

컴포넌트 내부 간격은 `px`, 섹션 간 수직 리듬은 `rem` 사용.

| 값 | 용도 |
|---|---|
| 4px | 아이콘-텍스트 간격, 뱃지 내부 |
| 8px | 태그 간격, 소형 요소 간격 |
| 10px | 카드 그리드 gap |
| 12px | 카드 내부 섹션 간격 |
| 14px | 카드 패딩 |
| 16px | 섹션 패딩 |
| 20px | 탭 콘텐츠 패딩 |
| 24px | 주요 섹션 간 여백 |
| 28px | 탭 간 여백 |
| 32px | 페이지 레벨 여백 |

---

## 7. 컴포넌트 스펙

### 7-1. 버튼

```css
/* 공통 */
display: inline-flex; align-items: center; gap: 6px;
font-weight: 500; border-radius: var(--border-radius-md);
font-family: var(--font-sans); cursor: pointer;

/* 크기 */
.btn-sm:   padding: 5px 12px;  font-size: 12px;
.btn:      padding: 9px 18px;  font-size: 13px;
.btn-lg:   padding: 11px 24px; font-size: 14px;
```

| 종류 | 배경 | 텍스트 | 테두리 | 섀도우 | 용도 |
|---|---|---|---|---|---|
| Primary | `#2563EB` | `#fff` | 없음 | `--shadow-btn` | 주요 액션 (AI 분석 후 저장, 콘텐츠 만들기) |
| Secondary | `#EFF6FF` | `#1D4ED8` | `0.5px #BFDBFE` | 없음 | 보조 액션 |
| Ghost | `transparent` | `#2563EB` | `0.5px rgba(147,197,253,0.6)` | 없음 | 원문 보기, 폴더 변경 등 |
| Danger | `#FEF2F2` | `#B91C1C` | `0.5px #FECACA` | 없음 | 삭제 |

### 7-2. 뱃지 & 태그

```css
/* 공통 */
display: inline-flex; align-items: center; gap: 3px;
font-size: 11px; font-weight: 500;
padding: 3px 9px; border-radius: 20px;
```

| 종류 | 배경 | 텍스트 | 테두리 | 용도 |
|---|---|---|---|---|
| blue | `#EFF6FF` | `#1D4ED8` | `0.5px #BFDBFE` | 폴더 뱃지 |
| green | `#F0FDF4` | `#15803D` | `0.5px #BBF7D0` | 중복 낮음 |
| amber | `#FFFBEB` | `#B45309` | `0.5px #FDE68A` | 중복 보통 |
| red | `#FEF2F2` | `#B91C1C` | `0.5px #FECACA` | 중복 높음 |
| gray | `#F9FAFB` | `#6B7280` | `0.5px #E5E7EB` | 콘텐츠 유형 |

**태그** (키워드): 배경 `#EFF6FF`, 텍스트 `#1D4ED8`, 테두리 `0.5px #BFDBFE`, padding `2px 9px`

### 7-3. 입력 필드

```css
border: 0.5px solid #BFDBFE;
border-radius: var(--border-radius-md);
padding: 9px 12px;
font-size: 13px;
background: #fff;
color: #1E3A8A;
box-shadow: 0 1px 3px rgba(59,130,246,0.06);

/* 포커스 */
border-color: #60A5FA;
box-shadow: 0 0 0 3px rgba(59,130,246,0.10);

/* 오류 */
border-color: #FCA5A5;
background: #FFF5F5;

/* 비활성화 */
opacity: 0.4; cursor: not-allowed;
```

### 7-4. 링크 카드

```css
background: #ffffff;
border: 0.5px solid #DBEAFE;
border-radius: var(--border-radius-lg);
padding: 14px;
box-shadow: var(--shadow-card);
```

**내부 구조**

```
[콘텐츠 유형 뱃지]          [폴더 뱃지]
[링크 제목 — 14px/500/#1E3A8A]
[3줄 요약 — 블릿(Blue 400) + 본문 13px/Gray 600]
[중복률 pill]  [중복 안내 텍스트]
[키워드 태그들]              [원문 / 폴더 버튼]
[저장 시간 — 11px/Blue 500 45%]
```

### 7-5. 폴더 카드

```css
background: #ffffff;
border: 0.5px solid #DBEAFE;
border-radius: var(--border-radius-lg);
padding: 14px;
box-shadow: var(--shadow-card);
```

**내부 구조**

```
[아이콘 배경(Blue 50, 8px 반경)] [폴더명 — 14px/500/#1E3A8A]
[링크 수]  [새 관점 수]
[평균 중복률 레이블]     [중복률 수치(색상)]
[중복률 진행바 — 4px 높이, Blue 50 배경]
[콘텐츠 만들기 버튼 — Primary full width]
```

**중복률 바 색상**
- 낮음 (0~30%): `#22C55E` (Green)
- 보통 (31~69%): `#F59E0B` (Amber)
- 높음 (70~100%): `#EF4444` (Red)

### 7-6. 중복률 pill

| 범위 | 배경 | 텍스트 | 테두리 |
|---|---|---|---|
| 낮음 (0~30%) | `#F0FDF4` | `#15803D` | `0.5px #BBF7D0` |
| 보통 (31~69%) | `#FFFBEB` | `#B45309` | `0.5px #FDE68A` |
| 높음 (70~100%) | `#FEF2F2` | `#B91C1C` | `0.5px #FECACA` |

### 7-7. 탭 내비게이션

```css
/* 탭 컨테이너 */
background: #fff;
border-bottom: 0.5px solid #DBEAFE;
padding: 0 16px;

/* 탭 아이템 */
padding: 10px 14px;
font-size: 13px;
color: #6B7280;          /* 비활성 */
border-bottom: 2px solid transparent;
margin-bottom: -0.5px;

/* 활성 탭 */
color: #2563EB;
border-bottom-color: #2563EB;
font-weight: 500;
```

### 7-8. 로딩 스켈레톤

```css
background: #EFF6FF;
border-radius: 4px;
animation: pulse 1.4s ease-in-out infinite;

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}
```

### 7-9. 빈 상태 (Empty State)

```
[아이콘 — ti-inbox 등, 32px, Blue 300]
[제목 — 16px/500/#1E3A8A]
[설명 — 13px/Gray 600]
[액션 버튼 — Secondary 또는 Primary]
```

중앙 정렬, 위아래 padding 48px.

---

## 8. 아이콘

**라이브러리**: Tabler Icons (outline 전용)

| 용도 | 아이콘 | 크기 |
|---|---|---|
| 탭 — 스크랩 | `ti-inbox` | 14px |
| 탭 — 폴더 | `ti-folder` | 14px |
| 탭 — 링크 | `ti-link` | 14px |
| 탭 — 내 콘텐츠 | `ti-file-text` | 14px |
| AI 분석 / 생성 | `ti-sparkles` | 13~14px |
| 원문 보기 | `ti-external-link` | 11~12px |
| 폴더 변경 | `ti-edit` | 11~12px |
| 삭제 | `ti-trash` | 11~12px |
| Markdown 복사 | `ti-copy` | 12px |
| 오류 | `ti-alert-circle` | 11~12px |
| 힌트 | `ti-info-circle` | 11px |
| 새 폴더 | `ti-plus` | 16px |
| 설정 | `ti-settings` | 18px |
| 새 관점 | `ti-bulb` | 11~12px |
| 링크 수 | `ti-link` | 11~12px |
| AI 로딩 | `ti-loader-2` (spin) | 13~14px |

---

## 9. 레이아웃

### 탭 구조

```
┌─────────────────────────────────┐
│  Header (로고 + 설정 아이콘)      │  height: auto, padding: 14px 20px
├─────────────────────────────────┤
│  Tabs (스크랩/폴더/링크/내 콘텐츠) │  border-bottom: 0.5px Blue 100
├─────────────────────────────────┤
│                                 │
│  Tab Content                    │  padding: 16px 20px
│                                 │  background: #fff
│                                 │
└─────────────────────────────────┘
```

### 그리드

- 폴더 카드: `grid-template-columns: 1fr 1fr; gap: 10px`
- 최대 너비: `680px` (모바일 우선 단일 컬럼 → 400px 이상 2열)

### 반응형

| 구간 | 폴더 그리드 | 기타 |
|---|---|---|
| 375px ~ 399px | 1열 | 카드 패딩 12px |
| 400px ~ | 2열 | 카드 패딩 14px |
| 680px~ | 2열 유지 | 최대 너비 680px 고정 |

---

## 10. CSS 변수 정의 (index.html `<style>` 상단에 선언)

```css
:root {
  /* Blue Palette */
  --blue-50:  #EFF6FF;
  --blue-100: #DBEAFE;
  --blue-200: #BFDBFE;
  --blue-300: #93C5FD;
  --blue-400: #60A5FA;
  --blue-500: #3B82F6;
  --blue-600: #2563EB;
  --blue-700: #1D4ED8;
  --blue-800: #1E40AF;
  --blue-900: #1E3A8A;

  /* Shadow */
  --shadow-subtle: 0 1px 3px rgba(59,130,246,0.07);
  --shadow-soft:   0 4px 20px rgba(59,130,246,0.08), 0 1px 4px rgba(0,0,0,0.05);
  --shadow-card:   0 8px 32px rgba(59,130,246,0.11), 0 2px 8px rgba(0,0,0,0.06);
  --shadow-btn:    0 2px 12px rgba(37,99,235,0.28);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 20px;
}
```

---

## 11. 컴포넌트 적용 원칙

- 인라인 `style=""` 속성 사용 금지 — Tailwind 클래스 또는 CSS 변수 우선
- 섀도우는 반드시 위 토큰 사용, 임의 값 사용 금지
- 색상 하드코딩 금지 — 반드시 CSS 변수 또는 팔레트 정의된 값 사용
- 아이콘은 Tabler outline만 사용, filled 접미사(`-filled`) 사용 금지
- 중복률 pill 색상은 수치 범위에 따라 자동 결정 (JS 로직으로 클래스 분기)
