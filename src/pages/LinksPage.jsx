import { useState } from 'react'
import LinkList from '../components/links/LinkList'
import LinkPreviewPanel from '../components/links/LinkPreviewPanel'
import { useFolders } from '../hooks/useFolders'
import { useScraps } from '../hooks/useScraps'

export default function LinksPage({ onNavigate }) {
  const { folders } = useFolders()
  const { scraps, deleteScrap, updateScrap } = useScraps()
  const [previewScrap, setPreviewScrap] = useState(null)

  function handleChangeFolder(scrap) {
    const folderName = window.prompt('이동할 폴더명을 입력하세요:')
    if (!folderName) return
    const folder = folders.find(f => f.name === folderName)
    if (folder) updateScrap(scrap.id, { folder_id: folder.id })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">링크</h2>
          <p className="text-sm text-blue-500/60 mt-1">{scraps.length}개 저장됨</p>
        </div>
      </div>
      <LinkList
        scraps={scraps}
        folders={folders}
        loading={false}
        onDelete={deleteScrap}
        onChangeFolder={handleChangeFolder}
        onPreview={setPreviewScrap}
        onNavigate={onNavigate}
      />
      <LinkPreviewPanel
        scrap={previewScrap}
        onClose={() => setPreviewScrap(null)}
      />
    </div>
  )
}
