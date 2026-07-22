import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native'
import { Expense } from './src/types'
import { COLORS } from './src/constants'
import { initDatabase, getAllExpenses, insertExpense } from './src/db/database'
import { DashboardScreen } from './src/screens/DashboardScreen'
import { AddExpenseScreen } from './src/screens/AddExpenseScreen'

export default function App() {
  const [screen, setScreen] = useState<'dashboard' | 'add'>('dashboard')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  // Ao abrir o app: garante que a tabela existe e carrega os
  // gastos já salvos no dispositivo (persistem entre sessões).
  useEffect(() => {
    initDatabase()
    setExpenses(getAllExpenses())
    setLoading(false)
  }, [])

  const addExpense = (e: Expense) => {
    insertExpense(e) // grava no SQLite local
    setExpenses(getAllExpenses()) // relê do banco para manter a UI em sincronia
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
        <DashboardScreen expenses={expenses} onAddExpense={() => setScreen('add')} />
      ) : (
        <AddExpenseScreen onAdd={addExpense} onBack={() => setScreen('dashboard')} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.screenBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.screenBg },
})
