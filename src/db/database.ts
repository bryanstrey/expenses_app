import * as SQLite from 'expo-sqlite'
import { Expense, Trip } from '../types'

// Abre (ou cria, se não existir) o banco SQLite dentro do armazenamento
// do próprio app no celular — persistente entre aberturas, 100% offline.
const db = SQLite.openDatabaseSync('travel_expenses.db')

/**
 * Cria as tabelas caso não existam, e migra bancos antigos
 * (de antes de existir o conceito de "viagem") sem perder dados:
 * qualquer gasto órfão vira parte de uma viagem "Minha Viagem" criada
 * automaticamente.
 */
export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      destination TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      emoji TEXT NOT NULL,
      gradientFrom TEXT NOT NULL,
      gradientTo TEXT NOT NULL
    );
  `)

  db.execSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      tripId TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      customCategory TEXT,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    );
  `)

  // Migração: se a tabela "expenses" já existia (versão anterior do app,
  // sem viagens) ela não vai ter a coluna tripId. Detectamos isso e
  // adicionamos a coluna + criamos uma viagem padrão pros dados antigos.
  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(expenses);`)
  const hasTripId = columns.some(c => c.name === 'tripId')

  if (!hasTripId) {
    db.execSync(`ALTER TABLE expenses ADD COLUMN tripId TEXT;`)

    const orphanCount = db.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM expenses WHERE tripId IS NULL;`
    )

    if (orphanCount && orphanCount.count > 0) {
      const defaultTripId = 'default-trip'
      db.runSync(
        `INSERT OR IGNORE INTO trips (id, name, destination, startDate, endDate, emoji, gradientFrom, gradientTo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        defaultTripId,
        'Minha Viagem',
        'Destino não informado',
        new Date().toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
        '✈️',
        '#1B4B4A',
        '#0F2E2D'
      )
      db.runSync(`UPDATE expenses SET tripId = ? WHERE tripId IS NULL;`, defaultTripId)
    }
  }
}

// ─── Trips ──────────────────────────────────────────────────────────────────

type TripRow = {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  emoji: string
  gradientFrom: string
  gradientTo: string
}

function rowToTrip(row: TripRow): Trip {
  return { ...row }
}

/** Retorna todas as viagens, mais recentes primeiro. */
export function getAllTrips(): Trip[] {
  const rows = db.getAllSync<TripRow>('SELECT * FROM trips ORDER BY rowid DESC')
  return rows.map(rowToTrip)
}

/** Cria uma nova viagem. */
export function insertTrip(trip: Trip): void {
  db.runSync(
    `INSERT INTO trips (id, name, destination, startDate, endDate, emoji, gradientFrom, gradientTo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    trip.id,
    trip.name,
    trip.destination,
    trip.startDate,
    trip.endDate,
    trip.emoji,
    trip.gradientFrom,
    trip.gradientTo
  )
}

/** Remove uma viagem e todos os gastos vinculados a ela. */
export function deleteTrip(id: string): void {
  db.runSync('DELETE FROM expenses WHERE tripId = ?;', id)
  db.runSync('DELETE FROM trips WHERE id = ?;', id)
}

// ─── Expenses ───────────────────────────────────────────────────────────────

type ExpenseRow = {
  id: string
  tripId: string
  name: string
  category: string
  customCategory: string | null
  amount: number
  date: string
}

function rowToExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    tripId: row.tripId,
    name: row.name,
    category: row.category as Expense['category'],
    customCategory: row.customCategory ?? undefined,
    amount: row.amount,
    date: row.date,
  }
}

/** Retorna todos os gastos de todas as viagens (usado para o total geral). */
export function getAllExpenses(): Expense[] {
  const rows = db.getAllSync<ExpenseRow>('SELECT * FROM expenses ORDER BY date DESC, id DESC')
  return rows.map(rowToExpense)
}

/** Retorna apenas os gastos de uma viagem específica. */
export function getExpensesByTrip(tripId: string): Expense[] {
  const rows = db.getAllSync<ExpenseRow>(
    'SELECT * FROM expenses WHERE tripId = ? ORDER BY date DESC, id DESC',
    tripId
  )
  return rows.map(rowToExpense)
}

/** Insere um novo gasto vinculado a uma viagem. */
export function insertExpense(expense: Expense): void {
  db.runSync(
    `INSERT INTO expenses (id, tripId, name, category, customCategory, amount, date)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    expense.id,
    expense.tripId,
    expense.name,
    expense.category,
    expense.customCategory ?? null,
    expense.amount,
    expense.date
  )
}

/** Atualiza um gasto existente. */
export function updateExpense(expense: Expense): void {
  db.runSync(
    `UPDATE expenses
     SET name = ?, category = ?, customCategory = ?, amount = ?, date = ?
     WHERE id = ?;`,
    expense.name,
    expense.category,
    expense.customCategory ?? null,
    expense.amount,
    expense.date,
    expense.id
  )
}

/** Remove um gasto pelo id. */
export function deleteExpense(id: string): void {
  db.runSync('DELETE FROM expenses WHERE id = ?;', id)
}