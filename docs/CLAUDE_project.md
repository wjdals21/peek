# CLAUDE.md — Peek

이 파일은 이 저장소에서 작업하는 Claude Code에게 지침을 제공한다.

---

## CLAUDE.md 계층 구조 원칙

이 파일은 **이 프로젝트에 특화된 내용만** 기술한다.
범용 원칙(워크플로우, 네이밍 컨벤션, 브랜치 전략 등)은 `~/.claude/CLAUDE.md`(전역)에 있으며
이 파일에는 중복 기술하지 않는다.

```
~/.claude/CLAUDE.md     ← 전역: 워크플로우, 코드 스타일, 브랜치 전략 등 모든 프로젝트 공통
└── peek/CLAUDE.md      ← 프로젝트 특화: 기술 스택, 폴더 구조, 명령어, 개발 범위
```

---

# Peek

사용자가 직접 저장한 링크를 AI가 다시 읽고, 저장 의도를 되살리며, 반복 정보는 병합하고 고유 정보는 보존해 콘텐츠 초안을 만들어주는 개인 리서치 보관함.

## Project Overview

텍스트 기반 웹 링크와 저장 의도 메모를 저장하면 Claude API가 내용을 분석해 스마트 폴더에 자동 분류하고,
같은 폴더 내 링크들을 종합해 출처 표시가 포함된 나만의 콘텐츠 초안을 생성하는 React/Vite 기반 SPA.

Peek는 뉴스/트렌드 조사 에이전트나 PR·마케팅용 미디어 모니터링 도구가 아니다.
외부 뉴스·미디어·소셜 데이터를 자동 수집하지 않고, 사용자가 직접 저장한 링크만 분석한다.
서비스 카피와 기능 설명은 항상 "내가 저장한 링크를 내 콘텐츠 자산으로 바꾼다"는 방향을 우선한다.

상세 내용은 [`docs/PRD.md`](./docs/PRD.md) 참조.

## Out of Scope

→ [`docs/PRD.md` — Section 7. Out of Scope](./docs/PRD.md) 참조.

---

## Commands

```bash
# 프론트엔드 개발 서버
npm run dev

# Claude API 프록시 서버
npm run server

# 프로덕션 빌드
npm run build
```

---

## Tech Stack

| 기술 | 버전 | 선정 이유 |
|---|---|---|
| React | 18 | 컴포넌트 기반으로 스크랩·폴더·링크·콘텐츠 화면을 명확히 분리 |
| Vite | 5 | 빠른 개발 서버와 간단한 빌드 환경 |
| Tailwind CSS | 3 | 유틸리티 클래스로 빠른 UI 구현과 일관된 디자인 시스템 유지 |
| LocalStorage | — | MVP 단계에서 서버 DB 없이 데이터 영속성 확보 |
| Express | 5 | Claude API 키 보호를 위한 최소 API 서버 |
| Claude API | — | URL 분석, 요약·분류·정보 포인트 병합·콘텐츠 초안 생성 처리 |

- **언어**: JavaScript + JSX
- **아키텍처**: React SPA — 스크랩 / 폴더 / 링크 / 내 콘텐츠
- **데이터 저장**: MVP에서는 LocalStorage만 사용한다.
- **보류**: Supabase/DB 연동은 MVP 이후 데이터 구조가 안정된 뒤 검토한다.

---

## 폴더 구조

```
peek/
├── index.html           # Vite 앱 HTML 진입점
├── package.json         # scripts 및 의존성
├── server.js            # Claude API 프록시 서버
├── docs/
│   ├── PRD.md           # 제품 요구사항 정의서
│   ├── WORK.md          # 현재 진행 중·예정 작업
│   └── HISTORY.md       # 완료된 작업 이력
└── src/
    ├── main.jsx         # React 앱 진입점
    ├── App.jsx          # 4탭 레이아웃과 라우팅 상태
    ├── index.css        # Tailwind 및 공통 컴포넌트 클래스
    ├── components/      # 화면별 UI 컴포넌트
    ├── hooks/           # 도메인별 커스텀 훅
    ├── pages/           # 탭 단위 페이지
    ├── services/
    │   ├── api.js       # 프론트 API 클라이언트
    │   └── storage.js   # LocalStorage CRUD 유틸리티
    ├── store/           # StoreProvider, Toast 등 전역 상태
    └── utils/           # 날짜 등 순수 유틸리티
```

---

## Code Style

> 네이밍, 일반 코드 원칙, 브랜치 전략, 커밋 컨벤션은 `~/.claude/CLAUDE.md`(전역) 참조.

### 이 프로젝트 특화 규칙

- 모든 LocalStorage 접근은 `src/services/storage.js`의 유틸리티 함수를 통해서만 수행한다.
- 프론트의 API 호출은 `src/services/api.js`에서만 수행한다.
- Claude API 직접 호출은 `server.js`에서만 수행한다. 브라우저 코드에 API 키를 노출하지 않는다.
- UUID 생성: `crypto.randomUUID()` 사용
- 날짜: `new Date().toISOString()` 형식으로 저장
- 탭 전환은 `src/App.jsx`에서 중앙 관리하고, 각 탭은 `src/pages/*Page.jsx`로 분리한다.
- 앱 데이터 상태는 `src/store/StoreProvider.jsx`와 도메인 훅으로 관리한다.
- AI 응답은 항상 JSON 파싱 전 try-catch로 감싼다.

### Claude API 사용 규칙

- API 키는 `.env`의 `CLAUDE_API_KEY`에서 불러온다. 코드에 하드코딩 금지.
- 호출 횟수: 링크 저장 시 1회, 콘텐츠 생성 시 1회 — 불필요한 추가 호출 금지.
- 실패 시 사용자에게 명확한 에러 메시지를 보여주고 수동 처리 옵션을 제공한다.

### 포지셔닝 규칙

- "트렌드 정보를 조사해주는 서비스", "뉴스/소셜 데이터 정리", "마케팅 리포트 자동 생성"처럼 보이는 표현을 피한다.
- Peek의 출발점은 외부 데이터 자동 수집이 아니라 사용자가 직접 저장한 링크다.
- 결과물은 트렌드 리포트가 아니라 사용자가 바로 수정하고 활용할 수 있는 콘텐츠 초안이다.
- 저장 의도 메모는 단순 메모가 아니라 콘텐츠 변환 방향을 정하는 핵심 입력이다.
- 링크를 통째로 제외하지 않고, 반복 정보만 병합하며 고유한 주장·사례·데이터·관점은 보존한다.

---

## AI 프롬프트 설계

### 호출 1 — 링크 분석 (저장 시)

```
다음 URL의 페이지 내용을 읽고 JSON으로만 반환해줘. 사전 설명이나 마크다운 코드블록 없이 순수 JSON만.

입력:
- URL: {url}
- 저장 의도 메모: {memo} (없으면 빈 문자열)
- 기존 폴더 목록: {folders}

반환 항목:
{
  "title": "페이지 제목",
  "summary": ["요약 1줄", "요약 2줄", "요약 3줄"],
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "suggestedFolder": "기존 폴더명 우선, 없으면 새 폴더명 제안",
  "contentType": "실무 팁|사례 모음|의견/칼럼|자료/근거|튜토리얼|기타",
  "reason": "폴더 추천 이유 1~2문장"
}
```

### 호출 2 — 콘텐츠 생성 (폴더별)

```
다음 폴더의 링크 요약들을 정보 포인트 단위로 분석해 JSON으로만 반환해줘. 사전 설명이나 마크다운 코드블록 없이 순수 JSON만.

중요 원칙:
- 중복이 많다는 이유로 특정 링크 전체를 제외하지 않는다.
- 반복되는 정보만 병합하고, 각 링크의 고유한 주장·사례·데이터·관점은 반드시 보존한다.
- 최종 콘텐츠에는 [출처 1], [출처 2] 형식으로 출처를 표시한다.

입력:
- 폴더명: {folderName}
- 링크 요약 목록: {scraps}

반환 항목:
{
  "title": "통합 콘텐츠 제목",
  "contentType": "블로그 글|리서치 노트|유튜브 스크립트|카드뉴스 초안",
  "summary": "전체 내용을 3문장으로 요약",
  "duplicateMergeRate": 30,
  "stats": {
    "totalSources": 0,
    "totalInformationPoints": 0,
    "mergedInformationPoints": 0,
    "removedRepeatedPoints": 0
  },
  "mergedPoints": [{"point": "병합한 반복 정보", "sources": ["출처 1"], "reason": "병합 이유"}],
  "uniquePoints": [{"point": "보존한 고유 정보", "source": "출처 1", "reason": "보존 이유"}],
  "removedNoise": [{"content": "제거한 노이즈", "source": "출처 1", "reason": "제거 이유"}],
  "reusableNotes": ["바로 활용 가능한 문장1", "..."],
  "nextQuestions": ["더 알아볼 질문1", "질문2"],
  "finalDraft": "출처 표시가 포함된 최종 콘텐츠 초안"
}
```

---

## WORK.md 관리 규칙

`docs/WORK.md`는 **현재 진행 중이거나 앞으로 할 작업만** 관리한다.

### Claude가 반드시 해야 하는 행동

1. **작업 시작 전**: `docs/WORK.md`의 `## 진행 예정`에 작업 항목을 추가한다.
2. **작업 완료 후**:
   - 완료 항목을 `docs/WORK.md`에서 **제거**한다.
   - 해당 항목을 날짜와 함께 `docs/HISTORY.md`로 **이동**한다.
3. **기술적 결정이 생겼을 때**: `docs/WORK.md`의 `## 결정 사항`에 항목과 이유를 기록한다.

### WORK.md에 두지 않는 것

- 완료된 작업 내역 → `docs/HISTORY.md`로 이동
- 기능 요구사항 → `docs/PRD.md` 참조

---

## HISTORY.md 관리 규칙

`docs/HISTORY.md`는 **완료된 작업의 전체 이력**을 담는다.

### Claude가 반드시 해야 하는 행동

- 작업 완료 시 즉시 `docs/HISTORY.md`에 기록한다.
- 기록 형식: **날짜 / 작업 제목 / 주요 변경 파일 및 내용**
- `docs/WORK.md`에서 제거한 완료 항목을 옮기되, 날짜를 반드시 포함한다.

---

## 작업 조회 규칙

- **"다음 작업은?"** 또는 **"앞으로 할 작업은?"** 이라고 물으면
  → `docs/WORK.md`를 먼저 읽고 답한다.
- **"이전에 한 작업은?"** 또는 **"완료한 작업은?"** 이라고 물으면
  → `docs/HISTORY.md`를 참고하라고 안내한다.

---

## 문서 파일 역할

| 파일 | 역할 |
|---|---|
| `docs/PRD.md` | 제품 요구사항 정의서 — 배경·목표, 유저 스토리, 기능 명세, Out of Scope |
| `docs/WORK.md` | 현재 작업 현황 및 앞으로 할 일 |
| `docs/HISTORY.md` | 완료된 작업 기록 |

---

## Development Notes

### 개발 현황

| 항목 | 상태 |
|---|---|
| 프로젝트 구조 생성 및 문서 작성 | ✅ 완료 |
| React/Vite 기본 레이아웃 + 4탭 구조 | ✅ 진행됨 |
| LocalStorage CRUD 유틸리티 (`src/services/storage.js`) | ✅ 진행됨 |
| StoreProvider 및 도메인 훅 | ✅ 진행됨 |
| 스크랩 인박스 UI | ✅ 진행됨 |
| Claude API 연동 (링크 분석) | ✅ 진행됨 |
| 폴더 자동 분류 + 폴더 탭 UI | ✅ 진행됨 |
| 링크 카드 목록 UI | ✅ 진행됨 |
| 나만의 콘텐츠 생성 + 내 콘텐츠 탭 UI | ✅ 진행됨 |
| Markdown 복사 기능 | ✅ 진행됨 |
| Empty State UI + 에러 처리 | ✅ 진행됨 |
| 샘플 데이터 + 반응형 점검 | ⬜ 예정 |
