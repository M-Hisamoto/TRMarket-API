import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../lib/api'
import type { AuthResponse } from '../types'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/login', {
        email,
        senha,
      })
      login(data)
      navigate('/admin')
    } catch {
      setErro('E-mail ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-widest uppercase">
            <span className="text-orange-500">TR</span>
            <span className="text-white"> Market Skins</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">
            Painel Administrativo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-5"
        >
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                         text-white placeholder-zinc-600 focus:outline-none
                         focus:border-orange-500 transition-colors"
              placeholder="admin@trmarket.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                         text-white placeholder-zinc-600 focus:outline-none
                         focus:border-orange-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p className="text-red-400 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50
                       text-black font-bold py-3 rounded-lg uppercase tracking-widest
                       text-sm transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}