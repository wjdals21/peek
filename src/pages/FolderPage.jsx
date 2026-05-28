import { useState } from 'react'
import FolderGrid from '../components/folder/FolderGrid'
import FolderDetail from '../components/folder/FolderDetail'
import ContentDetail from '../components/content/ContentDetail'
import { useFolders } from '../hooks/useFolders'
import { useScraps } from '../hooks/useScraps'
import { useContents } from '../hooks/useContents'
import { useToast } from '../store/StoreProvider'
import { generateContent } from '../services/api'

export default function FolderPage({ onNavigate }) {
  const { folders } = useFolders()
  const { scraps } = useScraps()
  const { contents, addContent, deleteContent } = useContents()
  const { showToast } = useToast()

  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedContent, setSelectedContent] = useState(null)
  const [generatingContent, setGeneratingContent] = useState(false)

  async function handleCreateContent(folder) {
    const folderScraps = scraps.filter(s => s.folder_id === folder.id)
    setGeneratingContent(true)
    try {
      const result = await generateContent({ folderName: folder.name, scraps: folderScraps })
      await addContent({
        folder_id: folder.id,
        title: result.title,
        content_type: result.contentType,
        core_summary: result.summary ?? result.coreSummary,
        duplicate_merge_rate: result.duplicateMergeRate,
        stats: result.stats,
        merged_points: result.mergedPoints ?? result.dedupedPoints,
        unique_points: result.uniquePoints ?? result.uniqueInsights,
        removed_noise: result.removedNoise,
        deduped_points: result.dedupedPoints,
        different_perspectives: result.differentPerspectives,
        reusable_notes: result.reusableNotes,
        next_questions: result.nextQuestions,
        final_draft: result.finalDraft,
        source_scrap_ids: folderScraps.map(s => s.id),
      })
      showToast('콘텐츠가 생성되었습니다.', 'success')
    } catch (err) {
      console.error('콘텐츠 생성 실패:', err)
      showToast('콘텐츠 생성에 실패했습니다. 잠시 후 다시 시도해보세요.', 'error')
    } finally {
      setGeneratingContent(false)
    }
  }

  function handleDeleteContent(id) {
    deleteContent(id)
    if (selectedContent?.id === id) setSelectedContent(null)
  }

  // 콘텐츠 상세 뷰
  if (selectedContent) {
    return (
      <ContentDetail
        content={selectedContent}
        onBack={() => setSelectedContent(null)}
        onDelete={handleDeleteContent}
      />
    )
  }

  // 폴더 상세 뷰
  if (selectedFolder) {
    const folderScraps = scraps.filter(s => s.folder_id === selectedFolder.id)
    const folderContents = contents.filter(c => c.folder_id === selectedFolder.id)
    return (
      <FolderDetail
        folder={selectedFolder}
        scraps={folderScraps}
        contents={folderContents}
        onBack={() => setSelectedFolder(null)}
        onCreateContent={() => handleCreateContent(selectedFolder)}
        generatingContent={generatingContent}
        onOpenContent={setSelectedContent}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">폴더</h2>
        <p className="text-sm text-slate-400 mt-1">{folders.length}개 폴더</p>
      </div>
      <FolderGrid
        folders={folders}
        scraps={scraps}
        loading={false}
        onCreateContent={handleCreateContent}
        onOpenFolder={setSelectedFolder}
        onNavigate={onNavigate}
      />
    </div>
  )
}
