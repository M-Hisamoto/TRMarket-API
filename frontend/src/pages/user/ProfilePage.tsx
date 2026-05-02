import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../lib/api'
import type { User } from '../../types'

export default function ProfilePage() {
  const [sucesso, setSucesso] = useState('')

  const { data: user } = useQuery<User>({
    queryKey: ['perfil'],
    queryFn: async () => {
      const { data } = await api.get('/api/user/perfil')
      return data
    },
  })

  const [lembretes, setLembretes] = useState<boolean>(false)
  const [nome, setNome] = useState<string>('')

  const preferenciaMutation = useMutation({
    mutationFn: (lembretes: boolean) =>
      api.put('/api/user/preferencias', { lembretes }),
    onSuccess: () => {
      setSucesso('Preferências salvas!')
      setTimeout(() => setSucesso(''), 3000)
    },
  })

  const perfilMutation = useMutation({
    mutationFn: (nome: string) =>
      api.put('/api/user/perfil', { nome }),
    onSuccess: () => {
      setSucesso('Perfil atualizado!')
      setTimeout(() => setSucesso(''), 3000)
    },
  })

  const nomeAtual = nome || user?.nome || ''
  const lembretesAtual = lembretes ?? user?.lembretes ?? false

  const inputClass = `w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                      text-white focus:outline-none focus:border-orange-500 transition-colors`

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-widest mb-2">
          Meu <span className="text-orange-500">Perfil</span>
        </h1>
        <p className="text-zinc-500 text-sm">{user?.email}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-5">
            Informações pessoais
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                Nome
              </label>
              <input
                className={inputClass}
                value={nomeAtual}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <button
              onClick={() => perfilMutation.mutate(nomeAtual)}
              disabled={perfilMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50
                         text-black font-bold px-5 py-2.5 rounded-lg uppercase
                         tracking-widest text-sm transition-colors"
            >
              {perfilMutation.isPending ? 'Salvando...' : 'Salvar nome'}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-5">
            Notificações por e-mail
          </h2>
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={lembretesAtual}
              onChange={(e) => setLembretes(e.target.checked)}
              className="w-5 h-5 accent-orange-500 mt-0.5"
            />
            <div>
              <p className="text-white text-sm font-medium">
                Receber lembretes de novas skins
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Você receberá um e-mail quando novas skins forem adicionadas à vitrine.
              </p>
            </div>
          </label>
          <button
            onClick={() => preferenciaMutation.mutate(lembretesAtual)}
            disabled={preferenciaMutation.isPending}
            className="mt-5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50
                       text-black font-bold px-5 py-2.5 rounded-lg uppercase
                       tracking-widest text-sm transition-colors"
          >
            {preferenciaMutation.isPending ? 'Salvando...' : 'Salvar preferências'}
          </button>
        </div>

        {sucesso && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-400 text-sm text-center uppercase tracking-widest">
              {sucesso}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}