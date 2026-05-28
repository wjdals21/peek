import { useState } from 'react'
import DomainIcon from '../common/DomainIcon'

export default function LinkPreviewPanel({ scrap, onClose }) {
  const [iframeError, setIframeError] = useState(false)

  if (!scrap) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 배경 오버레이 */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* 패널 */}
      <div className="w-[720px] h-full bg-white shadow-2xl flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <DomainIcon url={scrap.url} className="w-8 h-8 text-sm rounded-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{scrap.title || scrap.url}</p>
            <p className="text-xs text-slate-400 truncate">{scrap.url}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={scrap.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <i className="ti ti-external-link text-sm" />
              새 탭
            </a>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors ml-1"
            >
              <i className="ti ti-x text-lg" />
            </button>
          </div>
        </div>

        {/* iframe */}
        {!iframeError ? (
          <iframe
            src={scrap.url}
            className="flex-1 w-full border-none"
            title={scrap.title}
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <i className="ti ti-ban text-4xl text-slate-300" />
            <div>
              <p className="text-base font-medium text-slate-600">이 사이트는 미리보기를 지원하지 않아요</p>
              <p className="text-sm text-slate-400 mt-1">해당 사이트가 iframe 임베드를 차단하고 있어요.</p>
            </div>
            <a
              href={scrap.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center gap-1"
            >
              <i className="ti ti-external-link text-sm" />
              원문 바로가기
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
