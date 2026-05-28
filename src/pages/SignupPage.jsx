import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { Input } from '../components/common/Input'
import Button from '../components/common/Button'

export default function SignupPage() {
  const { signup } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(email, password)
      setDone(true)
    } catch (err) {
      console.error(err)
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="card w-full max-w-sm flex flex-col gap-4 text-center">
          <i className="ti ti-mail-check text-4xl text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-800">이메일을 확인해주세요</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {email}로 인증 링크를 보냈습니다.<br />
            링크를 클릭하면 로그인할 수 있습니다.
          </p>
          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            로그인 페이지로 이동
          </Link>
        </div>
      </div>
    )
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
            <h1 className="text-xl font-semibold text-slate-800">회원가입</h1>
            <p className="text-sm text-slate-400">계정을 만들고 Peek를 시작하세요.</p>
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
            placeholder="8자 이상 입력하세요"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            required
          />

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-red-500">
              <i className="ti ti-alert-circle text-sm" />
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={loading}>
            회원가입
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
