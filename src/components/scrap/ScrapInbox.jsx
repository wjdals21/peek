import { useState } from 'react'
import { Input, Textarea } from '../common/Input'
import Button from '../common/Button'

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export default function ScrapInbox({ onAnalyze, loading }) {
  const [url, setUrl] = useState('')
  const [memo, setMemo] = useState('')
  const [urlError, setUrlError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValidUrl(url)) {
      setUrlError('올바른 URL 형식을 입력해주세요.')
      return
    }
    setUrlError('')
    onAnalyze({ url: url.trim(), memo: memo.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-semibold text-slate-800">스크랩</h2>
        <p className="text-sm text-blue-500/60">URL만 붙여넣으세요. 나머지는 Peek가 합니다.</p>
      </div>

      <Input
        label="URL"
        type="url"
        placeholder="https://..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        error={urlError}
        required
      />

      <Textarea
        label="메모 (선택)"
        placeholder="이 링크를 저장하는 이유나 간단한 맥락을 남겨보세요."
        value={memo}
        onChange={e => setMemo(e.target.value)}
        hint="메모가 있으면 분류 정확도가 높아집니다."
      />

      <Button
        type="submit"
        loading={loading}
        fullWidth
        size="lg"
      >
        <i className="ti ti-sparkles text-sm" />
        {loading ? 'AI가 읽는 중...' : 'AI 분석 후 저장'}
      </Button>
    </form>
  )
}
