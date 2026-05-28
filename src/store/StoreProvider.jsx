import { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { getFolders, getScraps, getContents } from '../services/storage'
import { supabase } from '../services/supabase'
import { nowISO } from '../utils/date'

// ─────────────────────────────────────────
// 내부 훅 — StoreProvider 안에서만 사용
// ─────────────────────────────────────────

/**
 * 함수형 업데이트를 사용해 stale closure 버그 제거.
 * persist를 setScraps 콜백 내부에서 호출하므로 의존성 배열이 비어 있어도 안전.
 */
function useFoldersInternal() {
  const [folders, setFolders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getFolders().then(data => setFolders(data)).finally(() => setIsLoading(false))
  }, [])

  const addFolder = useCallback(async (name) => {
    const { data: { user } } = await supabase.auth.getUser()
    const newFolder = { name, description: '', keywords: [], created_at: nowISO(), updated_at: nowISO(), user_id: user.id }
    const { data, error } = await supabase.from('folders').insert(newFolder).select().single()
    if (error) throw error
    setFolders(prev => [...prev, data])
    return data
  }, [])

  const updateFolder = useCallback(async (id, patch) => {
    const { error } = await supabase.from('folders').update({ ...patch, updated_at: nowISO() }).eq('id', id)
    if (error) throw error
    setFolders(prev => prev.map(f => f.id === id ? { ...f, ...patch, updated_at: nowISO() } : f))
  }, [])

  const deleteFolder = useCallback(async (id) => {
    const { error } = await supabase.from('folders').delete().eq('id', id)
    if (error) throw error
    setFolders(prev => prev.filter(f => f.id !== id))
  }, [])

  const findOrCreateFolder = useCallback(async (name) => {
    const existing = folders.find(f => f.name === name)
    if (existing) return existing

    const { data: { user } } = await supabase.auth.getUser()
    const newFolder = { name, description: '', keywords: [], created_at: nowISO(), updated_at: nowISO(), user_id: user.id }
    const { data, error } = await supabase.from('folders').insert(newFolder).select().single()
    if (error) throw error
    setFolders(prev => [...prev, data])
    return data
  }, [folders])

  return { folders, addFolder, updateFolder, deleteFolder, findOrCreateFolder }
}

function useScrapsInternal() {
  const [scraps, setScraps] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getScraps().then(data => setScraps(data)).finally(() => setIsLoading(false))
  }, [])

  const addScrap = useCallback(async (data) => {
    const { data: { user } } = await supabase.auth.getUser()
    const newScrap = { saved_at: nowISO(), user_id: user.id, ...data }
    const { data: created, error } = await supabase.from('scraps').insert(newScrap).select().single()
    if (error) throw error
    setScraps(prev => [created, ...prev])
    return created
  }, [])

  const updateScrap = useCallback(async (id, patch) => {
    const { error } = await supabase.from('scraps').update(patch).eq('id', id)
    if (error) throw error
    setScraps(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }, [])

  const deleteScrap = useCallback(async (id) => {
    const { error } = await supabase.from('scraps').delete().eq('id', id)
    if (error) throw error
    setScraps(prev => prev.filter(s => s.id !== id))
  }, [])

  // 파생값이므로 메모이제이션 없이 함수 형태 유지 (호출 시점에 최신 scraps 참조)
  const scrapsByFolder = useCallback((folderId) =>
    scraps.filter(s => s.folder_id === folderId)
  , [scraps])

  return { scraps, addScrap, updateScrap, deleteScrap, scrapsByFolder }
}

function useContentsInternal() {
  const [contents, setContents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getContents().then(data => setContents(data)).finally(() => setIsLoading(false))
  }, [])

  const addContent = useCallback(async (data) => {
    const { data: { user } } = await supabase.auth.getUser()
    const newContent = { created_at: nowISO(), user_id: user.id, ...data }
    const { data: created, error } = await supabase.from('contents').insert(newContent).select().single()
    if (error) throw error
    setContents(prev => [created, ...prev])
    return created
  }, [])

  const deleteContent = useCallback(async (id) => {
    const { error } = await supabase.from('contents').delete().eq('id', id)
    if (error) throw error
    setContents(prev => prev.filter(c => c.id !== id))
  }, [])

  const contentsByFolder = useCallback((folderId) =>
    contents.filter(c => c.folder_id === folderId)
  , [contents])

  return { contents, addContent, deleteContent, contentsByFolder }
}

// ─────────────────────────────────────────
// Toast (전역 알림)
// ─────────────────────────────────────────

let _toastIdCounter = 0

function useToastInternal() {
  const [toasts, setToasts] = useState([])
  const counterRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  /**
   * @param {string} message
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {number} [duration] ms
   */
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    counterRef.current += 1
    const id = `toast-${counterRef.current}`
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  return { toasts, showToast, dismissToast: dismiss }
}

// ─────────────────────────────────────────
// Context & Provider
// ─────────────────────────────────────────

const StoreCtx = createContext(null)

/**
 * 앱 전체에 단일 source of truth를 제공하는 Store Provider.
 * 각 훅의 state가 여기에서만 초기화되므로 페이지 간 데이터가 항상 동기화됩니다.
 */
export function StoreProvider({ children }) {
  const folders = useFoldersInternal()
  const scraps = useScrapsInternal()
  const contents = useContentsInternal()
  const toast = useToastInternal()

  // 참조 안정성: 각 하위 객체가 변경될 때만 새 value 생성
  const value = useMemo(
    () => ({ folders, scraps, contents, toast }),
    [folders, scraps, contents, toast]
  )

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

/**
 * 전역 store에 접근하는 훅.
 * Provider 외부에서 호출 시 명확한 오류 메시지 제공.
 */
export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>')
  return ctx
}

/**
 * 전역 토스트 알림에 접근하는 훅.
 * showToast(message, type, duration?) 으로 알림을 표시합니다.
 */
export function useToast() {
  return useStore().toast
}
