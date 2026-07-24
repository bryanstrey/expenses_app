import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Expense } from '../types'
import { CATEGORY_META, COLORS } from '../constants'
import { fmt, fmtDate } from '../utils'

function expenseLabel(expense: Expense) {
  return expense.category === 'Outro' && expense.customCategory
    ? expense.customCategory
    : expense.category
}

export function ExpenseCard({
  expense,
  onEdit,
  onDelete,
}: {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}) {
  const meta = CATEGORY_META[expense.category]
  const label = expenseLabel(expense)

  const confirmDelete = () => {
    Alert.alert(
      'Excluir gasto',
      `Tem certeza que deseja excluir "${expense.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(expense.id) },
      ]
    )
  }

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => onEdit(expense)}>
      <View style={[styles.iconBox, { backgroundColor: meta.light }]}>
        <Text style={{ fontSize: 20 }}>{meta.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{expense.name}</Text>
        <Text style={styles.date}>{fmtDate(expense.date)}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.amount}>{fmt(expense.amount)}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: meta.light }]}>
          <Text style={[styles.categoryText, { color: meta.color }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={confirmDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.deleteBtn}
      >
        <Text style={{ fontSize: 16 }}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontWeight: '600', fontSize: 14, color: COLORS.textPrimary, marginBottom: 3 },
  date: { fontSize: 12, color: COLORS.textMuted },
  amount: { fontWeight: '700', fontSize: 15, color: COLORS.textPrimary },
  categoryBadge: {
    marginTop: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    maxWidth: 90,
  },
  categoryText: { fontSize: 11, fontWeight: '600' },
  deleteBtn: {
    marginLeft: 6,
    paddingLeft: 6,
  },
})