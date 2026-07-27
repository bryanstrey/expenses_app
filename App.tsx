import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import type { Session } from '@supabase/supabase-js'
import { Expense, Trip } from './src/types'
import { COLORS } from './src/constants'
import { supabase } from './src/lib/supabase'
import {
  getAllTrips,
  insertTrip,
  getAllExpenses,
  insertExpense,
  updateExpense,
  deleteExpense,
} from './src/db/api'
import { AuthScreen } from './src/screens/AuthScreen'
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
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [screen, setScreen] = useState<Screen>({ type: 'trips' })
  const [trips, setTrips] = useState<Trip[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Observa o estado de login (fica de olho em login/logout/expiração de sessão)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setScreen({ type: 'trips' })
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Carrega os dados da nuvem assim que o usuário loga
  useEffect(() => {
    if (!session) return
    setDataLoading(true)
    refresh().finally(() => setDataLoading(false))
  }, [session])

  const refresh = async () => {
    const [tripsData, expensesData] = await Promise.all([getAllTrips(), getAllExpenses()])
    setTrips(tripsData)
    setExpenses(expensesData)
  }

  const handleAddTrip = async (trip: Trip) => {
    await insertTrip(trip)
    await refresh()
  }

  const handleSaveExpense = async (expense: Expense, isEditing: boolean) => {
    if (isEditing) {
      await updateExpense(expense)
    } else {
      await insertExpense(expense)
    }
    await refresh()
  }

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id)
    await refresh()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.tealMain} size="large" />
      </View>
    )
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <AuthScreen />
      </SafeAreaView>
    )
  }

  if (dataLoading) {
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

  const tripExpenses = activeTrip ? expenses.filter(e => e.tripId === activeTrip.id) : []

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {screen.type === 'trips' && (
        <TripsScreen
          trips={trips}
          expenses={expenses}
          onSelectTrip={id => setScreen({ type: 'dashboard', tripId: id })}
          onAddTrip={() => setScreen({ type: 'add-trip' })}
          onLogout={handleLogout}
        />
      )}

      {screen.type === 'add-trip' && (
        <AddTripScreen
          onSave={handleAddTrip}
          onSaved={tripId => setScreen({ type: 'dashboard', tripId })}
          onBack={() => setScreen({ type: 'trips' })}
        />
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
          onSave={expense => handleSaveExpense(expense, !!screen.expense)}
          onBack={() => setScreen({ type: 'dashboard', tripId: activeTrip.id })}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.screenBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.screenBg },
})