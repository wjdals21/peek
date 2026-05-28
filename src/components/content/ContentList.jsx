import { useState, useMemo } from 'react'
import EmptyState from '../common/EmptyState'
import { formatRelativeTime } from '../../utils/date'

export default function ContentList({ contents, folders, onOpen, onDelete, onNavigate }) {
  const [filterFolderId, setFilterFolderId] = useState(null)

  const filtered = filterFolderId
    ? contents.filter(c => c.folder_id === filterFolderId)
    : contents

  const folderIds = useMemo(
    () => new Set(contents.map(c => c.folder_id)),
    [contents]
  )
  const foldersWithContents = useMemo(
    () => folders.filter(f => folderIds.has(f.id)),
    [folders, folderIds]
  )

  if (contents.length === 0) {
    return (
      <EmptyState
        icon="ti-file-text"
        title="생성된 콘텐츠가 없어요"
        description="폴더에 링크를 2개 이상 저장한 뒤, 폴더 탭에서 콘텐츠를 만들어보세요."
        action="폴더로 이동"
        onAction={() => onNavigate?.('folder')}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {foldersWithContents.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterFolderId(null)}
            className={`badge cursor-pointer ${!filterFolderId ? 'badge-blue' : 'badge-gray'}`}
          >
            전체
          </button>
          {foldersWithContents.map(f => (
            <button
              key={f.id}
              onClick={() => setFilterFolderId(f.id)}
              className={`badge cursor-pointer ${filterFolderId === f.id ? 'badge-blue' : 'badge-gray'}`}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        {filtered.map(content => (
          <div
            key={content.id}
            className="card flex flex-col gap-3 cursor-pointer hover:border-blue-300 hover:shadow-soft transition-all"
            onClick={() => onOpen(content)}
          >
            <p className="text-base font-semibold text-blue-900 leading-snug">{content.title}</p>
            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{content.core_summary}</p>
            <div className="flex items-center justify-between mt-auto pt-1">
              <span className="text-xs text-blue-500/45">{formatRelativeTime(content.created_at)}</span>
              <button
                onClick={e => { e.stopPropagation(); onDelete(content.id) }}
                className="text-red-300 hover:text-red-500"
              >
                <i className="ti ti-trash text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
