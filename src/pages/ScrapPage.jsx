import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScrapInbox from '../components/scrap/ScrapInbox'
import AnalysisResult from '../components/scrap/AnalysisResult'
import AnalysisError from '../components/scrap/AnalysisError'
import DomainIcon, { getDomain } from '../components/common/DomainIcon'
import { useFolders } from '../hooks/useFolders'
import { useScraps } from '../hooks/useScraps'
import { useContents } from '../hooks/useContents'
import { useToast } from '../store/StoreProvider'
import { analyzeLink } from '../services/api'
import { formatRelativeTime } from '../utils/date'

function RecentScrapCard({ scrap }) {
  return (
    <a
      href={scrap.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-xl bg-white border border-slate-100 shadow-subtle hover:border-blue-200 hover:shadow-soft transition-all group overflow-hidden"
    >
      {scrap.thumbnail && (
        <img
          src={scrap.thumbnail}
          alt=""
          className="w-full h-28 object-cover"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      )}
      <div className="flex items-start gap-3 p-4">
        <DomainIcon url={scrap.url} className="w-10 h-10 text-base rounded-lg shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
            {scrap.title || getDomain(scrap.url)}
          </p>
          <p className="text-sm text-slate-400 mt-1">{formatRelativeTime(scrap.saved_at)}</p>
        </div>
      </div>
    </a>
  )
}

function ContentPreviewCard({ content }) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl bg-white border border-slate-100 shadow-subtle">
      <div className="flex items-center gap-1.5 text-blue-500">
        <i className="ti ti-file-text text-sm" />
        <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">최신 콘텐츠</span>
      </div>
      <p className="text-base font-semibold text-slate-800 leading-snug">{content.title}</p>
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">{content.coreSummary}</p>
      {content.dedupedPoints?.slice(0, 2).map((pt, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <span className="mt-2 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
          <span className="line-clamp-2">{pt}</span>
        </div>
      ))}
      {content.mergedPoints?.slice(0, 2).map((pt, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <span className="mt-2 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
          <span className="line-clamp-2">{pt.point ?? pt}</span>
        </div>
      ))}
      <p className="text-sm text-slate-400">{formatRelativeTime(content.createdAt)}</p>
    </div>
  )
}

function EmptyContentPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
      <i className="ti ti-file-text text-3xl text-slate-300" />
      <div>
        <p className="text-base font-medium text-slate-600">콘텐츠가 없어요</p>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          폴더에 링크를 2개 이상<br />저장하면 생성할 수 있어요.
        </p>
      </div>
    </div>
  )
}

export default function ScrapPage({ onNavigate, isLoggedIn }) {
  const { folders, findOrCreateFolder } = useFolders()
  const { scraps, addScrap } = useScraps()
  const { contents } = useContents()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [pendingInput, setPendingInput] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  const recentScraps = scraps.slice(0, 6)
  const latestContent = contents[0] ?? null

  async function handleAnalyze({ url, memo }) {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    setLoading(true)
    setAnalysisResult(null)
    setAnalysisError(false)
    setPendingInput({ url, memo })
    try {
      const result = await analyzeLink({ url, memo, folders })
      setAnalysisResult(result)
    } catch {
      setAnalysisError(true)
      showToast('AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해보세요.', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      const folder = await findOrCreateFolder(analysisResult.suggestedFolder)
      await addScrap({
        url: pendingInput.url,
        memo: pendingInput.memo,
        title: analysisResult.title,
        summary: analysisResult.summary,
        keywords: analysisResult.keywords,
        folder_id: folder.id,
        content_type: analysisResult.contentType,
        fetch_status: 'success',
        thumbnail: analysisResult.thumbnail ?? null,
      })
      setAnalysisResult(null)
      setPendingInput(null)
      setSavedMessage(true)
      showToast('링크가 저장되었습니다.', 'success')
      setTimeout(() => setSavedMessage(false), 2500)
    } catch (err) {
      console.error(err)
      showToast('저장 중 오류가 발생했습니다. 저장 공간을 확인해보세요.', 'error')
    }
  }

  async function handleSaveManual(title) {
    try {
      await addScrap({
        url: pendingInput.url,
        memo: pendingInput.memo,
        title,
        summary: [],
        keywords: [],
        folder_id: null,
        content_type: '기타',
        fetch_status: 'failed',
      })
      setAnalysisError(false)
      setPendingInput(null)
      setSavedMessage(true)
      showToast('링크가 저장되었습니다.', 'success')
      setTimeout(() => setSavedMessage(false), 2500)
    } catch {
      showToast('저장 중 오류가 발생했습니다. 저장 공간을 확인해보세요.', 'error')
    }
  }

  function handleDiscard() {
    setAnalysisResult(null)
    setAnalysisError(false)
    setPendingInput(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {savedMessage && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-3">
          <i className="ti ti-circle-check text-base" />
          저장되었습니다!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[290px_1fr_290px] gap-5 lg:gap-7 items-start">

        {/* 왼쪽: 최근 저장 */}
        <div className="hidden md:flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-700">최근 저장</h3>
            {scraps.length > 0 && (
              <span className="badge badge-gray">{scraps.length}</span>
            )}
          </div>
          {recentScraps.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl border border-dashed border-slate-200 text-center">
              <i className="ti ti-inbox text-2xl text-slate-300" />
              <p className="text-xs text-slate-400">아직 저장된 링크가 없어요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentScraps.map(scrap => (
                <RecentScrapCard key={scrap.id} scrap={scrap} />
              ))}
            </div>
          )}
        </div>

        {/* 가운데: 입력 폼 + AI 결과 */}
        <div className="flex flex-col gap-5">
          <ScrapInbox onAnalyze={handleAnalyze} loading={loading} />

          {!analysisResult && !analysisError && (
            <div className="card flex flex-col items-center justify-center gap-4 py-14 border-dashed border-blue-100 bg-blue-50/20 shadow-none">
              <i className="ti ti-sparkles text-4xl text-blue-200" />
              <div className="text-center">
                <p className="text-base font-medium text-slate-600">AI 분석 결과</p>
                <p className="text-sm text-slate-400 mt-1">URL을 저장하면 여기에 결과가 나타납니다.</p>
              </div>
            </div>
          )}
          {analysisResult && (
            <AnalysisResult result={analysisResult} onSave={handleSave} onDiscard={handleDiscard} />
          )}
          {analysisError && (
            <AnalysisError
              url={pendingInput?.url}
              memo={pendingInput?.memo}
              onSaveManual={handleSaveManual}
              onRetry={() => handleAnalyze(pendingInput)}
              onDiscard={handleDiscard}
            />
          )}
        </div>

        {/* 오른쪽: 최신 콘텐츠 미리보기 */}
        <div className="hidden lg:flex flex-col gap-3">
          <h3 className="text-base font-semibold text-slate-700">내 콘텐츠</h3>
          {latestContent ? (
            <ContentPreviewCard content={latestContent} />
          ) : (
            <EmptyContentPanel />
          )}
        </div>

      </div>
    </div>
  )
}
