import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Trip, TouristSpot } from '../types'
import { COLORS } from '../constants'
import { uid } from '../utils'

export function SpotFormScreen({
  trip,
  tripId,
  cityId,
  initialSpot,
  onSave,
  onBack,
}: {
  trip: Trip
  tripId: string
  cityId: string
  initialSpot?: TouristSpot
  onSave: (spot: TouristSpot) => Promise<void>
  onBack: () => void
}) {
  const isEditing = !!initialSpot
  const [name, setName] = useState(initialSpot?.name ?? '')
  const [description, setDescription] = useState(initialSpot?.description ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Informe o nome')
      return
    }
    setSaving(true)
    try {
      await onSave({
        id: initialSpot?.id ?? uid(),
        tripId,
        cityId,
        name: name.trim(),
        description: description.trim(),
        visited: initialSpot?.visited ?? false,
      })
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onBack()
      }, 700)
    } catch (err: any) {
      setError(`Erro ao salvar: ${err?.message ?? 'tente novamente'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[trip.gradientFrom, trip.gradientTo]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerEyebrow}>{isEditing ? 'EDITAR PONTO' : 'NOVO PONTO'}</Text>
        </View>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Ponto' : 'Novo Ponto Turístico'}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.fieldLabel}>NOME DO PONTO</Text>
          <TextInput
            placeholder="Ex: Coliseu, Torre Eiffel..."
            value={name}
            autoFocus
            onChangeText={t => {
              setName(t)
              setError('')
            }}
            style={[styles.input, error && styles.inputError]}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View>
          <Text style={styles.fieldLabel}>DESCRIÇÃO / ANOTAÇÕES</Text>
          <TextInput
            placeholder="Dicas, horários, endereço, links..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            style={[styles.input, styles.textarea]}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.submitWrap}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85} disabled={saving}>
          <LinearGradient
            colors={saved ? ['#3A7A5A', '#3A7A5A'] : [trip.gradientFrom, trip.gradientTo]}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>
              {saved ? '✓ Salvo!' : saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Adicionar Ponto'}
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
  backBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  headerEyebrow: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  headerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '400' },
  form: { padding: 20, paddingBottom: 120 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 8 },
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
  textarea: { minHeight: 110, paddingTop: 14 },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  submitWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 28 },
  submitBtn: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})
