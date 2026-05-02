import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { Skin } from '../types'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const { data: favoritos = [] } = useQuery<Skin[]>({
    queryKey: ['favoritos'],
    queryFn: async () => {
      const { data } = await api.get('/api/user/favoritos')
      return data
    },
    enabled: !!token,
  })

  const adicionarMutation = useMutation({
    mutationFn: (skinId: number) =>
      api.post(`/api/user/favoritos/${skinId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['favoritos'] }),
  })

  const removerMutation = useMutation({
    mutationFn: (skinId: number) =>
      api.delete(`/api/user/favoritos/${skinId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['favoritos'] }),
  })

  const isFavorito = (skinId: number) =>
    favoritos.some((f) => f.id === skinId)

  const toggleFavorito = (skinId: number) => {
    if (isFavorito(skinId)) {
      removerMutation.mutate(skinId)
    } else {
      adicionarMutation.mutate(skinId)
    }
  }

  return { favoritos, isFavorito, toggleFavorito }
}