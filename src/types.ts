export type Category =
  | 'Voo'
  | 'Hospedagem'
  | 'Alimentação'
  | 'Transporte'
  | 'Atividades'
  | 'Compras'
  | 'Saúde'
  | 'Outro'

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string // AAAA-MM-DD
  endDate: string // AAAA-MM-DD
  emoji: string
  gradientFrom: string
  gradientTo: string
}

export interface Expense {
  id: string
  tripId: string
  name: string
  category: Category
  customCategory?: string
  amount: number
  date: string // AAAA-MM-DD
}
