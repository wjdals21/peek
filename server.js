import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

if (!process.env.CLAUDE_API_KEY) {
  console.error('[server] CLAUDE_API_KEY가 .env에 설정되지 않았습니다.')
  process.exit(1)
}

const app = express()
const PORT = 3001
const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
const MODEL_ANALYZE = 'claude-haiku-4-5-20251001'  // URL 분석: 빠른 응답
const MODEL_CONTENT = 'claude-sonnet-4-6'             // 콘텐츠 생성: 최고 품질

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// Jina Reader로 URL 본문을 마크다운으로 가져오기
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

// POST /api/analyze-url
// Jina Reader로 URL 크롤링 후 Claude로 분석
app.post('/api/analyze-url', async (req, res) => {
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
})

// POST /api/generate-content
// 폴더 내 스크랩 목록을 Claude로 종합해 콘텐츠 생성
app.post('/api/generate-content', async (req, res) => {
  const { folderName, scraps } = req.body
  if (!folderName || !Array.isArray(scraps)) {
    return res.status(400).json({ error: 'folderName과 scraps 배열이 필요합니다.' })
  }

  const scrapList = scraps
    .slice(0, 20)
    .map((s, i) =>
      `[출처 ${i + 1}]
id: ${s.id}
title: ${s.title}
url: ${s.url}
memo: ${s.memo || '없음'}
summary: ${(s.summary ?? []).join(' / ')}
keywords: ${(s.keywords ?? []).join(', ')}`
    )
    .join('\n\n')

  const prompt = `당신은 여러 개의 저장 링크를 분석해 하나의 콘텐츠 초안으로 재구성하는 AI 리서치 에디터입니다.
아래 폴더의 링크 요약들을 종합해 JSON으로만 반환해줘. 사전 설명이나 마크다운 코드블록 없이 순수 JSON만.

입력:
- 폴더명: ${folderName}
- 링크 요약 목록 (${scraps.length}개):
${scrapList}

## 정보 처리 원칙
1. 중복 제거는 링크 단위가 아니라 정보 포인트 단위로 수행하세요.
2. 여러 링크에서 같은 의미로 반복되는 내용은 하나의 문장으로 병합하세요.
3. 특정 링크에만 있는 고유한 주장, 사례, 데이터, 팁, 관점, 반론은 반드시 반영하세요.
4. 표현만 다르고 의미가 같은 내용은 중복으로 간주해 병합하세요.
5. 의미가 비슷하지만 관점이나 활용 목적이 다르면 별도 정보로 보존하세요.
6. 중복 여부가 애매하면 삭제하지 말고 보존하세요.
7. 광고성 문구, 작성자 자기소개, 불필요한 잡담, 의미 없는 맺음말은 제거하세요.
8. 원문을 길게 복사하지 말고 핵심 의미를 재구성해 작성하세요.

## finalDraft 작성 원칙 (가장 중요)
finalDraft는 단순한 정보 나열이 아니라, 독자가 읽고 싶어지는 글이어야 합니다.

### 구조 원칙
- 출처 태그([출처 1] 등)를 글 본문에 직접 삽입하지 마세요. 독자의 흐름을 끊습니다.
- 글 전체를 하나의 관점과 목소리로 통일하세요. 출처별 요약을 붙여넣은 느낌이 나면 안 됩니다.
- 각 단락은 앞뒤가 자연스럽게 이어져야 합니다. 섹션 간 연결 문장을 반드시 넣으세요.

### 섹션별 표현 방식 (섹션 성격에 따라 다르게 표현할 것)
- 도입부: 독자가 공감할 수 있는 상황 묘사로 시작하는 산문. 핵심 메시지를 마지막 문장에 압축.
- 문제/실수 섹션: 구체적인 사례나 패턴을 나열. 각 항목은 "제목 + 1~2문장 설명" 형식으로 간결하게.
- 방법/순서 섹션: 번호가 있는 단계별 구조. 각 단계는 "행동 지침 + 이유 또는 주의사항"으로 구성.
- 핵심 인사이트: 단독으로 강조할 문장 1개. 앞뒤 산문과 구분되도록 짧고 임팩트 있게.
- 마무리: 다시 산문으로 수렴. 독자가 지금 당장 할 수 있는 첫 행동을 제안하며 마무리.

### 금지 사항
- "~다는 것을 알 수 있다", "~라고 할 수 있다" 같은 AI 특유의 마무리 표현 금지
- "전문가들은 공통적으로 강조한다", "경험자들이 말하는" 같은 막연한 권위 표현 금지
- 각 섹션이 독립적으로 끊기는 구성 금지. 반드시 흐름이 이어져야 함

## 작업 순서
1. 각 링크에서 정보 포인트를 추출하세요.
2. 정보 포인트를 핵심 주장, 근거, 사례, 데이터, 팁, 관점, 반론으로 분류하세요.
3. 반복되는 정보 포인트를 찾아 병합하세요.
4. 각 링크에만 있는 고유 정보 포인트를 보존하세요.
5. 위의 finalDraft 원칙에 따라 초안을 작성하세요.
6. 중복 제거율을 계산하세요.

반환 형식:
{
  "title": "통합 콘텐츠 제목",
  "contentType": "블로그 형식|리서치 노트 형식|유튜브 스크립트 형식|카드뉴스 형식",
  "summary": "전체 내용을 3문장으로 요약",
  "duplicateMergeRate": 30,
  "stats": {
    "totalSources": ${scraps.length},
    "totalInformationPoints": 0,
    "mergedInformationPoints": 0,
    "removedRepeatedPoints": 0
  },
  "mergedPoints": [
    { "point": "여러 링크에서 반복되어 하나로 병합한 내용", "sources": ["출처 1", "출처 2"], "reason": "같은 의미로 판단한 이유" }
  ],
  "uniquePoints": [
    { "point": "특정 링크에만 있는 고유 정보", "source": "출처 1", "reason": "보존해야 하는 이유" }
  ],
  "removedNoise": [
    { "content": "제거한 광고성 문구 또는 불필요한 내용", "source": "출처 1", "reason": "제거 이유" }
  ],
  "reusableNotes": [
    "실무나 콘텐츠 제작에 바로 활용할 수 있는 구체적인 정리"
  ],
  "nextQuestions": [
    "이 주제를 더 깊이 탐구하기 위한 구체적인 질문"
  ],
  "finalDraft": {
    "intro": "도입부 산문. 독자가 공감할 상황 묘사 + 핵심 메시지 압축 (3~5문장)",
    "sections": [
      {
        "type": "prose|list|steps|quote",
        "label": "섹션 제목 (독자에게 보이는 용도)",
        "content": "type이 prose면 산문 문자열 / list면 [{title, desc}] 배열 / steps면 [{step, title, desc}] 배열 / quote면 단일 문자열",
        "bridge": "다음 섹션으로 넘어가는 연결 문장 (1문장, 생략 가능)"
      }
    ],
    "outro": "마무리 산문. 독자가 지금 당장 할 수 있는 첫 행동 제안으로 마무리 (2~3문장)"
  }
}`

  try {
    const message = await client.messages.create({
      model: MODEL_CONTENT,
      max_tokens: 20000,
      messages: [{ role: 'user', content: prompt }],
    })
    const json = safeParseJSON(message.content[0].text)
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`[server] 실행 중 → http://localhost:${PORT}`)
})
