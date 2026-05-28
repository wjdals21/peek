import { useMemo } from 'react'
import FolderCard from './FolderCard'
import EmptyState from '../common/EmptyState'
import { FolderCardSkeleton } from '../common/LoadingSkeleton'

export default function FolderGrid({ folders, scraps, loading, onCreateContent, onOpenFolder, onNavigate }) {
  /**
   * O(F×S) → O(F+S) 최적화:
   * 매 렌더마다 folders.map 내부에서 scraps.filter를 반복하는 대신,
   * 먼저 scraps를 folderId 기준 Map으로 그룹핑(O(S))한 뒤 O(1)로 조회.
   */
  const scrapsByFolderId = useMemo(() => {
    const m = new Map()
    for (const s of scraps) {
      const arr = m.get(s.folder_id) ?? []
      arr.push(s)
      m.set(s.folder_id, arr)
    }
    return m
  }, [scraps])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-5">
        {[0, 1, 2].map(i => <FolderCardSkeleton key={i} />)}
      </div>
    )
  }

  if (!folders.length) {
    return (
      <EmptyState
        icon="ti-folder"
        title="폴더가 없어요"
        description="링크를 저장하면 AI가 자동으로 주제별 폴더를 만들어드려요."
        action="스크랩하러 가기"
        onAction={() => onNavigate?.('scrap')}
      />
    )
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      {folders.map(folder => {
        const folderScraps = scrapsByFolderId.get(folder.id) ?? []
        return (
          <FolderCard
            key={folder.id}
            folder={folder}
            scrapCount={folderScraps.length}
            keywordCount={new Set(folderScraps.flatMap(s => s.keywords ?? [])).size}
            onCreateContent={() => onCreateContent(folder)}
            onOpen={() => onOpenFolder(folder)}
          />
        )
      })}
    </div>
  )
}
