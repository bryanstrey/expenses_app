import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Expense, Trip } from './src/types'
import { COLORS } from './src/constants'
import {
  initDatabase,
  getAllTrips,
  insertTrip,
  getAllExpenses,
  insertExpense,
  updateExpense,
  deleteExpense,
} from './src/db/database'
import { TripsScreen } from './src/screens/TripsScreen'
import { AddTripScreen } from './src/screens/AddTripScreen'
import { DashboardScreen } from './src/screens/DashboardScreen'
import { ExpenseFormScreen } from './src/screens/ExpenseFormScreen'

type Screen =
  | { type: 'trips' }
  | { type: 'add-trip' }
  | { type: 'dashboard'; tripId: string }
  | { type: 'expense-form'; tripId: string; expense?: Expense }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'trips' })
  const [trips, setTrips] = useState<Trip[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initDatabase()
    setTrips(getAllTrips())
    setExpenses(getAllExpenses())
    setLoading(false)
  }, [])

  const refresh = () => {
    setTrips(getAllTrips())
    setExpenses(getAllExpenses())
  }

  const handleAddTrip = (trip: Trip) => {
    insertTrip(trip)
    refresh()
    setScreen({ type: 'dashboard', tripId: trip.id })
  }

  const handleSaveExpense = (expense: Expense, isEditing: boolean) => {
    if (isEditing) {
      updateExpense(expense)
    } else {
      insertExpense(expense)
    }
    refresh()
  }

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id)
    refresh()
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.tealMain} size="large" />
      </View>
    )
  }

  const activeTrip =
    screen.type === 'dashboard' || screen.type === 'expense-form'
      ? trips.find(t => t.id === screen.tripId) ?? null
      : null

  const tripExpenses = activeTrip ? getExpensesByTripFromState(expenses, activeTrip.id) : []

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {screen.type === 'trips' && (
        <TripsScreen
          trips={trips}
          expenses={expenses}
          onSelectTrip={id => setScreen({ type: 'dashboard', tripId: id })}
          onAddTrip={() => setScreen({ type: 'add-trip' })}
        />
      )}

      {screen.type === 'add-trip' && (
        <AddTripScreen onSave={handleAddTrip} onBack={() => setScreen({ type: 'trips' })} />
      )}

      {screen.type === 'dashboard' && activeTrip && (
        <DashboardScreen
          trip={activeTrip}
          expenses={tripExpenses}
          onAddExpense={() => setScreen({ type: 'expense-form', tripId: activeTrip.id })}
          onEditExpense={expense => setScreen({ type: 'expense-form', tripId: activeTrip.id, expense })}
          onDeleteExpense={handleDeleteExpense}
          onBack={() => setScreen({ type: 'trips' })}
        />
      )}

      {screen.type === 'expense-form' && activeTrip && (
        <ExpenseFormScreen
          tripId={activeTrip.id}
          initialExpense={screen.expense}
          onSave={expense => {
            handleSaveExpense(expense, !!screen.expense)
            setScreen({ type: 'dashboard', tripId: activeTrip.id })
          }}
          onBack={() => setScreen({ type: 'dashboard', tripId: activeTrip.id })}
        />
      )}
    </SafeAreaView>
  )
}

// Filtra os gastos da viagem ativa a partir do estado em memória
// (evita ir ao banco de novo só pra filtrar por tripId).
function getExpensesByTripFromState(expenses: Expense[], tripId: string): Expense[] {
  return expenses.filter(e => e.tripId === tripId)
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.screenBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.screenBg },
})
