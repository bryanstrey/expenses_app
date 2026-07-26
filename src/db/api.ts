import { supabase } from '../lib/supabase'
import { Expense, Trip } from '../types'

// ─── Trips ──

type TripRow = {
  id: string
  name: string
  destination: string
  start_date: string
  end_date: string
  emoji: string
  gradient_from: string
  gradient_to: string
}

function rowToTrip(row: TripRow): Trip {
  return {
    id: row.id,
    name: row.name,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    emoji: row.emoji,
    gradientFrom: row.gradient_from,
    gradientTo: row.gradient_to,
  }
}

/** Busca todas as viagens do usuário logado (a RLS do Supabase já garante isso). */
export async function getAllTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as TripRow[]).map(rowToTrip)
}

/** Cria uma nova viagem vinculada ao usuário logado. */
export async function insertTrip(trip: Trip): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw userError ?? new Error('Usuário não autenticado')

  const { error } = await supabase.from('trips').insert({
    id: trip.id,
    user_id: userData.user.id,
    name: trip.name,
    destination: trip.destination,
    start_date: trip.startDate,
    end_date: trip.endDate,
    emoji: trip.emoji,
    gradient_from: trip.gradientFrom,
    gradient_to: trip.gradientTo,
  })

  if (error) throw error
}

/** Remove uma viagem (os gastos vinculados somem junto, por causa do "on delete cascade"). */
export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from('trips').delete().eq('id', id)
  if (error) throw error
}

// ─── Expenses ───────────────────────────────────────────────────────────────

type ExpenseRow = {
  id: string
  trip_id: string
  name: string
  category: string
  custom_category: string | null
  amount: number
  date: string
}

function rowToExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    tripId: row.trip_id,
    name: row.name,
    category: row.category as Expense['category'],
    customCategory: row.custom_category ?? undefined,
    amount: row.amount,
    date: row.date,
  }
}

/** Busca todos os gastos de todas as viagens do usuário logado. */
export async function getAllExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return (data as ExpenseRow[]).map(rowToExpense)
}

/** Insere um novo gasto vinculado a uma viagem. */
export async function insertExpense(expense: Expense): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw userError ?? new Error('Usuário não autenticado')

  const { error } = await supabase.from('expenses').insert({
    id: expense.id,
    user_id: userData.user.id,
    trip_id: expense.tripId,
    name: expense.name,
    category: expense.category,
    custom_category: expense.customCategory ?? null,
    amount: expense.amount,
    date: expense.date,
  })

  if (error) throw error
}

/** Atualiza um gasto existente. */
export async function updateExpense(expense: Expense): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .update({
      name: expense.name,
      category: expense.category,
      custom_category: expense.customCategory ?? null,
      amount: expense.amount,
      date: expense.date,
    })
    .eq('id', expense.id)

  if (error) throw error
}

/** Remove um gasto pelo id. */
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}