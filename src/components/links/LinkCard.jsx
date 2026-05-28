import { Badge, Tag } from '../common/Badge'
import { formatRelativeTime } from '../../utils/date'
import DomainIcon from '../common/DomainIcon'

const contentTypeColor = {
  '실무 팁': 'green',
  '사례 모음': 'green',
  '의견/칼럼': 'amber',
  '자료/근거': 'gray',
  튜토리얼: 'blue',
  뉴스: 'gray',
  의견: 'amber',
  사례: 'green',
  트렌드: 'blue',
  공식문서: 'gray',
  기타: 'gray',
}

export default function LinkCard({ scrap, onDelete, onChangeFolder, onPreview }) {
  const typeColor = contentTypeColor[scrap.content_type] ?? 'gray'

  return (
    <div className="card flex flex-col gap-3.5 cursor-pointer hover:border-blue-200 hover:shadow-soft transition-all overflow-hidden !p-0" onClick={() => onPreview?.(scrap)}>
      {scrap.thumbnail && (
        <img
          src={scrap.thumbnail}
          alt=""
          className="w-full h-36 object-cover"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      )}
      <div className="flex flex-col gap-3.5 p-6">
      {/* 헤더: 아이콘 + 제목 + 유형 뱃지 */}
      <div className="flex items-start gap-3">
        <DomainIcon url={scrap.url} className="w-9 h-9 text-sm rounded-lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge color={typeColor}>{scrap.content_type ?? '기타'}</Badge>
            {scrap.fetch_status === 'failed' && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <i className="ti ti-alert-circle text-xs" />fetch 실패
              </span>
            )}
          </div>
          <a
            href={scrap.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-2 block"
          >
            {scrap.title || scrap.url}
          </a>
        </div>
      </div>

      {/* 요약 */}
      {scrap.summary?.length > 0 && (
        <ul className="flex flex-col gap-1.5 pl-1">
          {scrap.summary.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-500 leading-relaxed">
              <span className="mt-2 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
              {line}
            </li>
          ))}
        </ul>
      )}

      {/* 키워드 */}
      <div className="flex flex-col gap-2">
        {scrap.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {scrap.keywords.map(kw => <Tag key={kw}>{kw}</Tag>)}
          </div>
        )}
      </div>

      {/* 푸터: 시간 + 액션 */}
      <div className="flex items-center justify-between pt-0.5 border-t border-slate-100">
        <span className="text-xs text-slate-400">{formatRelativeTime(scrap.saved_at)}</span>
        <div className="flex items-center gap-3">
          {onChangeFolder && (
            <button onClick={e => { e.stopPropagation(); onChangeFolder() }} className="text-slate-400 hover:text-blue-600 text-xs flex items-center gap-1 transition-colors">
              <i className="ti ti-edit text-xs" />폴더
            </button>
          )}
          <a
            href={scrap.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-slate-400 hover:text-blue-600 text-xs flex items-center gap-1 transition-colors"
          >
            <i className="ti ti-external-link text-xs" />원문
          </a>
          {onDelete && (
            <button onClick={e => { e.stopPropagation(); onDelete(scrap.id) }} className="text-slate-300 hover:text-red-500 transition-colors">
              <i className="ti ti-trash text-xs" />
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
