import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import ScrapPage from './pages/ScrapPage'
import FolderPage from './pages/FolderPage'
import LinksPage from './pages/LinksPage'
import ContentPage from './pages/ContentPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ToastContainer from './components/common/Toast'
import { useToast } from './store/StoreProvider'
import { useAuth } from './store/AuthContext'

const TABS = [
  { id: 'scrap', label: '스크랩', icon: 'ti-inbox' },
  { id: 'folder', label: '폴더', icon: 'ti-folder' },
  { id: 'links', label: '링크', icon: 'ti-link' },
  { id: 'content', label: '내 콘텐츠', icon: 'ti-file-text' },
]

const PROTECTED_TABS = ['folder', 'links', 'content']

function MainApp({ isLoggedIn }) {
  const [activeTab, setActiveTab] = useState('scrap')
  const navigate = useNavigate()

  function handleTabChange(tab) {
    if (!isLoggedIn && PROTECTED_TABS.includes(tab)) {
      navigate('/login')
      return
    }
    setActiveTab(tab)
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-12 py-10">
          {activeTab === 'scrap'   && <ScrapPage onNavigate={setActiveTab} isLoggedIn={isLoggedIn} />}
          {activeTab === 'folder'  && <FolderPage onNavigate={setActiveTab} />}
          {activeTab === 'links'   && <LinksPage onNavigate={setActiveTab} />}
          {activeTab === 'content' && <ContentPage onNavigate={setActiveTab} />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const { toasts, dismissToast } = useToast()
  const { user} = useAuth()
  const isLoggedIn = !!user // 3단계 AuthContext 연결 후 교체

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/*" element={<MainApp isLoggedIn={isLoggedIn} />} />
      </Routes>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
