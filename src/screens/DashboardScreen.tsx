import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native'
import { Category, Expense } from '../types'
import { CATEGORIES, CATEGORY_META, COLORS } from '../constants'
import { fmt, fmtDate } from '../utils'
import { TotalBanner } from '../components/TotalBanner'
import { CategoryPill } from '../components/CategoryPill'
import { ExpenseCard } from '../components/ExpenseCard'

export function DashboardScreen({
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}: {
  expenses: Expense[]
  onAddExpense: () => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
}) {
  const [activeFilter, setActiveFilter] = useState<Category | 'Todos'>('Todos')

  const [dateOpen, setDateOpen] = useState(false)
  const [draftFrom, setDraftFrom] = useState('')
  const [draftTo, setDraftTo] = useState('')
  const [appliedFrom, setAppliedFrom] = useState('')
  const [appliedTo, setAppliedTo] = useState('')
  const dateFilterActive = !!(appliedFrom || appliedTo)

  const applyDateFilter = () => {
    setAppliedFrom(draftFrom)
    setAppliedTo(draftTo)
    setDateOpen(false)
  }

  const clearDateFilter = () => {
    setDraftFrom('')
    setDraftTo('')
    setAppliedFrom('')
    setAppliedTo('')
    setDateOpen(false)
  }

  const dateFiltered = expenses.filter(e => {
    if (appliedFrom && e.date < appliedFrom) return false
    if (appliedTo && e.date > appliedTo) return false
    return true
  })

  const total = dateFiltered.reduce((s, e) => s + e.amount, 0)

  const filtered = activeFilter === 'Todos' ? dateFiltered : dateFiltered.filter(e => e.category === activeFilter)
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  const categoryTotals = CATEGORIES.map(cat => ({
    cat,
    total: dateFiltered.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    count: dateFiltered.filter(e => e.category === cat).length,
  }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.total - a.total)

  const dateFilterLabel = (() => {
    if (appliedFrom && appliedTo) return `${fmtDate(appliedFrom)} → ${fmtDate(appliedTo)}`
    if (appliedFrom) return `A partir de ${fmtDate(appliedFrom)}`
    if (appliedTo) return `Até ${fmtDate(appliedTo)}`
    return ''
  })()

  return (
    <View style={{ flex: 1 }}>
      <TotalBanner total={total} count={dateFiltered.length} dateLabel={dateFilterLabel} />

      {/* Filtros */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <CategoryPill label="Todos" active={activeFilter === 'Todos'} onPress={() => setActiveFilter('Todos')} />
          {categoryTotals.map(({ cat }) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeFilter === cat}
              meta={CATEGORY_META[cat]}
              onPress={() => setActiveFilter(cat)}
            />
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => setDateOpen(p => !p)}
          style={[
            styles.dateToggle,
            { borderColor: dateFilterActive ? COLORS.tealMain : COLORS.border, backgroundColor: dateFilterActive ? '#E8F6EF' : '#FFFFFF' },
          ]}
        >
          <Text>🗓️</Text>
          {dateFilterActive && <View style={styles.dateDot} />}
        </TouchableOpacity>
      </View>

      {dateOpen && (
        <View style={styles.datePanel}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.tealMain, letterSpacing: 0.5 }}>
              FILTRAR POR PERÍODO
            </Text>
            {dateFilterActive && (
              <TouchableOpacity onPress={clearDateFilter}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.error }}>Limpar ✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.smallLabel}>DE (AAAA-MM-DD)</Text>
              <TextInput value={draftFrom} onChangeText={setDraftFrom} placeholder="2025-07-01" style={styles.dateInput} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.smallLabel}>ATÉ (AAAA-MM-DD)</Text>
              <TextInput value={draftTo} onChangeText={setDraftTo} placeholder="2025-07-20" style={styles.dateInput} />
            </View>
          </View>
          <TouchableOpacity onPress={applyDateFilter} style={styles.applyBtn}>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Aplicar filtro</Text>
          </TouchableOpacity>
        </View>
      )}

      {dateFilterActive && !dateOpen && (
        <View style={styles.activeBadge}>
          <Text style={{ fontSize: 12 }}>📅</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.tealMain }}>{dateFilterLabel}</Text>
          <TouchableOpacity onPress={clearDateFilter}>
            <Text style={{ marginLeft: 2, fontSize: 11, color: COLORS.tealMain, fontWeight: '700' }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conteúdo */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 100 }}>
        {activeFilter === 'Todos' && categoryTotals.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionLabel}>POR CATEGORIA</Text>
            <View style={styles.grid}>
              {categoryTotals.map(({ cat, total: catTotal, count }) => {
                const meta = CATEGORY_META[cat]
                const pct = total > 0 ? (catTotal / total) * 100 : 0
                return (
                  <TouchableOpacity key={cat} onPress={() => setActiveFilter(cat)} style={styles.catCard} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                      <View style={[styles.catIconBox, { backgroundColor: meta.light }]}>
                        <Text style={{ fontSize: 18 }}>{meta.icon}</Text>
                      </View>
                      <Text style={{ fontSize: 11, color: meta.color, fontWeight: '600' }}>{pct.toFixed(0)}%</Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 }}>{cat}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>
                      {count} {count === 1 ? 'item' : 'itens'}
                    </Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: meta.bg }]} />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8 }}>{fmt(catTotal)}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={styles.sectionLabel}>{activeFilter === 'Todos' ? 'TODOS OS GASTOS' : activeFilter.toUpperCase()}</Text>
            {activeFilter !== 'Todos' && (
              <Text style={{ fontSize: 13, fontWeight: '700', color: CATEGORY_META[activeFilter].color }}>
                {fmt(filtered.reduce((s, e) => s + e.amount, 0))}
              </Text>
            )}
          </View>
          {sorted.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🗺️</Text>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 }}>Nenhum gasto aqui</Text>
              <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
                {dateFilterActive ? 'Nenhum gasto nesse período' : 'Adicione um gasto nesta categoria'}
              </Text>
            </View>
          ) : (
            sorted.map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={onEditExpense}
                onDelete={onDeleteExpense}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity onPress={onAddExpense} activeOpacity={0.85} style={styles.fab}>
        <Text style={{ color: '#FFFFFF', fontSize: 26, lineHeight: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10, gap: 8 },
  dateToggle: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  dateDot: { position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#D4714A', borderWidth: 2, borderColor: COLORS.screenBg },
  datePanel: { marginHorizontal: 16, marginBottom: 10, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1.5, borderColor: COLORS.border },
  smallLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.4, marginBottom: 6 },
  dateInput: { width: '100%', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.screenBg, fontSize: 13, color: COLORS.textPrimary },
  applyBtn: { width: '100%', paddingVertical: 11, borderRadius: 12, backgroundColor: COLORS.tealMain, alignItems: 'center' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 20, marginBottom: 8, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#E8F6EF', borderRadius: 50, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(27,75,74,0.2)' },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  catCard: { width: '48%', padding: 14, backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 4 },
  catIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 3, backgroundColor: '#F0ECE7', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
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
