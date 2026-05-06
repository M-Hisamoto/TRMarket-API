import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../lib/api'
import type { Skin, SkinFormData } from '../../types'

const categorias = ['RIFLE', 'PISTOLA', 'FACA', 'SMG', 'SHOTGUN', 'SNIPER', 'ACESSORIO', 'AGENTE']
const times = ['CT', 'TR', 'AMBOS']
const raridades = ['CONSUMER', 'INDUSTRIAL', 'MIL_SPEC', 'RESTRICTED', 'CLASSIFIED', 'COVERT', 'CONTRABAND']
const desgastes = ['FACTORY_NEW', 'MINIMAL_WEAR', 'FIELD_TESTED', 'WELL_WORN', 'BATTLE_SCARRED']
const statusOpcoes = ['DISPONIVEL', 'RESERVADA', 'VENDIDA']

const inicial: SkinFormData = {
  arma: '',
  nome: '',
  categoria: 'RIFLE',
  time: 'AMBOS',
  raridade: 'MIL_SPEC',
  desgaste: 'FIELD_TESTED',
  statTrak: false,
  souvenir: false,
  preco: 0,
  status: 'DISPONIVEL',
  imagemUrl: '',
  descricao: '',
}

export default function AdminSkinForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState<SkinFormData>(inicial)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (isEditing) {
      api.get<Skin>(`/api/skins/${id}`).then(({ data }) => {
        setForm({
          arma: data.arma,
          nome: data.nome,
          categoria: data.categoria,
          time: data.time,
          raridade: data.raridade,
          desgaste: data.desgaste,
          statTrak: data.statTrak,
          souvenir: data.souvenir,
          preco: data.preco,
          status: data.status,
          imagemUrl: data.imagemUrl || '',
          descricao: data.descricao || '',
        })
      })
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      if (isEditing) {
        await api.put(`/api/admin/skins/${id}`, form)
      } else {
        await api.post('/api/admin/skins', form)
      }
      navigate('/admin/skins')
    } catch {
      setErro('Erro ao salvar skin. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
        {label}
      </label>
      {children}
    </div>
  )

  const inputClass = `w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5
                      text-white focus:outline-none focus:border-orange-500 transition-colors`

  const formatarPrecoDisplay = (centavos: number): string => {
    return (centavos / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '')
    const centavos = parseInt(apenasNumeros || '0', 10)
    setForm({ ...form, preco: centavos / 100 })
  }

  const precoEmCentavos = Math.round(form.preco * 100)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/skins')}
          className="text-zinc-500 hover:text-white transition-colors text-sm uppercase tracking-widest"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          {isEditing ? 'Editar skin' : 'Nova skin'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field('Arma',
              <input className={inputClass} value={form.arma}
                onChange={(e) => setForm({ ...form, arma: e.target.value })}
                placeholder="Ex: AK-47" required />
            )}
            {field('Nome da skin',
              <input className={inputClass} value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Asiimov" required />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {field('Categoria',
              <select className={inputClass} value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {categorias.map((c) => <option key={c}>{c}</option>)}
              </select>
            )}
            {field('Time',
              <select className={inputClass} value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}>
                {times.map((t) => <option key={t}>{t}</option>)}
              </select>
            )}
            {field('Status',
              <select className={inputClass} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {statusOpcoes.map((s) => <option key={s}>{s}</option>)}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field('Raridade',
              <select className={inputClass} value={form.raridade}
                onChange={(e) => setForm({ ...form, raridade: e.target.value })}>
                {raridades.map((r) => <option key={r}>{r}</option>)}
              </select>
            )}
            {field('Desgaste',
              <select className={inputClass} value={form.desgaste}
                onChange={(e) => setForm({ ...form, desgaste: e.target.value })}>
                {desgastes.map((d) => <option key={d}>{d}</option>)}
              </select>
            )}
          </div>

          {field('Preço',
            <div className="relative">
              <input
                className={inputClass}
                type="text"
                inputMode="numeric"
                value={precoEmCentavos === 0 ? '' : precoEmCentavos.toString()}
                onChange={handlePrecoChange}
                placeholder="Ex: 280000 = R$ 2.800,00"
                required
              />
              {precoEmCentavos > 0 && (
                <div className="mt-2 text-orange-500 font-bold text-sm">
                  {formatarPrecoDisplay(precoEmCentavos)}
                </div>
              )}
            </div>
          )}

          {field('URL da imagem',
            <input className={inputClass} value={form.imagemUrl}
              onChange={(e) => setForm({ ...form, imagemUrl: e.target.value })}
              placeholder="https://..." />
          )}

          {field('Descrição',
            <textarea className={inputClass + ' resize-none'} rows={3}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descrição da skin..." />
          )}

          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.statTrak}
                onChange={(e) => setForm({ ...form, statTrak: e.target.checked })}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-zinc-300">StatTrak™</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.souvenir}
                onChange={(e) => setForm({ ...form, souvenir: e.target.checked })}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-zinc-300">Souvenir</span>
            </label>
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50
                         text-black font-bold px-6 py-2.5 rounded-lg uppercase 
                         tracking-widest text-sm transition-colors">
              {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar skin'}
            </button>
            <button type="button" onClick={() => navigate('/admin/skins')}
              className="text-zinc-400 hover:text-white px-6 py-2.5 rounded-lg 
                         border border-zinc-700 uppercase tracking-widest text-sm transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}