import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import type { Skin } from '../../types'

const raridades = ['CONSUMER', 'INDUSTRIAL', 'MIL_SPEC', 'RESTRICTED', 'CLASSIFIED', 'COVERT', 'CONTRABAND']
const desgastes = ['FACTORY_NEW', 'MINIMAL_WEAR', 'FIELD_TESTED', 'WELL_WORN', 'BATTLE_SCARRED']
const categorias = ['RIFLE', 'PISTOLA', 'FACA', 'SMG', 'SHOTGUN', 'SNIPER', 'ACESSORIO', 'AGENTE']

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

export default function CatalogPage() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [raridade, setRaridade] = useState('')
  const [desgaste, setDesgaste] = useState('')
  const [categoria, setCategoria] = useState('')
  const [statTrak, setStatTrak] = useState(false)

  const { data: skins = [], isLoading } = useQuery<Skin[]>({
    queryKey: ['skins-publico', busca, raridade, desgaste, categoria, statTrak],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (busca) params.append('nome', busca)
      if (raridade) params.append('raridade', raridade)
      if (desgaste) params.append('desgaste', desgaste)
      if (categoria) params.append('categoria', categoria)
      if (statTrak) params.append('statTrak', 'true')
      const { data } = await api.get(`/api/skins/filtrar?${params.toString()}`)
      return data
    },
  })

  const limparFiltros = () => {
    setBusca('')
    setRaridade('')
    setDesgaste('')
    setCategoria('')
    setStatTrak(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-widest mb-2">
          <span className="text-orange-500">Vitrine</span> de Skins
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-sm">
          Interesse? Entre em contato via WhatsApp
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5
                       text-white placeholder-zinc-600 focus:outline-none
                       focus:border-orange-500 transition-colors text-sm"
          />
          <select
            value={raridade}
            onChange={(e) => setRaridade(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5
                       text-white focus:outline-none focus:border-orange-500 
                       transition-colors text-sm"
          >
            <option value="">Todas raridades</option>
            {raridades.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={desgaste}
            onChange={(e) => setDesgaste(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5
                       text-white focus:outline-none focus:border-orange-500 
                       transition-colors text-sm"
          >
            <option value="">Todos desgastes</option>
            {desgastes.map((d) => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
          </select>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5
                       text-white focus:outline-none focus:border-orange-500 
                       transition-colors text-sm"
          >
            <option value="">Todas categorias</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={statTrak}
              onChange={(e) => setStatTrak(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm text-orange-400 font-medium">StatTrak™</span>
          </label>
          <button
            onClick={limparFiltros}
            className="text-xs uppercase tracking-widest text-zinc-500 
                       hover:text-white transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-500 uppercase tracking-widest text-sm animate-pulse">
            Carregando skins...
          </p>
        </div>
      ) : skins.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-600 uppercase tracking-widest text-sm">
            Nenhuma skin encontrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skins.map((skin) => (
            <div
              key={skin.id}
              onClick={() => navigate(`/skins/${skin.id}`)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden
                         cursor-pointer hover:border-orange-500/50 hover:scale-[1.02]
                         transition-all duration-200 group"
            >
              <div className="h-44 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                {skin.imagemUrl ? (
                  <img
                    src={skin.imagemUrl}
                    alt={`${skin.arma} | ${skin.nome}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <p className="text-zinc-600 text-xs uppercase tracking-widest">
                    Sem imagem
                  </p>
                )}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
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
                  <span className="text-xs uppercase tracking-widest text-zinc-600">
                    {skin.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}