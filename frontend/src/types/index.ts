export interface Skin {
  id: number
  arma: string
  nome: string
  categoria: 'RIFLE' | 'PISTOLA' | 'FACA' | 'SMG' | 'SHOTGUN' | 'SNIPER' | 'ACESSORIO' | 'AGENTE'
  time: 'CT' | 'TR' | 'AMBOS'
  raridade: 'CONSUMER' | 'INDUSTRIAL' | 'MIL_SPEC' | 'RESTRICTED' | 'CLASSIFIED' | 'COVERT' | 'CONTRABAND'
  desgaste: 'FACTORY_NEW' | 'MINIMAL_WEAR' | 'FIELD_TESTED' | 'WELL_WORN' | 'BATTLE_SCARRED'
  statTrak: boolean
  souvenir: boolean
  preco: number
  status: 'DISPONIVEL' | 'VENDIDA' | 'RESERVADA'
  imagemUrl: string
  descricao: string
  criadaEm: string
  atualizadaEm: string
}

export interface AuthResponse {
  token: string
  email: string
  role: string
}

export interface User {
  id: number
  email: string
  nome: string
  role: string
  lembretes: boolean
}

export interface SkinFormData {
  arma: string
  nome: string
  categoria: string
  time: string
  raridade: string
  desgaste: string
  statTrak: boolean
  souvenir: boolean
  preco: number
  status: string
  imagemUrl: string
  descricao: string
}