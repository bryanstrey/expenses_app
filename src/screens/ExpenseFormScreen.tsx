import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Category, Expense } from '../types'
import { CATEGORIES, CATEGORY_META, COLORS } from '../constants'
import { fmt, fmtDate, todayISO, uid } from '../utils'

export function ExpenseFormScreen({
  tripId,
  initialExpense,
  onSave,
  onBack,
}: {
  tripId: string
  /** Se informado, o formulário abre em modo edição, já preenchido. */
  initialExpense?: Expense
  onSave: (e: Expense) => void
  onBack: () => void
}) {
  const isEditing = !!initialExpense

  const [name, setName] = useState(initialExpense?.name ?? '')
  const [category, setCategory] = useState<Category>(initialExpense?.category ?? 'Alimentação')
  const [customCategory, setCustomCategory] = useState(initialExpense?.customCategory ?? '')
  const [amount, setAmount] = useState(initialExpense ? String(initialExpense.amount) : '')
  const [date, setDate] = useState(initialExpense?.date ?? todayISO())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Informe o nome do gasto'
    if (category === 'Outro' && !customCategory.trim()) e.customCategory = 'Informe o nome da categoria'
    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) e.amount = 'Informe um valor válido'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = 'Use o formato AAAA-MM-DD'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    onSave({
      id: initialExpense?.id ?? uid(),
      tripId,
      name: name.trim(),
      category,
      customCategory: category === 'Outro' && customCategory.trim() ? customCategory.trim() : undefined,
      amount: parseFloat(amount.replace(',', '.')),
      date,
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onBack()
    }, 700)
  }

  const meta = CATEGORY_META[category]

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <LinearGradient colors={[COLORS.tealMain, COLORS.tealDark]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerEyebrow}>{isEditing ? 'EDITAR GASTO' : 'NOVO GASTO'}</Text>
        </View>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Gasto' : 'Registrar Gasto'}</Text>
        <Text style={styles.headerSubtitle}>
          {isEditing ? 'Ajuste os detalhes abaixo' : 'Preencha os detalhes abaixo'}
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {/* Categoria */}
        <View style={{ marginBottom: 22 }}>
          <Text style={styles.fieldLabel}>CATEGORIA</Text>
          <View style={styles.categoryWrap}>
            {CATEGORIES.map(cat => {
              const m = CATEGORY_META[cat]
              const active = cat === category
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setCategory(cat)
                    if (cat !== 'Outro') setCustomCategory('')
                  }}
                  style={[
                    styles.categoryChip,
                    {
                      borderColor: active ? m.bg : COLORS.border,
                      borderWidth: active ? 2 : 1.5,
                      backgroundColor: active ? m.light : '#FFFFFF',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 15 }}>{m.icon}</Text>
                  <Text style={{ fontSize: 13, fontWeight: active ? '600' : '500', color: active ? m.color : COLORS.textSecondary }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {category === 'Outro' && (
            <View style={[styles.customBox, { backgroundColor: CATEGORY_META['Outro'].light }]}>
              <Text style={[styles.fieldLabel, { color: CATEGORY_META['Outro'].color, marginBottom: 8 }]}>
                📌 QUAL É A CATEGORIA?
              </Text>
              <TextInput
                placeholder="Ex: Seguro viagem, Visto, Lavanderia..."
                value={customCategory}
                onChangeText={t => {
                  setCustomCategory(t)
                  setErrors(p => ({ ...p, customCategory: '' }))
                }}
                style={[styles.input, errors.customCategory && styles.inputError]}
              />
              {errors.customCategory ? <Text style={styles.errorText}>{errors.customCategory}</Text> : null}
            </View>
          )}
        </View>

        {/* Nome */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.fieldLabel}>NOME DO GASTO</Text>
          <TextInput
            placeholder="Ex: Jantar no restaurante..."
            value={name}
            onChangeText={t => {
              setName(t)
              setErrors(p => ({ ...p, name: '' }))
            }}
            style={[styles.input, errors.name && styles.inputError]}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        {/* Valor */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.fieldLabel}>VALOR (R$)</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <Text style={[styles.currencyPrefix, { color: meta.color }]}>R$</Text>
            <TextInput
              placeholder="0,00"
              value={amount}
              onChangeText={t => {
                setAmount(t)
                setErrors(p => ({ ...p, amount: '' }))
              }}
              keyboardType="decimal-pad"
              style={[styles.input, { paddingLeft: 48 }, errors.amount && styles.inputError]}
            />
          </View>
          {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
        </View>

        {/* Data */}
        <View style={{ marginBottom: 28 }}>
          <Text style={styles.fieldLabel}>DATA (AAAA-MM-DD)</Text>
          <TextInput
            placeholder="2025-07-15"
            value={date}
            onChangeText={t => {
              setDate(t)
              setErrors(p => ({ ...p, date: '' }))
            }}
            style={[styles.input, errors.date && styles.inputError]}
          />
          {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
        </View>

        {/* Prévia */}
        {name && amount ? (
          <View style={[styles.previewBox, { backgroundColor: meta.light }]}>
            <Text style={[styles.fieldLabel, { color: meta.color, marginBottom: 8 }]}>PRÉVIA</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 24 }}>{meta.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: COLORS.textPrimary }}>{name || '—'}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                  {(category === 'Outro' && customCategory ? customCategory : category)} · {date ? fmtDate(date) : '—'}
                </Text>
              </View>
              <Text style={{ fontWeight: '700', fontSize: 16, color: meta.color }}>
                {amount ? fmt(parseFloat(amount.replace(',', '.')) || 0) : '—'}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.submitWrap}>
        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
          <LinearGradient
            colors={submitted ? ['#3A7A5A', '#3A7A5A'] : [COLORS.tealMain, COLORS.tealDark]}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>
              {submitted ? (isEditing ? '✓ Alterações salvas!' : '✓ Gasto adicionado!') : isEditing ? 'Salvar Alterações' : 'Registrar Gasto'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: { paddingTop: 24, paddingHorizontal: 20, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerEyebrow: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '400' },
  headerSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 6 },
  form: { padding: 20, paddingBottom: 120 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 8 },
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 50 },
  customBox: { marginTop: 14, padding: 16, borderRadius: 16 },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  currencyPrefix: { position: 'absolute', left: 16, fontSize: 15, fontWeight: '600', zIndex: 1 },
  previewBox: { padding: 16, borderRadius: 16, marginBottom: 24 },
  submitWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 28, backgroundColor: 'transparent' },
  submitBtn: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})
