---
name: project-peek-architecture
description: Peek 프로젝트(React+Vite+Tailwind) 아키텍처 및 최적화 이력 — StoreProvider 패턴, 서버 분리 구조
metadata:
  type: project
---

React + Vite + Tailwind CSS 기반 개인 링크 스크랩 앱 "Peek".
루트: C:\Project_ai\개인프로젝트

핵심 구조:
- src/store/StoreProvider.jsx: 전역 단일 state (folders/scraps/contents), 함수형 업데이트로 stale closure 제거
- src/hooks/{useFolders,useScraps,useContents}.js: StoreProvider 위임 래퍼 (하위호환 유지)
- src/services/api.js: 클라이언트 API — analyzeLink(/api/analyze-url), generateContent(/api/generate-content) 서버 호출
- server.js: Express 서버 — Claude API 호출 담당 (API 키 서버 측 보관)
- src/components/common/DomainIcon.jsx: 공통 도메인 아이콘 컴포넌트 (NaN 방지 포함)

**Why:** 2026-05-18 코드 품질 리뷰 후 10개 항목 일괄 수정 (Context 단일화, stale closure, 보안, 성능)
**How to apply:** 추가 기능 개발 시 store 접근은 useStore() 또는 래퍼 훅 사용. API 키는 절대 클라이언트 코드에 두지 않음.
