import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteButtonProps {
  skinId: number
  size?: 'sm' | 'lg'
}

export default function FavoriteButton({ skinId, size = 'sm' }: FavoriteButtonProps) {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { isFavorito, toggleFavorito } = useFavorites()

  const favorito = isFavorito(skinId)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!token) {
      navigate('/login')
      return
    }
    toggleFavorito(skinId)
  }

  if (size === 'lg') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold
                   uppercase tracking-widest text-sm transition-all duration-200
                   ${favorito
                     ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                     : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-orange-500'
                   }`}
      >
        <span className="text-lg">{favorito ? '♥' : '♡'}</span>
        {favorito ? 'Favoritado' : 'Favoritar'}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`text-lg transition-all duration-200 hover:scale-110
                 ${favorito ? 'text-orange-500' : 'text-zinc-600 hover:text-orange-500'}`}
      title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      {favorito ? '♥' : '♡'}
    </button>
  )
}