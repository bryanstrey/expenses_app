import { Category } from './types'

export const CATEGORIES: Category[] = [
  'Voo', 'Hospedagem', 'Alimentação', 'Transporte',
  'Atividades', 'Compras', 'Saúde', 'Outro',
]

export const CATEGORY_META: Record<
  Category,
  { icon: string; color: string; bg: string; light: string }
> = {
  'Voo':          { icon: '✈️', color: '#3B6B9A', bg: '#3B6B9A', light: '#E8F0F8' },
  'Hospedagem':   { icon: '🏨', color: '#7A5B9A', bg: '#7A5B9A', light: '#F0EAF8' },
  'Alimentação':  { icon: '🍽️', color: '#C45E38', bg: '#C45E38', light: '#FBF0EC' },
  'Transporte':   { icon: '🚌', color: '#3A7A5A', bg: '#3A7A5A', light: '#E8F6EF' },
  'Atividades':   { icon: '🎭', color: '#8A6A2A', bg: '#8A6A2A', light: '#F8F3E8' },
  'Compras':      { icon: '🛍️', color: '#9A4A6A', bg: '#9A4A6A', light: '#F8EAEF' },
  'Saúde':        { icon: '💊', color: '#2A7A8A', bg: '#2A7A8A', light: '#E8F6F8' },
  'Outro':        { icon: '📌', color: '#6B6560', bg: '#6B6560', light: '#F0EEEC' },
}

export const TRIP_GRADIENTS: Array<[string, string]> = [
  ['#1B4B4A', '#0F2E2D'],
  ['#2D3A6B', '#1A2240'],
  ['#6B2D3A', '#401A22'],
  ['#2D5A3A', '#1A3822'],
  ['#5A3A1A', '#382208'],
  ['#4A2D6B', '#2A1A40'],
  ['#1A4A6B', '#0D2840'],
  ['#6B4A1A', '#402A08'],
]

export const TRIP_EMOJIS = ['✈️', '🌍', '🏖️', '🗼', '🏔️', '🌺', '🎌', '🗺️', '🛳️', '🌴']

export const COLORS = {
  bg: '#F0ECE7',
  screenBg: '#FAF7F2',
  cardBg: '#FFFFFF',
  border: '#E0DAD4',
  textPrimary: '#1A1512',
  textSecondary: '#6B6560',
  textMuted: '#8B8580',
  error: '#C45E38',
  tealDark: '#0F2E2D',
  tealMain: '#1B4B4A',
  fabFrom: '#D4714A',
  fabTo: '#B85A38',
}
