import { useEffect, useRef } from 'react'

const ICONS = {
  success: { icon: 'ti-circle-check', bg: 'bg-emerald-50', border: 'border-emerald-200/60', text: 'text-emerald-700' },
  error:   { icon: 'ti-alert-circle', bg: 'bg-red-50',     border: 'border-red-200/60',     text: 'text-red-700' },
  info:    { icon: 'ti-info-circle',  bg: 'bg-blue-50',    border: 'border-blue-200/60',    text: 'text-blue-700' },
  warning: { icon: 'ti-alert-triangle', bg: 'bg-amber-50', border: 'border-amber-200/60',   text: 'text-amber-700' },
}

/**
 * 개별 토스트 항목.
 * duration ms 이후 onDismiss를 자동 호출합니다.
 */
function ToastItem({ id, message, type = 'info', duration = 3500, onDismiss }) {
  const timerRef = useRef(null)
  const style = ICONS[type] ?? ICONS.info

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timerRef.current)
  }, [id, duration, onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-soft text-sm
        ${style.bg} ${style.border} ${style.text}
        animate-[fadeSlideIn_0.2s_ease-out]
      `}
    >
      <i className={`ti ${style.icon} text-base shrink-0`} aria-hidden="true" />
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        aria-label="알림 닫기"
        className={`shrink-0 rounded p-0.5 hover:bg-black/5 transition-colors ${style.text}`}
      >
        <i className="ti ti-x text-xs" aria-hidden="true" />
      </button>
    </div>
  )
}

/**
 * 전역 토스트 컨테이너.
 * App.jsx 최상단에 렌더링하고 toasts / onDismiss를 useToast()로부터 받습니다.
 */
export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]"
      aria-label="알림 목록"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
