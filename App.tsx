import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native'
import { Expense } from './src/types'
import { COLORS } from './src/constants'
import { initDatabase, getAllExpenses, insertExpense, updateExpense, deleteExpense } from './src/db/database'
import { DashboardScreen } from './src/screens/DashboardScreen'
import { ExpenseFormScreen } from './src/screens/ExpenseFormScreen'

export default function App() {
  const [screen, setScreen] = useState<'dashboard' | 'form'>('dashboard')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  // null = formulário em modo "adicionar"; com valor = modo "editar"
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  useEffect(() => {
    initDatabase()
    setExpenses(getAllExpenses())
    setLoading(false)
  }, [])

  const openAddForm = () => {
    setEditingExpense(null)
    setScreen('form')
  }

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense)
    setScreen('form')
  }

  const handleSave = (expense: Expense) => {
    if (editingExpense) {
      updateExpense(expense)
    } else {
      insertExpense(expense)
    }
    setExpenses(getAllExpenses())
  }

  const handleDelete = (id: string) => {
    deleteExpense(id)
    setExpenses(getAllExpenses())
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.tealMain} size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {screen === 'dashboard' ? (
        <DashboardScreen
          expenses={expenses}
          onAddExpense={openAddForm}
          onEditExpense={openEditForm}
          onDeleteExpense={handleDelete}
        />
      ) : (
        <ExpenseFormScreen
          initialExpense={editingExpense ?? undefined}
          onSave={handleSave}
          onBack={() => setScreen('dashboard')}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.screenBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.screenBg },
})