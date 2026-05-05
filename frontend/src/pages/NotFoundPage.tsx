import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-orange-500 font-black text-8xl mb-4 tracking-widest">
          404
        </p>
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-3">
          Página não encontrada
        </h1>
        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-10">
          A página que você procura não existe ou foi removida
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm uppercase tracking-widest text-zinc-400
                       hover:text-white transition-colors border border-zinc-700
                       px-5 py-2.5 rounded-lg"
          >
            ← Voltar
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-sm uppercase tracking-widest bg-orange-500
                       hover:bg-orange-600 text-black font-bold px-5 py-2.5
                       rounded-lg transition-colors"
          >
            Ir para vitrine
          </button>
        </div>
      </div>
    </div>
  )
}