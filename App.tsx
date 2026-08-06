import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, SafeAreaView, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as NavigationBar from 'expo-navigation-bar'
import type { Session } from '@supabase/supabase-js'
import { City, Expense, Trip, TouristSpot } from './src/types'
import { COLORS } from './src/constants'
import { supabase } from './src/lib/supabase'
import {
  getAllTrips,
  insertTrip,
  updateTrip,
  deleteTrip,
  getAllCities,
  insertCity,
  updateCity,
  deleteCity,
  getAllExpenses,
  insertExpense,
  updateExpense,
  deleteExpense,
  getAllSpots,
  insertSpot,
  updateSpot,
  deleteSpot,
} from './src/db/api'
import { AuthScreen } from './src/screens/AuthScreen'
import { TripsScreen } from './src/screens/TripsScreen'
import { AddTripScreen } from './src/screens/AddTripScreen'
import { TripOverviewScreen } from './src/screens/TripOverviewScreen'
import { CityFormScreen } from './src/screens/CityFormScreen'
import { CityDashboardScreen } from './src/screens/CityDashboardScreen'
import { ExpenseFormScreen } from './src/screens/ExpenseFormScreen'
import { SpotFormScreen } from './src/screens/SpotFormScreen'

type Screen =
  | { type: 'trips' }
  | { type: 'add-trip' }
  | { type: 'edit-trip'; trip: Trip }
  | { type: 'trip-overview'; tripId: string }
  | { type: 'add-city'; tripId: string }
  | { type: 'edit-city'; tripId: string; city: City }
  | { type: 'city-dashboard'; tripId: string; cityId: string; tab: 'expenses' | 'spots' }
  | { type: 'expense-form'; tripId: string; cityId: string; expense?: Expense; from?: 'city' | 'overview' }
  | { type: 'spot-form'; tripId: string; cityId: string; spot?: TouristSpot }

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [screen, setScreen] = useState<Screen>({ type: 'trips' })
  const [trips, setTrips] = useState<Trip[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [spots, setSpots] = useState<TouristSpot[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Observa o estado de login
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

  // Esconde a barra de navegação do Android (modo imersivo)
  useEffect(() => {
    if (Platform.OS !== 'android') return
    ;(async () => {
      try {
        const nav = NavigationBar as any
        if (typeof nav.setHidden === 'function') {
          nav.setHidden(true)
        } else {
          await nav.setBehaviorAsync?.('inset-swipe')
          await nav.setVisibilityAsync?.('hidden')
        }
      } catch {
        // Alguns emuladores/dispositivos não suportam — ignora silenciosamente
      }
    })()
  }, [])

  // Carrega os dados da nuvem assim que o usuário loga
  useEffect(() => {
    if (!session) return
    setDataLoading(true)
    refresh().finally(() => setDataLoading(false))
  }, [session])

  const refresh = async () => {
    const [tripsData, citiesData, expensesData, spotsData] = await Promise.all([
      getAllTrips(),
      getAllCities(),
      getAllExpenses(),
      getAllSpots(),
    ])
    setTrips(tripsData)
    setCities(citiesData)
    setExpenses(expensesData)
    setSpots(spotsData)
  }

  const handleAddTrip = async (trip: Trip) => {
    await insertTrip(trip)
    await refresh()
  }

  const handleUpdateTrip = async (trip: Trip) => {
    await updateTrip(trip)
    await refresh()
  }

  const handleDeleteTrip = async (id: string) => {
    await deleteTrip(id)
    await refresh()
  }

  const handleAddCity = async (city: City) => {
    await insertCity(city)
    await refresh()
  }

  const handleUpdateCity = async (city: City) => {
    await updateCity(city)
    await refresh()
  }

  const handleDeleteCity = async (id: string) => {
    await deleteCity(id)
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

  const handleSaveSpot = async (spot: TouristSpot, isEditing: boolean) => {
    if (isEditing) {
      await updateSpot(spot)
    } else {
      await insertSpot(spot)
    }
    await refresh()
  }

  const handleDeleteSpot = async (id: string) => {
    await deleteSpot(id)
    await refresh()
  }

  const handleToggleVisited = async (spot: TouristSpot) => {
    await updateSpot({ ...spot, visited: !spot.visited })
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

  const tripIdOfScreen = 'tripId' in screen ? screen.tripId : null
  const activeTrip = tripIdOfScreen ? trips.find(t => t.id === tripIdOfScreen) ?? null : null

  const cityIdOfScreen = 'cityId' in screen ? screen.cityId : null
  const activeCity = cityIdOfScreen ? cities.find(c => c.id === cityIdOfScreen) ?? null : null

  const tripCities = activeTrip ? cities.filter(c => c.tripId === activeTrip.id) : []
  const tripExpenses = activeTrip ? expenses.filter(e => e.tripId === activeTrip.id) : []
  const tripSpots = activeTrip ? spots.filter(s => s.tripId === activeTrip.id) : []
  const cityExpenses = activeCity ? expenses.filter(e => e.cityId === activeCity.id) : []
  const citySpots = activeCity ? spots.filter(s => s.cityId === activeCity.id) : []

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {screen.type === 'trips' && (
        <TripsScreen
          userName={session.user.user_metadata?.name as string | undefined}
          trips={trips}
          expenses={expenses}
          onSelectTrip={id => setScreen({ type: 'trip-overview', tripId: id })}
          onAddTrip={() => setScreen({ type: 'add-trip' })}
          onEditTrip={trip => setScreen({ type: 'edit-trip', trip })}
          onDeleteTrip={handleDeleteTrip}
          onLogout={handleLogout}
        />
      )}

      {screen.type === 'add-trip' && (
        <AddTripScreen
          onSave={handleAddTrip}
          onSaved={tripId => setScreen({ type: 'trip-overview', tripId })}
          onBack={() => setScreen({ type: 'trips' })}
        />
      )}

      {screen.type === 'edit-trip' && (
        <AddTripScreen
          initialTrip={screen.trip}
          onSave={handleUpdateTrip}
          onSaved={() => setScreen({ type: 'trips' })}
          onBack={() => setScreen({ type: 'trips' })}
        />
      )}

      {screen.type === 'trip-overview' && activeTrip && (
        <TripOverviewScreen
          trip={activeTrip}
          cities={tripCities}
          expenses={tripExpenses}
          spots={tripSpots}
          onSelectCity={id => setScreen({ type: 'city-dashboard', tripId: activeTrip.id, cityId: id, tab: 'expenses' })}
          onAddCity={() => setScreen({ type: 'add-city', tripId: activeTrip.id })}
          onEditCity={city => setScreen({ type: 'edit-city', tripId: activeTrip.id, city })}
          onDeleteCity={handleDeleteCity}
          onEditExpense={expense =>
            setScreen({ type: 'expense-form', tripId: activeTrip.id, cityId: expense.cityId, expense, from: 'overview' })
          }
          onDeleteExpense={handleDeleteExpense}
          onBack={() => setScreen({ type: 'trips' })}
          onLogout={handleLogout}
        />
      )}

      {screen.type === 'add-city' && activeTrip && (
        <CityFormScreen
          trip={activeTrip}
          onSave={handleAddCity}
          onBack={() => setScreen({ type: 'trip-overview', tripId: activeTrip.id })}
        />
      )}

      {screen.type === 'edit-city' && activeTrip && (
        <CityFormScreen
          trip={activeTrip}
          initialCity={screen.city}
          onSave={handleUpdateCity}
          onBack={() => setScreen({ type: 'trip-overview', tripId: activeTrip.id })}
        />
      )}

      {screen.type === 'city-dashboard' && activeTrip && activeCity && (
        <CityDashboardScreen
          trip={activeTrip}
          city={activeCity}
          expenses={cityExpenses}
          spots={citySpots}
          tab={screen.tab}
          onTabChange={tab => setScreen({ type: 'city-dashboard', tripId: activeTrip.id, cityId: activeCity.id, tab })}
          onAddExpense={() => setScreen({ type: 'expense-form', tripId: activeTrip.id, cityId: activeCity.id })}
          onEditExpense={expense => setScreen({ type: 'expense-form', tripId: activeTrip.id, cityId: activeCity.id, expense })}
          onDeleteExpense={handleDeleteExpense}
          onAddSpot={() => setScreen({ type: 'spot-form', tripId: activeTrip.id, cityId: activeCity.id })}
          onEditSpot={spot => setScreen({ type: 'spot-form', tripId: activeTrip.id, cityId: activeCity.id, spot })}
          onDeleteSpot={handleDeleteSpot}
          onToggleVisited={handleToggleVisited}
          onBack={() => setScreen({ type: 'trip-overview', tripId: activeTrip.id })}
          onHome={() => setScreen({ type: 'trips' })}
          onLogout={handleLogout}
        />
      )}

      {screen.type === 'expense-form' && activeTrip && activeCity && (
        <ExpenseFormScreen
          tripId={activeTrip.id}
          cityId={activeCity.id}
          initialExpense={screen.expense}
          onSave={expense => handleSaveExpense(expense, !!screen.expense)}
          onBack={() =>
            screen.from === 'overview'
              ? setScreen({ type: 'trip-overview', tripId: activeTrip.id })
              : setScreen({ type: 'city-dashboard', tripId: activeTrip.id, cityId: activeCity.id, tab: 'expenses' })
          }
        />
      )}

      {screen.type === 'spot-form' && activeTrip && activeCity && (
        <SpotFormScreen
          trip={activeTrip}
          tripId={activeTrip.id}
          cityId={activeCity.id}
          initialSpot={screen.spot}
          onSave={spot => handleSaveSpot(spot, !!screen.spot)}
          onBack={() => setScreen({ type: 'city-dashboard', tripId: activeTrip.id, cityId: activeCity.id, tab: 'spots' })}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.screenBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.screenBg },
})
