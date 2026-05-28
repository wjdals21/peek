export function formatRelativeTime(isoString) {
  // 미래 날짜나 잘못된 값으로 인한 음수 diff 방지
  const diff = Math.max(0, Date.now() - new Date(isoString).getTime())
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export function nowISO() {
  return new Date().toISOString()
}
