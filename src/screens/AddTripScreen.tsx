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
import { Trip } from '../types'
import { COLORS, TRIP_EMOJIS, TRIP_GRADIENTS } from '../constants'
import { uid, todayISO } from '../utils'

export function AddTripScreen({
  onSave,
  onBack,
}: {
  onSave: (trip: Trip) => void
  onBack: () => void
}) {
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState(todayISO())
  const [endDate, setEndDate] = useState(todayISO())
  const [emoji, setEmoji] = useState('✈️')
  const [gradientIdx, setGradientIdx] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Informe o nome da viagem'
    if (!destination.trim()) e.destination = 'Informe o destino'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) e.startDate = 'Use o formato AAAA-MM-DD'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) e.endDate = 'Use o formato AAAA-MM-DD'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    onSave({
      id: uid(),
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      emoji,
      gradientFrom: TRIP_GRADIENTS[gradientIdx][0],
      gradientTo: TRIP_GRADIENTS[gradientIdx][1],
    })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onBack()
    }, 700)
  }

  const [gradFrom, gradTo] = TRIP_GRADIENTS[gradientIdx]

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[gradFrom, gradTo]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerEyebrow}>NOVA VIAGEM</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 36 }}>{emoji}</Text>
          <View>
            <Text style={styles.headerTitle}>{name || 'Nova Viagem'}</Text>
            <Text style={styles.headerSubtitle}>{destination || 'Destino...'}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {/* Ícone */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.fieldLabel}>ÍCONE DA VIAGEM</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TRIP_EMOJIS.map(e => {
              const active = emoji === e
              return (
                <TouchableOpacity
                  key={e}
                  onPress={() => setEmoji(e)}
                  style={[
                    styles.emojiBtn,
                    {
                      borderColor: active ? COLORS.tealMain : COLORS.border,
                      borderWidth: active ? 2 : 1.5,
                      backgroundColor: active ? '#E8F6EF' : '#FFFFFF',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Cor */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.fieldLabel}>COR DO CARTÃO</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {TRIP_GRADIENTS.map(([c1, c2], idx) => (
              <TouchableOpacity key={idx} onPress={() => setGradientIdx(idx)}>
                <LinearGradient
                  colors={[c1, c2]}
                  style={[
                    styles.colorSwatch,
                    gradientIdx === idx && { borderWidth: 3, borderColor: COLORS.textPrimary },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nome */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.fieldLabel}>NOME DA VIAGEM</Text>
          <TextInput
            placeholder="Ex: Verão Europeu, Mochilão Ásia..."
            value={name}
            onChangeText={t => {
              setName(t)
              setErrors(p => ({ ...p, name: '' }))
            }}
            style={[styles.input, errors.name && styles.inputError]}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        {/* Destino */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.fieldLabel}>DESTINO</Text>
          <TextInput
            placeholder="Ex: Roma, Itália"
            value={destination}
            onChangeText={t => {
              setDestination(t)
              setErrors(p => ({ ...p, destination: '' }))
            }}
            style={[styles.input, errors.destination && styles.inputError]}
          />
          {errors.destination ? <Text style={styles.errorText}>{errors.destination}</Text> : null}
        </View>

        {/* Datas */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>INÍCIO (AAAA-MM-DD)</Text>
            <TextInput
              placeholder="2025-07-10"
              value={startDate}
              onChangeText={t => {
                setStartDate(t)
                setErrors(p => ({ ...p, startDate: '' }))
              }}
              style={[styles.input, errors.startDate && styles.inputError]}
            />
            {errors.startDate ? <Text style={styles.errorText}>{errors.startDate}</Text> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>FIM (AAAA-MM-DD)</Text>
            <TextInput
              placeholder="2025-07-18"
              value={endDate}
              onChangeText={t => {
                setEndDate(t)
                setErrors(p => ({ ...p, endDate: '' }))
              }}
              style={[styles.input, errors.endDate && styles.inputError]}
            />
            {errors.endDate ? <Text style={styles.errorText}>{errors.endDate}</Text> : null}
          </View>
        </View>
      </ScrollView>

      <View style={styles.submitWrap}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
          <LinearGradient
            colors={saved ? ['#3A7A5A', '#3A7A5A'] : [gradFrom, gradTo]}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>{saved ? '✓ Viagem criada!' : 'Criar Viagem'}</Text>
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
  headerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '400' },
  headerSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  form: { padding: 20, paddingBottom: 120 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 10 },
  emojiBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  colorSwatch: { width: 36, height: 36, borderRadius: 10 },
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
