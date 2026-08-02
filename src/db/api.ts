import { supabase } from '../lib/supabase'
import { City, Expense, Trip, TouristSpot } from '../types'

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw error ?? new Error('Usuário não autenticado')
  return data.user.id
}

// ─── Trips ──────────────────────────────────────────────────────────────────

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
  const userId = await currentUserId()

  const { error } = await supabase.from('trips').insert({
    id: trip.id,
    user_id: userId,
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

/** Remove uma viagem (cidades, gastos e pontos vinculados somem junto, por causa do "on delete cascade"). */
export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from('trips').delete().eq('id', id)
  if (error) throw error
}

// ─── Cities ─────────────────────────────────────────────────────────────────

type CityRow = {
  id: string
  trip_id: string
  name: string
}

function rowToCity(row: CityRow): City {
  return { id: row.id, tripId: row.trip_id, name: row.name }
}

/** Busca todas as cidades de todas as viagens do usuário logado. */
export async function getAllCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data as CityRow[]).map(rowToCity)
}

/** Cria uma nova cidade vinculada a uma viagem. */
export async function insertCity(city: City): Promise<void> {
  const userId = await currentUserId()

  const { error } = await supabase.from('cities').insert({
    id: city.id,
    user_id: userId,
    trip_id: city.tripId,
    name: city.name,
  })

  if (error) throw error
}

/** Atualiza o nome de uma cidade. */
export async function updateCity(city: City): Promise<void> {
  const { error } = await supabase.from('cities').update({ name: city.name }).eq('id', city.id)
  if (error) throw error
}

/** Remove uma cidade (gastos e pontos turísticos vinculados somem junto). */
export async function deleteCity(id: string): Promise<void> {
  const { error } = await supabase.from('cities').delete().eq('id', id)
  if (error) throw error
}

// ─── Expenses ───────────────────────────────────────────────────────────────

type ExpenseRow = {
  id: string
  trip_id: string
  city_id: string | null
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
    cityId: row.city_id ?? '',
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

/** Insere um novo gasto vinculado a uma viagem e uma cidade. */
export async function insertExpense(expense: Expense): Promise<void> {
  const userId = await currentUserId()

  const { error } = await supabase.from('expenses').insert({
    id: expense.id,
    user_id: userId,
    trip_id: expense.tripId,
    city_id: expense.cityId,
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

// ─── Tourist spots ──────────────────────────────────────────────────────────

type SpotRow = {
  id: string
  trip_id: string
  city_id: string
  name: string
  description: string
  visited: boolean
}

function rowToSpot(row: SpotRow): TouristSpot {
  return {
    id: row.id,
    tripId: row.trip_id,
    cityId: row.city_id,
    name: row.name,
    description: row.description,
    visited: row.visited,
  }
}

/** Busca todos os pontos turísticos de todas as viagens do usuário logado. */
export async function getAllSpots(): Promise<TouristSpot[]> {
  const { data, error } = await supabase
    .from('tourist_spots')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data as SpotRow[]).map(rowToSpot)
}

/** Cria um novo ponto turístico vinculado a uma cidade. */
export async function insertSpot(spot: TouristSpot): Promise<void> {
  const userId = await currentUserId()

  const { error } = await supabase.from('tourist_spots').insert({
    id: spot.id,
    user_id: userId,
    trip_id: spot.tripId,
    city_id: spot.cityId,
    name: spot.name,
    description: spot.description,
    visited: spot.visited,
  })

  if (error) throw error
}

/** Atualiza um ponto turístico existente. */
export async function updateSpot(spot: TouristSpot): Promise<void> {
  const { error } = await supabase
    .from('tourist_spots')
    .update({
      name: spot.name,
      description: spot.description,
      visited: spot.visited,
    })
    .eq('id', spot.id)

  if (error) throw error
}

/** Remove um ponto turístico pelo id. */
export async function deleteSpot(id: string): Promise<void> {
  const { error } = await supabase.from('tourist_spots').delete().eq('id', id)
  if (error) throw error
}
