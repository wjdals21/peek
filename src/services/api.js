/**
 * 클라이언트 API 서비스.
 * Claude API 호출은 모두 서버(/api/*)를 통해 이뤄지므로
 * VITE_CLAUDE_API_KEY와 callClaude 함수는 제거되었습니다.
 */

/**
 * 호출 1 — 링크 저장 시 분석
 * @returns {{ title, summary, keywords, suggestedFolder, contentType, reason }}
 */
export async function analyzeLink({ url, memo = '', folders = [] }) {
  const res = await fetch('/api/analyze-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, memo, folders }),
  })
  if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
  return res.json()
}

/**
 * 호출 2 — 폴더 콘텐츠 생성 (API 키 보안을 위해 서버에서 처리)
 * @returns {{ title, contentType, summary, duplicateMergeRate, stats, mergedPoints, uniquePoints, removedNoise, reusableNotes, nextQuestions, finalDraft }}
 */
export async function generateContent({ folderName, scraps }) {
  const res = await fetch('/api/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderName, scraps }),
  })
  if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
  return res.json()
}
