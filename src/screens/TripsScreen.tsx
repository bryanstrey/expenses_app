import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Expense, Trip } from '../types'
import { COLORS } from '../constants'
import { fmt, fmtDateShort } from '../utils'

export function TripsScreen({
  trips,
  expenses,
  onSelectTrip,
  onAddTrip,
  onLogout,
}: {
  trips: Trip[]
  expenses: Expense[]
  onSelectTrip: (id: string) => void
  onAddTrip: () => void
  onLogout: () => void
}) {
  const totalAll = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <LinearGradient colors={[COLORS.tealMain, COLORS.tealDark]} style={styles.header}>
        <View style={[styles.circle, { top: -40, right: -20, width: 140, height: 140 }]} />
        <View style={[styles.circle, { bottom: 10, left: '30%', width: 60, height: 60 }]} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={styles.eyebrow}>BOM DIA, VIAJANTE ✈️</Text>
            <Text style={styles.title}>Minhas Viagens</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }}>Sair</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={[styles.statBox, { flex: 1 }]}>
            <Text style={styles.statLabel}>VIAGENS</Text>
            <Text style={styles.statValue}>{trips.length}</Text>
          </View>
          <View style={[styles.statBox, { flex: 2 }]}>
            <Text style={styles.statLabel}>TOTAL GASTO</Text>
            <Text style={styles.statValue}>{fmt(totalAll)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Lista de viagens */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {trips.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🌍</Text>
            <Text style={styles.emptyTitle}>Nenhuma viagem ainda</Text>
            <Text style={styles.emptySubtitle}>Toque no + para criar sua primeira viagem</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>SUAS VIAGENS</Text>
            {trips.map(trip => {
              const tripExpenses = expenses.filter(e => e.tripId === trip.id)
              const tripTotal = tripExpenses.reduce((s, e) => s + e.amount, 0)
              return (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => onSelectTrip(trip.id)}
                  activeOpacity={0.85}
                  style={styles.tripCard}
                >
                  <LinearGradient
                    colors={[trip.gradientFrom, trip.gradientTo]}
                    style={styles.tripCardTop}
                  >
                    <View style={[styles.circle, { top: -20, right: -20, width: 80, height: 80 }]} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <Text style={{ fontSize: 22 }}>{trip.emoji}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.tripName}>{trip.name}</Text>
                            <Text style={styles.tripDestination}>{trip.destination}</Text>
                          </View>
                        </View>
                        <Text style={styles.tripDates}>
                          {fmtDateShort(trip.startDate)} → {fmtDateShort(trip.endDate)}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.tripTotalLabel}>TOTAL</Text>
                        <Text style={styles.tripTotalValue}>{fmt(tripTotal)}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                  <View style={styles.tripCardBottom}>
                    <Text style={styles.tripExpenseCount}>
                      {tripExpenses.length} {tripExpenses.length === 1 ? 'gasto' : 'gastos'}
                    </Text>
                    <Text style={[styles.tripSeeMore, { color: trip.gradientFrom }]}>Ver detalhes →</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity onPress={onAddTrip} activeOpacity={0.85} style={styles.fab}>
        <Text style={{ color: '#FFFFFF', fontSize: 26, lineHeight: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 36,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.04)' },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  eyebrow: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '400', marginBottom: 16 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' },
  statValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 14 },
  emptyTitle: { fontSize: 22, color: COLORS.textPrimary, marginBottom: 8, fontWeight: '500' },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted },
  tripCard: {
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tripCardTop: { padding: 20, paddingBottom: 16, overflow: 'hidden' },
  tripName: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', lineHeight: 20 },
  tripDestination: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  tripDates: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 },
  tripTotalLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', letterSpacing: 0.4 },
  tripTotalValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '400' },
  tripCardBottom: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripExpenseCount: { fontSize: 13, color: COLORS.textMuted },
  tripSeeMore: { fontSize: 12, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#D4714A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D4714A',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
})