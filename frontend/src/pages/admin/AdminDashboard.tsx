import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import type { Skin } from '../../types'

export default function AdminDashboard() {
  const { data: skins = [] } = useQuery<Skin[]>({
    queryKey: ['skins'],
    queryFn: async () => {
      const { data } = await api.get('/api/skins')
      return data
    },
  })

  const disponiveis = skins.filter((s) => s.status === 'DISPONIVEL').length
  const vendidas = skins.filter((s) => s.status === 'VENDIDA').length

  return (
    <div>
      <h1 className="text-2xl font-bold uppercase tracking-widest mb-8">
        Dashboard
      </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
        Skins disponíveis
        </p>
        <p className="text-4xl font-black text-orange-500">{disponiveis}</p>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
        Skins vendidas
        </p>
        <p className="text-4xl font-black text-green-500">{vendidas}</p>
    </div>
    </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-4">
          Últimas skins cadastradas
        </h2>
        <div className="space-y-3">
          {skins.slice(0, 5).map((skin) => (
            <div
              key={skin.id}
              className="flex items-center justify-between py-3 
                         border-b border-zinc-800 last:border-0"
            >
              <div>
                <p className="font-medium text-white">
                  {skin.arma} | {skin.nome}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">
                  {skin.raridade} · {skin.desgaste}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500">
                  {Number(skin.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <span
                  className={`text-xs uppercase tracking-widest ${
                    skin.status === 'DISPONIVEL'
                      ? 'text-green-400'
                      : 'text-zinc-500'
                  }`}
                >
                  {skin.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}