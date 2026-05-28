import { useState } from 'react'

// ── 출처 배지 ──────────────────────────────────────────────
function SourceBadge({ label }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-2xs font-medium bg-slate-100 text-slate-500 leading-none">
      {label}
    </span>
  )
}

function SourceBadges({ source, sources }) {
  const list = sources?.length
    ? sources
    : source
    ? [source]
    : []
  if (!list.length) return null
  return (
    <span className="inline-flex flex-wrap gap-1 ml-1.5 align-middle">
      {list.map((s, i) => <SourceBadge key={i} label={s} />)}
    </span>
  )
}

// ── 핵심 포인트 아이템 ────────────────────────────────────
function PointItem({ item }) {
  const text = typeof item === 'string'
    ? item
    : (item.point ?? item.content ?? '')
  const source = typeof item === 'object' ? item.source : null
  const sources = typeof item === 'object' ? item.sources : null

  return (
    <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
      <span>
        {text}
        <SourceBadges source={source} sources={sources} />
      </span>
    </li>
  )
}

// ── 핵심 포인트 섹션 ──────────────────────────────────────
function KeyPoints({ content }) {
  const merged = content.merged_points ?? content.deduped_points ?? []
  const unique = content.unique_points ?? []
  const notes = content.reusable_notes ?? []
  const questions = content.next_questions ?? []
  const rate = content.duplicate_merge_rate
  const stats = content.stats

  const hasAny = merged.length || unique.length || notes.length || questions.length

  return (
    <div className="card flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">핵심 포인트</h3>
        {rate != null && (
          <span className="badge badge-blue">
            {typeof rate === 'string' ? rate : `${rate}%`} 병합
          </span>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="출처" value={stats.totalSources} />
          <Stat label="전체 포인트" value={stats.totalInformationPoints} />
          <Stat label="고유 포인트" value={stats.mergedInformationPoints} />
          <Stat label="반복 병합" value={stats.removedRepeatedPoints} />
        </div>
      )}

      {!hasAny && (
        <p className="text-sm text-slate-400">포인트 정보가 없습니다.</p>
      )}

      {merged.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="label">병합된 반복 정보</p>
          <ul className="flex flex-col gap-1.5">
            {merged.map((item, i) => <PointItem key={i} item={item} />)}
          </ul>
        </div>
      )}

      {unique.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="label">보존된 고유 정보</p>
          <ul className="flex flex-col gap-1.5">
            {unique.map((item, i) => <PointItem key={i} item={item} />)}
          </ul>
        </div>
      )}

      {notes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="label">바로 활용할 수 있는 정리</p>
          <ul className="flex flex-col gap-1.5">
            {notes.map((item, i) => <PointItem key={i} item={item} />)}
          </ul>
        </div>
      )}

      {questions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="label">더 알아볼 질문</p>
          <ul className="flex flex-col gap-1.5">
            {questions.map((item, i) => <PointItem key={i} item={item} />)}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── 제거된 내용 (토글) ────────────────────────────────────
function RemovedSection({ content }) {
  const [open, setOpen] = useState(false)
  const noise = content.removed_noise ?? []
  const diff = content.different_perspectives ?? []
  if (!noise.length && !diff.length) return null

  return (
    <div className="card p-0 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-600">제거된 내용</span>
        <i className={`ti ${open ? 'ti-chevron-up' : 'ti-chevron-down'} text-slate-400 text-sm`} />
      </button>

      {open && (
        <div className="flex flex-col gap-4 px-5 pb-5">
          {noise.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="label">제거된 노이즈</p>
              <ul className="flex flex-col gap-1.5">
                {noise.map((item, i) => <PointItem key={i} item={item} />)}
              </ul>
            </div>
          )}
          {diff.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="label">서로 다른 의견</p>
              <ul className="flex flex-col gap-1.5">
                {diff.map((item, i) => <PointItem key={i} item={item} />)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── 최종 초안 카드 ────────────────────────────────────────
function FinalDraftCard({ draft }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(buildFinalDraftMarkdown(draft))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!draft) return null

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">최종 초안</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-500 transition-colors"
        >
          <i className={`ti ${copied ? 'ti-check text-emerald-500' : 'ti-copy'} text-sm`} />
          {copied ? '복사됨!' : 'Markdown 복사'}
        </button>
      </div>
      <FinalDraft draft={draft} />
    </div>
  )
}

function FinalDraft({ draft }) {
  if (typeof draft === 'string') {
    return <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{draft}</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {draft.intro && (
        <p className="text-sm text-gray-700 leading-relaxed">{draft.intro}</p>
      )}
      {draft.sections?.map((sec, i) => (
        <div key={i} className="flex flex-col gap-2">
          {sec.label && (
            <p className="text-sm font-semibold text-slate-700">{sec.label}</p>
          )}
          <DraftSection type={sec.type} content={sec.content} />
          {sec.bridge && (
            <p className="text-sm text-slate-400 italic leading-relaxed">{sec.bridge}</p>
          )}
        </div>
      ))}
      {draft.outro && (
        <p className="text-sm text-gray-700 leading-relaxed">{draft.outro}</p>
      )}
    </div>
  )
}

function DraftSection({ type, content }) {
  if (!content) return null

  if (type === 'prose') {
    return <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
  }

  if (type === 'quote') {
    return (
      <blockquote className="border-l-2 border-blue-300 pl-4 text-sm text-gray-600 italic leading-relaxed">
        {content}
      </blockquote>
    )
  }

  if (type === 'list' && Array.isArray(content)) {
    return (
      <ul className="flex flex-col gap-2">
        {content.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            <span>
              {item.title && <span className="font-medium text-slate-700">{item.title} </span>}
              {item.desc}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (type === 'steps' && Array.isArray(content)) {
    return (
      <ol className="flex flex-col gap-3">
        {content.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center shrink-0">
              {item.step ?? i + 1}
            </span>
            <span>
              {item.title && <span className="font-medium text-slate-700">{item.title} </span>}
              {item.desc}
            </span>
          </li>
        ))}
      </ol>
    )
  }

  return <p className="text-sm text-gray-600 leading-relaxed">{String(content)}</p>
}

// ── 통계 셀 ──────────────────────────────────────────────
function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-2">
      <p className="text-sm font-semibold text-slate-700">{value ?? '-'}</p>
      <p className="text-2xs text-slate-400 mt-0.5">{label}</p>
    </div>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
export default function ContentDetail({ content, onBack, onDelete }) {
  return (
    <div className="flex flex-col gap-5">
      {/* 헤더 */}
      <div className="flex items-start gap-3">
        <button onClick={onBack} className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors shrink-0">
          <i className="ti ti-arrow-left text-lg" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">{content.content_type}</p>
          <h2 className="text-xl font-semibold text-slate-800 leading-snug">{content.title}</h2>
          {content.core_summary && (
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{content.core_summary}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(content.id)}
          className="mt-0.5 text-slate-300 hover:text-red-400 transition-colors shrink-0"
        >
          <i className="ti ti-trash text-base" />
        </button>
      </div>

      {/* 섹션 1: 핵심 포인트 */}
      <KeyPoints content={content} />

      {/* 섹션 2: 제거된 내용 (기본 닫힘) */}
      <RemovedSection content={content} />

      {/* 섹션 3: 최종 초안 */}
      <FinalDraftCard draft={content.final_draft} />
    </div>
  )
}

// ── 마크다운 빌더 ─────────────────────────────────────────
function buildFinalDraftMarkdown(draft) {
  if (typeof draft === 'string') return draft

  const parts = []
  if (draft.intro) parts.push(draft.intro)

  draft.sections?.forEach(sec => {
    if (sec.label) parts.push(`\n### ${sec.label}`)
    if (sec.type === 'prose' || sec.type === 'quote') {
      parts.push(sec.content)
    } else if (Array.isArray(sec.content)) {
      sec.content.forEach((item, i) => {
        const prefix = sec.type === 'steps' ? `${item.step ?? i + 1}. ` : '- '
        const title = item.title ? `**${item.title}** ` : ''
        parts.push(`${prefix}${title}${item.desc ?? ''}`)
      })
    }
    if (sec.bridge) parts.push(`\n*${sec.bridge}*`)
  })

  if (draft.outro) parts.push(`\n${draft.outro}`)
  return parts.join('\n')
}
