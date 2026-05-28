import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../store/AuthContext'
import Button from '../common/Button'
import { Input } from '../common/Input'
import { useProfile } from '../../hooks/useProfile'

export default function SettingsModal({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { profile, updateProfile, uploadAvatar } = useProfile()
  const [nickname, setNickname] = useState('')
  const [nicknameLoading, setNicknameLoading] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState(null)

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (profile?.nickname) setNickname(profile.nickname)
  }, [profile])

  async function handleNicknameSave() {
    setNicknameLoading(true)
    await updateProfile({ nickname })
    setNicknameLoading(false)
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      setAvatarError(false)
      await uploadAvatar(file)
    } catch {
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: '비밀번호는 8자 이상이어야 합니다.' })
      return
    }
    setPasswordLoading(true)
    setPasswordMessage(null)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordLoading(false)
    if (error) {
      setPasswordMessage({ type: 'error', text: '비밀번호 변경에 실패했습니다.' })
    } else {
      setPasswordMessage({ type: 'success', text: '비밀번호가 변경되었습니다.' })
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    const { error } = await supabase.rpc('delete_user')
    if (error) {
      setDeleteLoading(false)
      alert('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.')
      return
    }
    await logout()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col overflow-hidden max-h-[70vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">설정</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 overflow-y-auto">

          {/* 계정 정보 */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">계정 정보</h3>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-slate-400">이메일</p>
              <p className="text-sm font-medium text-slate-700 bg-slate-50 rounded-lg px-3 py-2.5">{user?.email}</p>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* 프로필 */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">프로필</h3>

            {/* 이미지 */}
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  {profile?.avatar_url && !avatarError
                    ? <img src={profile.avatar_url} className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
                    : <i className="ti ti-user text-white text-xl" />
                  }
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <p className="text-sm text-slate-400">이미지를 클릭해서 변경하세요</p>
            </div>

            {/* 닉네임 */}
            <Input
              label="닉네임"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
            <Button onClick={handleNicknameSave} loading={nicknameLoading}>저장하기</Button>
          </section>

          <div className="border-t border-slate-100" />

          {/* 비밀번호 변경 */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">비밀번호 변경</h3>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
              <Input
                label="새 비밀번호"
                type="password"
                placeholder="8자 이상 입력하세요"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="새 비밀번호 확인"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              {passwordMessage && (
                <p className={`text-sm flex items-center gap-1.5 ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                  <i className={`ti ${passwordMessage.type === 'error' ? 'ti-alert-circle' : 'ti-circle-check'} text-sm`} />
                  {passwordMessage.text}
                </p>
              )}
              <Button type="submit" loading={passwordLoading}>변경하기</Button>
            </form>
          </section>

          <div className="border-t border-slate-100" />

          {/* 회원 탈퇴 */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">위험 구역</h3>
            {!deleteConfirm ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-400">탈퇴하면 모든 스크랩과 폴더가 영구 삭제됩니다.</p>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 transition-colors text-left"
                >
                  회원 탈퇴
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 bg-red-50 rounded-xl p-4">
                <p className="text-sm font-medium text-red-700">정말 탈퇴하시겠습니까?</p>
                <p className="text-xs text-red-500">모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="flex-1 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 text-sm text-white bg-red-500 rounded-lg px-3 py-2 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading ? '처리 중...' : '탈퇴하기'}
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
