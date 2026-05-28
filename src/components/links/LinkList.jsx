import { useState } from 'react'
import LinkCard from './LinkCard'
import EmptyState from '../common/EmptyState'
import { LinkCardSkeleton } from '../common/LoadingSkeleton'

export default function LinkList({ scraps, folders, loading, onDelete, onChangeFolder, onPreview, onNavigate }) {
  const [filterFolderId, setFilterFolderId] = useState(null)

  const filtered = filterFolderId
    ? scraps.filter(s => s.folder_id === filterFolderId)
    : scraps

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5">
        {[0, 1, 2, 3].map(i => <LinkCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {folders.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterFolderId(null)}
            className={`badge cursor-pointer ${!filterFolderId ? 'badge-blue' : 'badge-gray'}`}
          >
            전체
          </button>
          {folders.map(f => (
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

      {filtered.length === 0 ? (
        <EmptyState
          icon="ti-link"
          title="저장된 링크가 없어요"
          description="스크랩 탭에서 첫 번째 링크를 저장해보세요."
          action="스크랩하러 가기"
          onAction={() => onNavigate?.('scrap')}
        />
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(scrap => (
            <LinkCard
              key={scrap.id}
              scrap={scrap}
              onDelete={onDelete}
              onChangeFolder={() => onChangeFolder(scrap)}
              onPreview={onPreview}
            />
          ))}
        </div>
      )}
    </div>
  )
}
