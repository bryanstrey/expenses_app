export type Category =
  | 'Voo'
  | 'Hospedagem'
  | 'Alimentação'
  | 'Transporte'
  | 'Atividades'
  | 'Compras'
  | 'Saúde'
  | 'Outro'

export interface Expense {
  id: string
  name: string
  category: Category
  customCategory?: string
  amount: number
  date: string // formato ISO: AAAA-MM-DD
}
