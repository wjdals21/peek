import { useState } from 'react'
import Button from '../common/Button'
import LinkCard from '../links/LinkCard'
import EmptyState from '../common/EmptyState'
import { formatRelativeTime } from '../../utils/date'

const MIN_CONTENT_SCRAPS = 2

function ContentCard({ content, onOpen }) {
  return (
    <div
      className="p-4 rounded-xl bg-white border border-slate-100 shadow-subtle hover:border-blue-200 hover:shadow-soft transition-all cursor-pointer"
      onClick={() => onOpen(content)}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <i className="ti ti-sparkles text-blue-400 text-xs" />
        <span className="text-2xs font-semibold uppercase tracking-wider text-blue-400">AI 콘텐츠</span>
      </div>
      <p className="text-sm font-semibold text-slate-800 leading-snug mb-1.5">{content.title}</p>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{content.coreSummary}</p>
      <p className="text-xs text-slate-400 mt-2">{formatRelativeTime(content.createdAt)}</p>
    </div>
  )
}

export default function FolderDetail({ folder, scraps, contents = [], onBack, onCreateContent, generatingContent, onOpenContent }) {
  const canCreate = scraps.length >= MIN_CONTENT_SCRAPS

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <i className="ti ti-arrow-left text-lg" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-slate-800 truncate">{folder.name}</h2>
          <p className="text-sm text-slate-400">{scraps.length}개 링크 · {contents.length}개 콘텐츠</p>
        </div>
        <div className="relative group">
          <Button
            size="sm"
            disabled={!canCreate}
            loading={generatingContent}
            onClick={onCreateContent}
            aria-describedby={!canCreate ? 'create-content-hint' : undefined}
          >
            <i className="ti ti-sparkles text-xs" />
            {canCreate ? '콘텐츠 만들기' : `링크 ${MIN_CONTENT_SCRAPS - scraps.length}개 더 필요`}
          </Button>
          {!canCreate && (
            <div
              id="create-content-hint"
              role="tooltip"
              className="absolute right-0 top-full mt-2 w-52 px-3 py-2 rounded-lg bg-slate-800 text-white text-xs leading-relaxed shadow-lg z-10
                         opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150"
            >
              <i className="ti ti-info-circle mr-1 text-blue-300" aria-hidden="true" />
              링크 2개 이상 저장 후 콘텐츠를 생성할 수 있어요. 현재 {scraps.length}개 저장됨.
            </div>
          )}
        </div>
      </div>

      {/* 2패널: 링크 목록 | 콘텐츠 목록 */}
      <div className="grid grid-cols-[1fr_340px] gap-7 items-start">
        {/* 왼쪽: 링크 목록 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">링크 목록</h3>
          {scraps.length === 0 ? (
            <EmptyState
              icon="ti-link"
              title="링크가 없어요"
              description="스크랩 탭에서 URL을 저장해보세요."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {scraps.map(scrap => (
                <LinkCard key={scrap.id} scrap={scrap} />
              ))}
            </div>
          )}
        </div>

        {/* 오른쪽: 생성된 콘텐츠 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">생성된 콘텐츠</h3>
          {contents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
              <i className="ti ti-file-text text-3xl text-slate-300" />
              <div>
                <p className="text-sm font-medium text-slate-500">콘텐츠가 없어요</p>
                <p className="text-xs text-slate-400 mt-1">
                  {canCreate
                    ? '콘텐츠 만들기 버튼을 눌러보세요.'
                    : `링크 ${MIN_CONTENT_SCRAPS - scraps.length}개를 더 저장하면 생성할 수 있어요.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {contents.map(content => (
                <ContentCard key={content.id} content={content} onOpen={onOpenContent ?? (() => {})} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
