import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { City, Expense, Trip, TouristSpot } from '../types'
import { COLORS } from '../constants'
import { fmt } from '../utils'
import { ExpensesTab } from '../components/ExpensesTab'
import { SpotsTab } from '../components/SpotsTab'
import { BottomNavBar } from '../components/BottomNavBar'

export function CityDashboardScreen({
  trip,
  city,
  expenses,
  spots,
  tab,
  onTabChange,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onAddSpot,
  onEditSpot,
  onDeleteSpot,
  onToggleVisited,
  onBack,
  onHome,
  onLogout,
}: {
  trip: Trip
  city: City
  expenses: Expense[]
  spots: TouristSpot[]
  tab: 'expenses' | 'spots'
  onTabChange: (tab: 'expenses' | 'spots') => void
  onAddExpense: () => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
  onAddSpot: () => void
  onEditSpot: (spot: TouristSpot) => void
  onDeleteSpot: (id: string) => void
  onToggleVisited: (spot: TouristSpot) => void
  /** Volta pra visão geral da viagem (lista de cidades). */
  onBack: () => void
  /** Vai direto pra lista de viagens (usado pelo botão Home da barra inferior). */
  onHome: () => void
  onLogout: () => void
}) {
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const pendingSpots = spots.filter(s => !s.visited).length

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[trip.gradientFrom, trip.gradientTo]} style={styles.header}>
        <View style={[styles.circle, { top: -20, right: -20, width: 90, height: 90 }]} />
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.tripLabel}>
              {trip.emoji} {trip.name.toUpperCase()}
            </Text>
            <Text style={styles.cityName}>📍 {city.name}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={styles.totalLabel}>TOTAL GASTO</Text>
            <Text style={styles.totalValue}>{fmt(total)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.metaText}>
              {expenses.length} {expenses.length === 1 ? 'gasto' : 'gastos'}
            </Text>
            <Text style={styles.metaText}>
              {pendingSpots} {pendingSpots === 1 ? 'ponto' : 'pontos'} a visitar
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Seletor de abas */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => onTabChange('expenses')}
          style={[styles.tabBtn, tab === 'expenses' && { borderColor: trip.gradientFrom, backgroundColor: `${trip.gradientFrom}18` }]}
        >
          <Text style={[styles.tabText, tab === 'expenses' && { color: trip.gradientFrom, fontWeight: '700' }]}>Gastos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTabChange('spots')}
          style={[styles.tabBtn, tab === 'spots' && { borderColor: trip.gradientFrom, backgroundColor: `${trip.gradientFrom}18` }]}
        >
          <Text style={[styles.tabText, tab === 'spots' && { color: trip.gradientFrom, fontWeight: '700' }]}>Pontos</Text>
        </TouchableOpacity>
      </View>

      {tab === 'expenses' ? (
        <ExpensesTab expenses={expenses} onEditExpense={onEditExpense} onDeleteExpense={onDeleteExpense} />
      ) : (
        <SpotsTab spots={spots} onEditSpot={onEditSpot} onDeleteSpot={onDeleteSpot} onToggleVisited={onToggleVisited} />
      )}

      <BottomNavBar onHome={onHome} onAdd={tab === 'expenses' ? onAddExpense : onAddSpot} onLogout={onLogout} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingTop: 18, paddingHorizontal: 20, paddingBottom: 18, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, overflow: 'hidden' },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)' },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  backBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  tripLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '600', letterSpacing: 0.4 },
  cityName: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  totalLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '600', letterSpacing: 0.4, marginBottom: 2 },
  totalValue: { color: '#FFFFFF', fontSize: 26, fontWeight: '400' },
  metaText: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#FFFFFF', alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
})
