import { Badge, Tag } from '../common/Badge'

export default function AnalysisResult({ result, onSave, onDiscard }) {
  const { title, summary = [], keywords = [], suggestedFolder, contentType, reason } = result

  return (
    <div className="card flex flex-col gap-3 mt-4">
      <div className="flex items-center gap-2">
        <i className="ti ti-sparkles text-blue-500 text-sm" />
        <span className="label text-blue-500">AI 분석 완료</span>
      </div>

      <p className="text-base font-medium text-blue-900 leading-snug">{title}</p>

      <ul className="flex flex-col gap-1">
        {summary.map((line, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            {line}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge color="blue" icon="ti-folder">{suggestedFolder}</Badge>
        <Badge color="gray">{contentType}</Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {keywords.map(kw => <Tag key={kw}>{kw}</Tag>)}
      </div>

      {reason && (
        <p className="text-2xs text-blue-500/60 leading-relaxed">
          <i className="ti ti-info-circle mr-1" />{reason}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onDiscard}
          className="btn-ghost btn btn-sm"
        >
          취소
        </button>
        <button
          onClick={onSave}
          className="btn-primary btn btn-sm flex-1 justify-center"
        >
          <i className="ti ti-check text-sm" />
          저장
        </button>
      </div>
    </div>
  )
}
