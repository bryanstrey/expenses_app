import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { Category, City, Expense } from '../types'
import { CATEGORIES, CATEGORY_META, COLORS } from '../constants'
import { fmt, fmtDateBR } from '../utils'
import { DateField } from './DateField'

function TripExpenseCard({
  expense,
  cityName,
  gradientFrom,
  onEdit,
  onDelete,
  onGoCity,
}: {
  expense: Expense
  cityName: string
  gradientFrom: string
  onEdit: () => void
  onDelete: () => void
  onGoCity: () => void
}) {
  const meta = CATEGORY_META[expense.category]
  const label = expense.category === 'Outro' && expense.customCategory ? expense.customCategory : expense.category

  const confirmDelete = () => {
    Alert.alert('Excluir gasto', `Tem certeza que deseja excluir "${expense.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: onDelete },
    ])
  }

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onEdit}>
      <View style={[styles.iconBox, { backgroundColor: meta.light }]}>
        <Text style={{ fontSize: 18 }}>{meta.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{expense.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.date}>{fmtDateBR(expense.date)}</Text>
          <Text style={{ fontSize: 9, color: '#C8C0B8' }}>·</Text>
          <TouchableOpacity onPress={onGoCity} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
            <Text style={[styles.cityLink, { color: gradientFrom }]}>📍 {cityName}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.amount}>{fmt(expense.amount)}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: meta.light }]}>
          <Text style={[styles.categoryText, { color: meta.color }]} numberOfLines={1}>{label}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={confirmDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.deleteBtn}>
        <Text style={{ fontSize: 15 }}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export function TripExpensesTab({
  expenses,
  cities,
  gradientFrom,
  onEditExpense,
  onDeleteExpense,
  onGoCity,
}: {
  expenses: Expense[]
  cities: City[]
  gradientFrom: string
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
  onGoCity: (cityId: string) => void
}) {
  const [cityFilter, setCityFilter] = useState<string | 'Todos'>('Todos')
  const [catFilter, setCatFilter] = useState<Category | 'Todos'>('Todos')

  const [dateOpen, setDateOpen] = useState(false)
  const [draftFrom, setDraftFrom] = useState('')
  const [draftTo, setDraftTo] = useState('')
  const [appliedFrom, setAppliedFrom] = useState('')
  const [appliedTo, setAppliedTo] = useState('')
  const dateActive = !!(appliedFrom || appliedTo)

  const applyDate = () => {
    setAppliedFrom(draftFrom)
    setAppliedTo(draftTo)
    setDateOpen(false)
  }

  const clearDate = () => {
    setDraftFrom('')
    setDraftTo('')
    setAppliedFrom('')
    setAppliedTo('')
    setDateOpen(false)
  }

  const cityMap: Record<string, string> = {}
  cities.forEach(c => (cityMap[c.id] = c.name))

  let filtered = expenses
  if (cityFilter !== 'Todos') filtered = filtered.filter(e => e.cityId === cityFilter)
  if (appliedFrom) filtered = filtered.filter(e => e.date >= appliedFrom)
  if (appliedTo) filtered = filtered.filter(e => e.date <= appliedTo)
  if (catFilter !== 'Todos') filtered = filtered.filter(e => e.category === catFilter)

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0)

  const catsWithExpenses = CATEGORIES.filter(cat => expenses.some(e => e.category === cat))

  const dateLabel = (() => {
    if (appliedFrom && appliedTo) return `${fmtDateBR(appliedFrom)} → ${fmtDateBR(appliedTo)}`
    if (appliedFrom) return `A partir de ${fmtDateBR(appliedFrom)}`
    if (appliedTo) return `Até ${fmtDateBR(appliedTo)}`
    return ''
  })()

  return (
    <View style={{ flex: 1 }}>
      {/* Resumo */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <View style={[styles.summaryBar, { backgroundColor: `${gradientFrom}0D` }]}>
          <Text style={styles.summaryCount}>
            {filtered.length} {filtered.length === 1 ? 'gasto' : 'gastos'}
          </Text>
          <Text style={[styles.summaryTotal, { color: gradientFrom }]}>{fmt(filteredTotal)}</Text>
        </View>
      </View>

      {/* Chips de cidade */}
      {cities.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, height: 40, flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 6, alignItems: 'center', flexGrow: 0 }}>
          <TouchableOpacity
            onPress={() => setCityFilter('Todos')}
            style={[styles.chip, cityFilter === 'Todos' ? { borderColor: gradientFrom, backgroundColor: `${gradientFrom}18` } : styles.chipInactive]}
          >
            <Text style={[styles.chipText, cityFilter === 'Todos' && { color: gradientFrom, fontWeight: '700' }]}>🌍 Todas</Text>
          </TouchableOpacity>
          {cities.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCityFilter(c.id)}
              style={[styles.chip, cityFilter === c.id ? { borderColor: gradientFrom, backgroundColor: `${gradientFrom}18` } : styles.chipInactive]}
            >
              <Text style={[styles.chipText, cityFilter === c.id && { color: gradientFrom, fontWeight: '700' }]}>📍 {c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Chips de categoria + botão de data */}
      <View style={styles.catRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1, height: 36 }} contentContainerStyle={{ alignItems: 'center', flexGrow: 0 }}>
          <TouchableOpacity
            onPress={() => setCatFilter('Todos')}
            style={[styles.chip, catFilter === 'Todos' ? { borderColor: gradientFrom, backgroundColor: `${gradientFrom}18` } : styles.chipInactive]}
          >
            <Text style={[styles.chipText, catFilter === 'Todos' && { color: gradientFrom, fontWeight: '700' }]}>Todos</Text>
          </TouchableOpacity>
          {catsWithExpenses.map(cat => {
            const m = CATEGORY_META[cat]
            const active = catFilter === cat
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCatFilter(cat)}
                style={[styles.chip, active ? { borderColor: m.bg, backgroundColor: m.light } : styles.chipInactive]}
              >
                <Text style={[styles.chipText, active && { color: m.color, fontWeight: '700' }]}>
                  {m.icon} {cat}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={() => setDateOpen(p => !p)}
          style={[
            styles.dateToggle,
            { borderColor: dateActive ? gradientFrom : COLORS.border, backgroundColor: dateActive ? `${gradientFrom}18` : '#FFFFFF' },
          ]}
        >
          <Text>🗓️</Text>
          {dateActive && <View style={[styles.dateDot, { backgroundColor: gradientFrom }]} />}
        </TouchableOpacity>
      </View>

      {dateOpen && (
        <View style={styles.datePanel}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: gradientFrom, letterSpacing: 0.5 }}>PERÍODO</Text>
            {dateActive && (
              <TouchableOpacity onPress={clearDate}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.error }}>Limpar ✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <DateField label="DE" value={draftFrom} onChange={setDraftFrom} />
            </View>
            <View style={{ flex: 1 }}>
              <DateField label="ATÉ" value={draftTo} onChange={setDraftTo} />
            </View>
          </View>
          <TouchableOpacity onPress={applyDate} style={[styles.applyBtn, { backgroundColor: gradientFrom }]}>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      )}

      {dateActive && !dateOpen && (
        <View style={[styles.activeBadge, { backgroundColor: `${gradientFrom}18`, borderColor: `${gradientFrom}55` }]}>
          <Text style={{ fontSize: 11 }}>📅</Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: gradientFrom }}>{dateLabel}</Text>
          <TouchableOpacity onPress={clearDate}>
            <Text style={{ marginLeft: 2, fontSize: 11, color: gradientFrom, fontWeight: '700' }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 110 }}>
        {sorted.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>🗺️</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 }}>Nenhum gasto encontrado</Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Tente outros filtros</Text>
          </View>
        ) : (
          sorted.map(expense => (
            <TripExpenseCard
              key={expense.id}
              expense={expense}
              cityName={cityMap[expense.cityId] ?? ''}
              gradientFrom={gradientFrom}
              onEdit={() => onEditExpense(expense)}
              onDelete={() => onDeleteExpense(expense.id)}
              onGoCity={() => onGoCity(expense.cityId)}
            />
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  summaryBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, paddingVertical: 9, paddingHorizontal: 14 },
  summaryCount: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  summaryTotal: { fontSize: 16, fontWeight: '700' },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 50, borderWidth: 1.5, marginRight: 6 },
  chipInactive: { borderColor: COLORS.border, backgroundColor: '#FFFFFF' },
  chipText: { fontSize: 11, fontWeight: '500', color: COLORS.textSecondary },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6, gap: 8 },
  dateToggle: { width: 34, height: 34, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  dateDot: { position: 'absolute', top: -3, right: -3, width: 9, height: 9, borderRadius: 5, borderWidth: 2, borderColor: COLORS.screenBg },
  datePanel: { marginHorizontal: 20, marginTop: 6, marginBottom: 8, padding: 14, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.border },
  applyBtn: { width: '100%', paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginHorizontal: 20, marginBottom: 6, paddingVertical: 5, paddingHorizontal: 11, borderRadius: 50, alignSelf: 'flex-start', borderWidth: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 9,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconBox: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '600', fontSize: 13, color: COLORS.textPrimary, marginBottom: 2 },
  date: { fontSize: 10, color: COLORS.textMuted },
  cityLink: { fontSize: 10, fontWeight: '600' },
  amount: { fontWeight: '700', fontSize: 13, color: COLORS.textPrimary },
  categoryBadge: { marginTop: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, maxWidth: 80 },
  categoryText: { fontSize: 10, fontWeight: '600' },
  deleteBtn: { marginLeft: 2, paddingLeft: 2 },
})
