export default function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100/50">
      <div className="flex items-center gap-2">
        <span className="text-blue-600 font-semibold text-xl tracking-tight">Peek</span>
        <span className="text-2xs text-blue-400 font-medium mt-0.5">AI 스크랩</span>
      </div>
      <button className="text-blue-400 hover:text-blue-600 transition-colors">
        <i className="ti ti-settings text-lg" />
      </button>
    </header>
  )
}
