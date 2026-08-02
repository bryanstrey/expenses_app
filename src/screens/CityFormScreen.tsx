import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { City, Trip } from '../types'
import { COLORS } from '../constants'
import { uid } from '../utils'

export function CityFormScreen({
  trip,
  initialCity,
  onSave,
  onBack,
}: {
  trip: Trip
  initialCity?: City
  onSave: (city: City) => Promise<void>
  onBack: () => void
}) {
  const isEditing = !!initialCity
  const [name, setName] = useState(initialCity?.name ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Informe o nome da cidade')
      return
    }
    setSaving(true)
    try {
      await onSave({ id: initialCity?.id ?? uid(), tripId: trip.id, name: name.trim() })
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
          <Text style={styles.headerEyebrow}>{isEditing ? 'EDITAR CIDADE' : 'NOVA CIDADE'}</Text>
        </View>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Cidade' : 'Adicionar Cidade'}</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.fieldLabel}>NOME DA CIDADE</Text>
        <TextInput
          placeholder="Ex: Roma, Brasília, Tóquio..."
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

      <View style={styles.submitWrap}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85} disabled={saving}>
          <LinearGradient
            colors={saved ? ['#3A7A5A', '#3A7A5A'] : [trip.gradientFrom, trip.gradientTo]}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>
              {saved ? '✓ Salvo!' : saving ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar Cidade'}
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
  form: { padding: 20 },
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
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  submitWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 28 },
  submitBtn: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})
