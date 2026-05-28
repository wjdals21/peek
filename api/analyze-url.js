import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
const MODEL_ANALYZE = 'claude-haiku-4-5-20251001'

async function fetchWithJina(url) {
  const jinaUrl = `https://r.jina.ai/${url}`
  const res = await fetch(jinaUrl, {
    headers: { Accept: 'text/plain' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Jina Reader HTTP ${res.status}`)
  const text = await res.text()
  return text.slice(0, 8000)
}

function validateUrl(url) {
  const parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('http/https URL만 허용됩니다.')
  }
  return parsed
}

function safeParseJSON(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*|\s*```$/g, '')
  return JSON.parse(cleaned)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url, memo = '', folders = [] } = req.body
  if (!url) return res.status(400).json({ error: 'url 필드가 필요합니다.' })

  try {
    validateUrl(url)
  } catch {
    return res.status(400).json({ error: '유효하지 않은 URL입니다.' })
  }

  let pageContent = ''
  try {
    pageContent = await fetchWithJina(url)
  } catch {
    // Jina 실패 시 URL만으로 분석 진행
  }

  const folderList = folders.map(f => f.name).join(', ') || '없음'
  const contentBlock = pageContent
    ? `페이지 본문:\n${pageContent}`
    : `URL: ${url} (페이지 내용을 가져올 수 없어 URL만으로 추론합니다.)`

  const prompt = `다음 웹페이지 내용을 분석해서 JSON으로만 반환해줘. 사전 설명이나 마크다운 코드블록 없이 순수 JSON만.

입력:
- 원본 URL: ${url}
- 사용자 메모: ${memo || '없음'}
- 기존 폴더 목록: ${folderList}

${contentBlock}

반환 형식:
{
  "title": "페이지 제목",
  "summary": ["핵심 요약 1줄", "핵심 요약 2줄", "핵심 요약 3줄"],
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "suggestedFolder": "기존 폴더명 우선, 없으면 새 폴더명 제안",
  "contentType": "실무 팁|사례 모음|의견/칼럼|자료/근거|튜토리얼|기타",
  "reason": "폴더 추천 이유 1~2문장"
}`

  try {
    const message = await client.messages.create({
      model: MODEL_ANALYZE,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    const json = safeParseJSON(message.content[0].text)
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
