import { useState } from 'react'
import { Input } from '../common/Input'
import Button from '../common/Button'

export default function AnalysisError({ url, memo, onSaveManual, onRetry, onDiscard }) {
  const [manualTitle, setManualTitle] = useState('')

  const hasMemo = !!memo

  return (
    <div className="card flex flex-col gap-3 mt-4 border-red-100">
      <div className="flex items-center gap-2 text-red-600">
        <i className="ti ti-alert-circle text-sm" />
        <span className="text-sm font-medium">이 페이지는 직접 읽어올 수 없어요.</span>
      </div>

      {hasMemo ? (
        <p className="text-2xs text-gray-500">
          메모를 기반으로 최소 분류를 제공합니다. 제목을 직접 입력하면 저장할 수 있어요.
        </p>
      ) : (
        <p className="text-2xs text-gray-500">
          메모를 남기면 최소 분류가 가능합니다. 또는 제목만 입력해서 저장하세요.
        </p>
      )}

      <Input
        label="제목 직접 입력"
        placeholder="페이지 제목을 입력하세요"
        value={manualTitle}
        onChange={e => setManualTitle(e.target.value)}
      />

      <div className="flex gap-2">
        <button onClick={onDiscard} className="btn-ghost btn btn-sm">
          취소
        </button>
        <button onClick={onRetry} className="btn-secondary btn btn-sm">
          <i className="ti ti-refresh text-xs" />
          다시 시도
        </button>
        <button
          onClick={() => onSaveManual(manualTitle)}
          disabled={!manualTitle.trim()}
          className="btn-primary btn btn-sm flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          저장
        </button>
      </div>
    </div>
  )
}
