import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { Input } from '../components/common/Input'
import Button from '../components/common/Button'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="card w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-black text-base leading-none">P</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-widest">PEEK</span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-slate-800">로그인</h1>
            <p className="text-sm text-slate-400">Peek에 오신 걸 환영합니다.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-red-500">
              <i className="ti ti-alert-circle text-sm" />
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={loading}>
            로그인
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
