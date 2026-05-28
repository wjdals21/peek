import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

  const AuthContext = createContext(null)

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // 앱 시작 시 현재 로그인 상태 확인
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // 로그인/로그아웃 이벤트 감지
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }, [])

    async function login(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    }

    async function signup(email, password) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    }

    async function logout() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }

    return (
      <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
        {!loading && children}
      </AuthContext.Provider>
    )
  }

  export function useAuth() {
    return useContext(AuthContext)
  }
