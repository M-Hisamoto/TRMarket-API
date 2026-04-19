import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import type { Skin } from '../../types'

export default function AdminSkins() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: skins = [], isLoading } = useQuery<Skin[]>({
  queryKey: ['skins-admin'],
  queryFn: async () => {
    const { data } = await api.get('/api/admin/skins')
    return data
  },
  })

  const venderMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/api/admin/skins/${id}/vender`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skins-admin'] }),
  })

  const deletarMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/skins/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skins-admin'] }),
  })

  const raridade: Record<string, string> = {
    CONSUMER: 'bg-zinc-600',
    INDUSTRIAL: 'bg-blue-700',
    MIL_SPEC: 'bg-blue-500',
    RESTRICTED: 'bg-purple-600',
    CLASSIFIED: 'bg-pink-600',
    COVERT: 'bg-red-600',
    CONTRABAND: 'bg-orange-400',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">
          Carregando...
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Skins</h1>
        <button
          onClick={() => navigate('/admin/skins/nova')}
          className="bg-orange-500 hover:bg-orange-600 text-black font-bold
                     px-5 py-2.5 rounded-lg uppercase tracking-widest text-sm transition-colors"
        >
          + Nova skin
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-zinc-500">
                Skin
              </th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-zinc-500">
                Raridade
              </th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-zinc-500">
                Desgaste
              </th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-zinc-500">
                Preço
              </th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-zinc-500">
                Status
              </th>
              <th className="text-right px-6 py-4 text-xs uppercase tracking-widest text-zinc-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {skins.map((skin) => (
              <tr
                key={skin.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-white">
                    {skin.arma} | {skin.nome}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {skin.statTrak && (
                      <span className="text-xs text-orange-400 bg-orange-500/10 
                                       border border-orange-500/20 px-2 py-0.5 rounded">
                        StatTrak™
                      </span>
                    )}
                    {skin.souvenir && (
                      <span className="text-xs text-yellow-400 bg-yellow-500/10 
                                       border border-yellow-500/20 px-2 py-0.5 rounded">
                        Souvenir
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs text-white px-2 py-1 rounded 
                                   uppercase tracking-widest ${raridade[skin.raridade]}`}>
                    {skin.raridade}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm">
                  {skin.desgaste.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 font-bold text-orange-500">
                  {Number(skin.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs uppercase tracking-widest font-medium ${
                    skin.status === 'DISPONIVEL' ? 'text-green-400' :
                    skin.status === 'VENDIDA' ? 'text-zinc-500' : 'text-yellow-400'
                  }`}>
                    {skin.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/skins/editar/${skin.id}`)}
                      className="text-xs uppercase tracking-widest text-zinc-400 
                                 hover:text-white transition-colors px-3 py-1.5 
                                 border border-zinc-700 rounded-lg"
                    >
                      Editar
                    </button>
                    {skin.status === 'DISPONIVEL' && (
                      <button
                        onClick={() => venderMutation.mutate(skin.id)}
                        className="text-xs uppercase tracking-widest text-green-400 
                                   hover:text-green-300 transition-colors px-3 py-1.5 
                                   border border-green-700/50 rounded-lg"
                      >
                        Vender
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Deletar esta skin?')) {
                          deletarMutation.mutate(skin.id)
                        }
                      }}
                      className="text-xs uppercase tracking-widest text-red-400 
                                 hover:text-red-300 transition-colors px-3 py-1.5 
                                 border border-red-700/50 rounded-lg"
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {skins.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-600 uppercase tracking-widest text-sm">
              Nenhuma skin cadastrada
            </p>
          </div>
        )}
      </div>
    </div>
  )
}