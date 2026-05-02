import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import type { Skin } from '../../types'

const raridadeCor: Record<string, string> = {
  CONSUMER: 'bg-zinc-500',
  INDUSTRIAL: 'bg-blue-700',
  MIL_SPEC: 'bg-blue-500',
  RESTRICTED: 'bg-purple-600',
  CLASSIFIED: 'bg-pink-600',
  COVERT: 'bg-red-600',
  CONTRABAND: 'bg-orange-400',
}

const desgasteLabel: Record<string, string> = {
  FACTORY_NEW: 'FN',
  MINIMAL_WEAR: 'MW',
  FIELD_TESTED: 'FT',
  WELL_WORN: 'WW',
  BATTLE_SCARRED: 'BS',
}

export default function FavoritesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: favoritos = [], isLoading } = useQuery<Skin[]>({
    queryKey: ['favoritos'],
    queryFn: async () => {
      const { data } = await api.get('/api/user/favoritos')
      return data
    },
  })

  const removerMutation = useMutation({
    mutationFn: (skinId: number) =>
      api.delete(`/api/user/favoritos/${skinId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['favoritos'] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-500 uppercase tracking-widest text-sm animate-pulse">
          Carregando favoritos...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-widest mb-2">
          Meus <span className="text-orange-500">Favoritos</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-sm">
          {favoritos.length} skin{favoritos.length !== 1 ? 's' : ''} salva{favoritos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoritos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-zinc-600 uppercase tracking-widest text-sm">
            Nenhuma skin favoritada ainda
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-sm uppercase tracking-widest bg-orange-500
                       hover:bg-orange-600 text-black font-bold px-5 py-2.5
                       rounded-lg transition-colors"
          >
            Ver vitrine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritos.map((skin) => (
            <div
              key={skin.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden
                         hover:border-orange-500/50 transition-all duration-200 group"
            >
              <div
                className="h-44 bg-zinc-800 flex items-center justify-center 
                            relative overflow-hidden cursor-pointer"
                onClick={() => navigate(`/skins/${skin.id}`)}
              >
                {skin.imagemUrl ? (
                  <img
                    src={skin.imagemUrl}
                    alt={`${skin.arma} | ${skin.nome}`}
                    className="w-full h-full object-cover group-hover:scale-105 
                               transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <p className="text-zinc-600 text-xs uppercase tracking-widest">
                    Sem imagem
                  </p>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`text-xs text-white px-2 py-0.5 rounded uppercase
                                   tracking-widest font-medium ${raridadeCor[skin.raridade]}`}>
                    {skin.raridade}
                  </span>
                </div>
                {skin.statTrak && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs text-orange-400 bg-zinc-900/90
                                     border border-orange-500/30 px-1.5 py-0.5 rounded">
                      ST™
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                  {skin.arma}
                </p>
                <p className="font-bold text-white mb-1 truncate">{skin.nome}</p>
                <p className="text-xs text-zinc-500 mb-3">
                  {skin.desgaste.replace(/_/g, ' ')} · {desgasteLabel[skin.desgaste]}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-black text-orange-500 text-lg">
                    {Number(skin.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                  <button
                    onClick={() => removerMutation.mutate(skin.id)}
                    className="text-xs uppercase tracking-widest text-zinc-500
                               hover:text-red-400 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}