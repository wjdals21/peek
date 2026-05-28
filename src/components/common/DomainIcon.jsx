const ICON_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-rose-500', 'bg-cyan-500', 'bg-amber-500',
]

/**
 * URL 도메인의 첫 글자를 색상 아이콘으로 표시하는 공통 컴포넌트.
 * NaN 방지: charCodeAt(0)이 NaN을 반환할 때 || 0으로 안전하게 처리.
 */
export function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

export default function DomainIcon({ url, className = 'w-8 h-8 text-sm rounded-lg' }) {
  const domain = getDomain(url)
  const initial = domain[0]?.toUpperCase() ?? '?'
  // charCodeAt(0)이 NaN인 경우(빈 문자열 등) || 0으로 0을 사용해 색상 배열 접근 안전화
  const code = domain.charCodeAt(0) || 0
  const color = ICON_COLORS[code % ICON_COLORS.length]
  return (
    <div className={`${className} ${color} flex items-center justify-center text-white font-bold shrink-0`}>
      {initial}
    </div>
  )
}
