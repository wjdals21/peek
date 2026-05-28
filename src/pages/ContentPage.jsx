import { useState } from 'react'
import ContentList from '../components/content/ContentList'
import ContentDetail from '../components/content/ContentDetail'
import { useFolders } from '../hooks/useFolders'
import { useContents } from '../hooks/useContents'

export default function ContentPage({ onNavigate }) {
  const { folders } = useFolders()
  const { contents, deleteContent } = useContents()
  const [selectedContent, setSelectedContent] = useState(null)

  function handleDelete(id) {
    deleteContent(id)
    if (selectedContent?.id === id) setSelectedContent(null)
  }

  if (selectedContent) {
    return (
      <ContentDetail
        content={selectedContent}
        onBack={() => setSelectedContent(null)}
        onDelete={handleDelete}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">내 콘텐츠</h2>
        <p className="text-sm text-blue-500/60 mt-1">{contents.length}개 생성됨</p>
      </div>
      <ContentList
        contents={contents}
        folders={folders}
        onOpen={setSelectedContent}
        onDelete={handleDelete}
        onNavigate={onNavigate}
      />
    </div>
  )
}
