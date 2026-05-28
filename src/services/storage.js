import { supabase } from './supabase'

  export function generateId() {
    return crypto.randomUUID()
  }

  // Folders
  export async function getFolders() {
    const { data, error } = await supabase.from('folders').select('*').order('created_at', { ascending: true
   })
    if (error) throw error
    return data
  }
  export async function saveFolders() {} // 더 이상 사용 안 함 (개별 CRUD로 대체)

  // Scraps
  export async function getScraps() {
    const { data, error } = await supabase.from('scraps').select('*').order('saved_at', { ascending: false
  })
    if (error) throw error
    return data
  }
  export async function saveScraps() {}

  // Contents
  export async function getContents() {
    const { data, error } = await supabase.from('contents').select('*').order('created_at', { ascending:
  false })
    if (error) throw error
    return data
  }
  export async function saveContents() {}