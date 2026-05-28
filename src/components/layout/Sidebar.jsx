import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/StoreProvider'
import { useAuth } from '../../store/AuthContext'
import SettingsModal from './SettingsModal'
import { useProfile } from '../../hooks/useProfile'

export default function Sidebar({ tabs, activeTab, onTabChange }) {
  const { scraps: { scraps }, folders: { folders } } = useStore()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { profile } = useProfile()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <>
    {/* 모바일 하단 탭바 */}
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-white border-t border-slate-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs transition-colors
            ${activeTab === tab.id ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}
        >
          <i className={`ti ${tab.icon} text-xl`} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>

    <aside className="hidden md:flex md:flex-col w-60 lg:w-72 h-full shrink-0 bg-white border-r border-slate-100">

      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-base leading-none">P</span>
          </div>
          <span className="text-xl font-black text-slate-800 tracking-widest">PEEK</span>
        </div>
        <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
          AI가 링크를 읽고 콘텐츠로<br />만들어주는 스크랩 저장소
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-0.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base w-full text-left transition-all
              ${activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <i className={`ti ${tab.icon} text-lg`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Stats */}
      <div className="px-6 py-4 border-t border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">저장 현황</p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <i className="ti ti-link text-slate-400 text-sm" />
              링크
            </span>
            <span className="text-base font-bold text-slate-700">{scraps.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <i className="ti ti-folder text-slate-400 text-sm" />
              폴더
            </span>
            <span className="text-base font-bold text-slate-700">{folders.length}</span>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-5 py-5 border-t border-slate-100 relative">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowMenu(prev => !prev)}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
            {profile?.avatar_url && !avatarError
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
              : <i className="ti ti-user text-white text-base" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-slate-700 truncate">{profile?.nickname ? `${profile.nickname} 저장소` : '나의 저장소'} </p>
            <p className="text-sm text-slate-400 truncate">{user?.email ?? '개인 스크랩'}</p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setShowSettings(true) }}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <i className="ti ti-settings text-base" />
          </button>
        </div>

        {showMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <i className="ti ti-logout text-sm" />
              로그아웃
            </button>
          </div>
        )}
      </div>

    </aside>

    {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
