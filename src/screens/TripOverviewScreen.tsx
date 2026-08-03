import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { City, Expense, Trip, TouristSpot } from '../types'
import { CATEGORIES, CATEGORY_META, COLORS } from '../constants'
import { fmt, fmtDateShort } from '../utils'
import { BottomNavBar } from '../components/BottomNavBar'
import { TripExpensesTab } from '../components/TripExpensesTab'

export function TripOverviewScreen({
  trip,
  cities,
  expenses,
  spots,
  onSelectCity,
  onAddCity,
  onEditCity,
  onDeleteCity,
  onEditExpense,
  onDeleteExpense,
  onBack,
  onLogout,
}: {
  trip: Trip
  cities: City[]
  expenses: Expense[]
  spots: TouristSpot[]
  onSelectCity: (id: string) => void
  onAddCity: () => void
  onEditCity: (city: City) => void
  onDeleteCity: (id: string) => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
  onBack: () => void
  onLogout: () => void
}) {
  const [tab, setTab] = useState<'cidades' | 'gastos'>('cidades')

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const catTotals = CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter(e => e.category === cat).length,
  }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.total - a.total)

  const confirmDeleteCity = (city: City) => {
    Alert.alert(
      'Excluir cidade',
      `Tem certeza que deseja excluir "${city.name}"? Os gastos e pontos turísticos dela também serão apagados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDeleteCity(city.id) },
      ]
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[trip.gradientFrom, trip.gradientTo]} style={styles.header}>
        <View style={[styles.circle, { top: -30, right: -30, width: 110, height: 110 }]} />
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>{trip.emoji}</Text>
          <View>
            <Text style={styles.tripName}>{trip.name}</Text>
            <Text style={styles.tripDates}>
              {fmtDateShort(trip.startDate)} → {fmtDateShort(trip.endDate)}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          <View style={[styles.statBox, { flex: 1 }]}>
            <Text style={styles.statLabel}>CIDADES</Text>
            <Text style={styles.statValue}>{cities.length}</Text>
          </View>
          <View style={[styles.statBox, { flex: 2 }]}>
            <Text style={styles.statLabel}>TOTAL GASTO</Text>
            <Text style={styles.statValue}>{fmt(total)}</Text>
          </View>
        </View>

        {/* Seletor de abas */}
        <View style={styles.tabSwitch}>
          <TouchableOpacity
            onPress={() => setTab('cidades')}
            style={[styles.tabSwitchBtn, tab === 'cidades' && styles.tabSwitchBtnActive]}
          >
            <Text style={[styles.tabSwitchText, tab === 'cidades' && styles.tabSwitchTextActive]}>🏙️ Cidades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('gastos')}
            style={[styles.tabSwitchBtn, tab === 'gastos' && styles.tabSwitchBtnActive]}
          >
            <Text style={[styles.tabSwitchText, tab === 'gastos' && styles.tabSwitchTextActive]}>💰 Todos os Gastos</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {tab === 'cidades' ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 110 }}>
          {catTotals.length > 0 && (
            <View style={{ marginBottom: 22 }}>
              <Text style={styles.sectionLabel}>GASTOS POR CATEGORIA</Text>
              <View style={styles.catCard}>
                {catTotals.map(({ cat, total: ct }, i) => {
                  const meta = CATEGORY_META[cat]
                  const pct = total > 0 ? (ct / total) * 100 : 0
                  return (
                    <View key={cat} style={{ marginBottom: i < catTotals.length - 1 ? 12 : 0 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 15 }}>{meta.icon}</Text>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textPrimary }}>{cat}</Text>
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textPrimary }}>{fmt(ct)}</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: meta.bg }]} />
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          )}

          <Text style={styles.sectionLabel}>CIDADES</Text>
          {cities.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>🏙️</Text>
              <Text style={styles.emptyTitle}>Nenhuma cidade ainda</Text>
              <Text style={styles.emptySubtitle}>Adicione as cidades da sua viagem</Text>
            </View>
          ) : (
            cities.map(city => {
              const cityExpenses = expenses.filter(e => e.cityId === city.id)
              const cityTotal = cityExpenses.reduce((s, e) => s + e.amount, 0)
              const citySpots = spots.filter(s => s.cityId === city.id)
              const pct = total > 0 ? (cityTotal / total) * 100 : 0
              return (
                <TouchableOpacity
                  key={city.id}
                  onPress={() => onSelectCity(city.id)}
                  activeOpacity={0.85}
                  style={styles.cityCard}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={[styles.cityIconBox, { backgroundColor: `${trip.gradientFrom}22` }]}>
                        <Text style={{ fontSize: 18 }}>📍</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cityName}>{city.name}</Text>
                        <Text style={styles.cityMeta}>
                          {cityExpenses.length} {cityExpenses.length === 1 ? 'gasto' : 'gastos'} · {citySpots.length}{' '}
                          {citySpots.length === 1 ? 'ponto' : 'pontos'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.cityTotal, { color: trip.gradientFrom }]}>{fmt(cityTotal)}</Text>
                      <Text style={styles.cityPct}>{pct.toFixed(0)}% do total</Text>
                    </View>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: trip.gradientFrom }]} />
                  </View>

                  <View style={styles.cityCardBottom}>
                    <Text style={[styles.seeMore, { color: trip.gradientFrom }]}>Ver cidade →</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => onEditCity(city)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={styles.smallIconBtn}
                      >
                        <Text style={{ fontSize: 13 }}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => confirmDeleteCity(city)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={styles.smallIconBtn}
                      >
                        <Text style={{ fontSize: 13 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </ScrollView>
      ) : (
        <TripExpensesTab
          expenses={expenses}
          cities={cities}
          gradientFrom={trip.gradientFrom}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
          onGoCity={onSelectCity}
        />
      )}

      <BottomNavBar onHome={onBack} onAdd={onAddCity} onLogout={onLogout} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)' },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  tripName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  tripDates: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingVertical: 9, paddingHorizontal: 14 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600' },
  statValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  tabSwitch: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 3, gap: 2 },
  tabSwitchBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabSwitchBtnActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  tabSwitchText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.45)' },
  tabSwitchTextActive: { color: '#FFFFFF' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 12 },
  catCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16 },
  progressTrack: { height: 4, backgroundColor: '#F0ECE7', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  emptyBox: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#FFFFFF', borderRadius: 18 },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: COLORS.textMuted },
  cityCard: { marginBottom: 12, borderRadius: 18, backgroundColor: '#FFFFFF', padding: 16, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  cityIconBox: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cityName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  cityMeta: { fontSize: 11, color: COLORS.textMuted },
  cityTotal: { fontSize: 17, fontWeight: '700' },
  cityPct: { fontSize: 10, color: COLORS.textMuted },
  cityCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F5F0EB' },
  seeMore: { fontSize: 12, fontWeight: '600' },
  smallIconBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#F0EEEC', alignItems: 'center', justifyContent: 'center' },
})