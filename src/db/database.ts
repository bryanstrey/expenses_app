import * as SQLite from 'expo-sqlite'
import { Expense } from '../types'

// Abre (ou cria, se não existir) o banco SQLite dentro do armazenamento
// do próprio app no celular. Isso é o equivalente ao que o Room faz
// no mundo Android nativo: um arquivo .db local, persistente entre
// aberturas do app, sem precisar de internet.
const db = SQLite.openDatabaseSync('travel_expenses.db')

/**
 * Cria a tabela de gastos caso ainda não exista.
 * Chame isso uma vez, ao iniciar o app (veja App.tsx).
 */
export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      customCategory TEXT,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    );
  `)
}

type ExpenseRow = {
  id: string
  name: string
  category: string
  customCategory: string | null
  amount: number
  date: string
}

function rowToExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Expense['category'],
    customCategory: row.customCategory ?? undefined,
    amount: row.amount,
    date: row.date,
  }
}

/** Retorna todos os gastos salvos, mais recentes primeiro. */
export function getAllExpenses(): Expense[] {
  const rows = db.getAllSync<ExpenseRow>('SELECT * FROM expenses ORDER BY date DESC, id DESC')
  return rows.map(rowToExpense)
}

/** Insere um novo gasto no banco local. */
export function insertExpense(expense: Expense): void {
  db.runSync(
    `INSERT INTO expenses (id, name, category, customCategory, amount, date)
     VALUES (?, ?, ?, ?, ?, ?);`,
    expense.id,
    expense.name,
    expense.category,
    expense.customCategory ?? null,
    expense.amount,
    expense.date
  )
}

/** Remove um gasto pelo id. */
export function deleteExpense(id: string): void {
  db.runSync('DELETE FROM expenses WHERE id = ?;', id)
}

/** Apaga todos os gastos (útil para "limpar dados" nas configurações). */
export function clearAllExpenses(): void {
  db.execSync('DELETE FROM expenses;')
}
