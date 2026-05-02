import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import type { Skin } from '../../types'
import FavoriteButton from '../../components/FavoriteButton.tsx'

const raridadeCor: Record<string, string> = {
  CONSUMER: 'bg-zinc-500',
  INDUSTRIAL: 'bg-blue-700',
  MIL_SPEC: 'bg-blue-500',
  RESTRICTED: 'bg-purple-600',
  CLASSIFIED: 'bg-pink-600',
  COVERT: 'bg-red-600',
  CONTRABAND: 'bg-orange-400',
}

export default function SkinDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: skin, isLoading } = useQuery<Skin>({
    queryKey: ['skin', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/skins/${id}`)
      return data
    },
  })

  const whatsappUrl = skin
    ? `https://wa.me/5511988236001?text=${encodeURIComponent(
        `Olá! Tenho interesse na skin ${skin.arma} | ${skin.nome} (${skin.desgaste.replace(/_/g, ' ')}) por ${Number(skin.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      )}`
    : '#'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-500 uppercase tracking-widest text-sm animate-pulse">
          Carregando...
        </p>
      </div>
    )
  }

  if (!skin) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">
          Skin não encontrada
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/')}
        className="text-zinc-500 hover:text-white transition-colors 
                   text-sm uppercase tracking-widest mb-8 flex items-center gap-2"
      >
        ← Voltar para vitrine
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="h-72 flex items-center justify-center bg-zinc-800">
            {skin.imagemUrl ? (
              <img
                src={skin.imagemUrl}
                alt={`${skin.arma} | ${skin.nome}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-zinc-600 text-xs uppercase tracking-widest">
                Sem imagem
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs text-white px-2 py-1 rounded uppercase 
                             tracking-widest font-medium ${raridadeCor[skin.raridade]}`}>
              {skin.raridade}
            </span>
            {skin.statTrak && (
              <span className="text-xs text-orange-400 bg-orange-500/10 
                               border border-orange-500/20 px-2 py-1 rounded">
                StatTrak™
              </span>
            )}
            {skin.souvenir && (
              <span className="text-xs text-yellow-400 bg-yellow-500/10 
                               border border-yellow-500/20 px-2 py-1 rounded">
                Souvenir
              </span>
            )}
          </div>

          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-1">
            {skin.arma}
          </p>
          <h1 className="text-3xl font-black text-white mb-6">{skin.nome}</h1>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm uppercase tracking-widest">Categoria</span>
              <span className="text-white text-sm font-medium">{skin.categoria}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm uppercase tracking-widest">Time</span>
              <span className="text-white text-sm font-medium">{skin.time}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm uppercase tracking-widest">Desgaste</span>
              <span className="text-white text-sm font-medium">
                {skin.desgaste.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Preço</p>
            <p className="text-4xl font-black text-orange-500">
              {Number(skin.preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>

          {skin.descricao && (
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              {skin.descricao}
            </p>
          )}

          <div className="flex gap-3">
            <a 
            
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 flex items-center justify-center gap-3 bg-green-600
               hover:bg-green-500 text-white font-bold py-4 rounded-xl
               uppercase tracking-widest text-sm transition-colors">
            Tenho interesse — WhatsApp

            </a>

            <FavoriteButton skinId={skin.id} size="lg" />

          </div>
        </div>
      </div>
    </div>
  )
}