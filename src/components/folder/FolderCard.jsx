import Button from '../common/Button'

const MIN_CONTENT_SCRAPS = 2

export default function FolderCard({ folder, scrapCount, keywordCount, onCreateContent, onOpen }) {
  const canCreate = scrapCount >= MIN_CONTENT_SCRAPS

  return (
    <div
      className="card flex flex-col gap-4 cursor-pointer hover:border-blue-300 hover:shadow-soft transition-all"
      onClick={onOpen}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shadow-subtle shrink-0">
          <i className="ti ti-folder text-blue-500 text-lg" />
        </div>
        <p className="text-base font-semibold text-slate-800 truncate">{folder.name}</p>
      </div>

      <div className="flex items-center gap-3 text-2xs text-gray-500">
        <span className="flex items-center gap-1">
          <i className="ti ti-link text-xs text-blue-400" />
          {scrapCount}개
        </span>
        <span className="flex items-center gap-1">
          <i className="ti ti-bulb text-xs text-blue-400" />
          키워드 {keywordCount}개
        </span>
      </div>

      {scrapCount > 0 && (
        <div className="rounded-lg bg-blue-50/70 border border-blue-100 px-3 py-2 text-xs text-blue-700 leading-relaxed">
          {canCreate
            ? '정보 포인트를 병합해 콘텐츠 초안을 만들 수 있어요.'
            : '링크를 하나 더 저장하면 콘텐츠 초안을 만들 수 있어요.'}
        </div>
      )}

      <Button
        fullWidth
        size="sm"
        disabled={!canCreate}
        onClick={e => { e.stopPropagation(); onCreateContent() }}
      >
        <i className="ti ti-sparkles text-xs" />
        {canCreate
          ? '콘텐츠 만들기'
          : `링크 ${MIN_CONTENT_SCRAPS - scrapCount}개 더 필요`}
      </Button>
    </div>
  )
}
