# WORK.md — Peek

현재 진행 중이거나 앞으로 할 작업만 관리한다.
완료된 작업은 즉시 `HISTORY.md`로 이동한다.

---

## 진행 중

_현재 진행 중인 작업 없음_

---

## 진행 예정

### Day 1 — 기반 구조 (0~8시간)

- [ ] React/Vite 앱 기본 구조 점검
  - `src/App.jsx` 4탭 구조 (스크랩 / 폴더 / 링크 / 내 콘텐츠)
  - `src/main.jsx` 앱 진입점
  - 레이아웃 컴포넌트 구조
- [ ] Tailwind CSS 설정 및 기본 스타일 세팅
- [ ] `src/services/storage.js` LocalStorage CRUD 유틸리티 작성
  - `getFolders()` / `saveFolders()`
  - `getScraps()` / `saveScraps()`
  - `getContents()` / `saveContents()`
  - `generateId()` — `crypto.randomUUID()` 래핑
- [ ] `src/store/StoreProvider.jsx` 전역 상태 관리 구조 정리
- [ ] 폴더 생성·조회·수정·삭제 기능 (`src/hooks/useFolders.js`, `src/components/folder/*`)

### Day 1 후반 — 스크랩 + AI 연동 (8~16시간)

- [ ] `src/services/api.js` + `server.js` Claude API 연동
  - URL fetch + 링크 분석 (요약·키워드·폴더 분류)
  - 실패 처리 로직
- [ ] 스크랩 인박스 UI (`src/components/scrap/*`, `src/pages/ScrapPage.jsx`)
  - URL 입력 + 메모(선택) 입력 폼
  - 로딩 스켈레톤 UI
  - 분석 성공 결과 카드 (제목·요약·키워드·폴더·콘텐츠 유형)
  - 분석 실패 에러 메시지 + 수동 제목 입력 옵션
- [ ] 폴더 자동 배치 로직 구현
- [ ] 링크 카드 UI (`src/components/links/*`, `src/pages/LinksPage.jsx`)
  - 3줄 요약 / 키워드 태그 / 콘텐츠 유형 뱃지 / 원문 링크

### Day 2 — 콘텐츠 생성 (16~28시간)

- [ ] 폴더 상세 화면
  - 해당 폴더 링크 목록
  - 콘텐츠 생성 가능 상태 표시
  - "콘텐츠 만들기" 버튼 (링크 2개 이상 시 활성화)
- [ ] 나만의 콘텐츠 생성 (`src/components/content/*`, `src/pages/ContentPage.jsx`)
  - Claude API 호출 (정보 포인트 추출 + 반복 정보 병합 + 고유 정보 보존 1회)
  - 중복 제거율, 병합/보존/노이즈, 최종 초안 렌더링
  - Markdown 복사 기능

### Day 2 후반 — 완성도 개선 (28~48시간)

- [ ] 빈 상태(Empty State) UI — 모든 탭
- [ ] 에러 메시지 및 예외 처리 전체 점검
- [ ] 샘플 데이터 추가 (초기 진입 시 예시 데이터 표시)
- [ ] 반응형 레이아웃 점검 (375px ~ 1440px)
- [ ] `README.md` 최종 작성

---

## 결정 사항

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-05-18 | 입력 방식을 URL + 메모(선택)으로 확정 | 본문 붙여넣기 없이 UX 단순화 우선, fetch 실패는 v2.0에서 해결 |
| 2026-05-18 | 중복 감지를 콘텐츠 생성 API 호출에 통합 | 별도 호출 없이 복잡도 낮추고 AI 호출 횟수 최소화 (총 2회) |
| 2026-05-19 | React/Vite + Tailwind CSS + LocalStorage로 구현 방향 확정 | 컴포넌트 기반으로 기능을 분리하고, MVP 데이터는 브라우저에 보관해 빠르게 검증 |
| 2026-05-19 | DB/Supabase 연동은 MVP 이후로 보류 | 현재 단계에서는 LocalStorage만으로 스크랩·폴더·콘텐츠 흐름 검증이 충분함 |
| 2026-05-19 | 폴더에 링크 2개 이상 시 콘텐츠 생성 활성화 | 최종 기획문서 기준으로 2~3개 이상부터 통합 초안 생성 흐름을 검증 |
| 2026-05-19 | 중복 점수 대신 중복 제거율/정보 포인트 병합으로 표현 변경 | 링크를 제외하는 지표가 아니라 반복 정보만 병합하고 고유 정보는 보존하는 서비스 방향을 명확히 하기 위해 |
| 2026-05-19 | 뉴스/트렌드 조사 에이전트가 아닌 개인 리서치 보관함으로 포지셔닝 | PR/마케팅 미디어 모니터링 도구와 겹치지 않고, 사용자가 직접 저장한 링크를 콘텐츠 자산으로 바꾸는 차별성을 강화 |
