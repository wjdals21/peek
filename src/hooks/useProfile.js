import { useState, useEffect } from 'react'
  import { supabase } from '../services/supabase'

  export function useProfile() {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
      async function fetchProfile() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
        } else {
          // 프로필 없으면 자동 생성
          const { data: created } = await supabase
            .from('profiles')
            .insert({ id: user.id })
            .select()
            .single()
          setProfile(created)
        }
      }
      fetchProfile()
    }, [])

    async function updateProfile(patch) {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('profiles')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single()
      setProfile(data)
    }

    async function uploadAvatar(file) {
      const { data: { user } } = await supabase.auth.getUser()
      const ext = file.name.split('.').pop()
      const path = `${user.id}.${ext}`

      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

      await updateProfile({ avatar_url: publicUrl })
    }

    return { profile, updateProfile, uploadAvatar }
  }