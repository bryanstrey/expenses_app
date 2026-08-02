import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, Pressable } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { COLORS } from '../constants'
import { dateToISO, fmtDateBR, isoToDate } from '../utils'


export function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string // ISO: AAAA-MM-DD
  onChange: (iso: string) => void
  error?: string
}) {
  const [open, setOpen] = useState(false)
  // Valor "rascunho" enquanto o modal está aberto no iOS (só confirma no "Concluído")
  const [draft, setDraft] = useState<Date>(value ? isoToDate(value) : new Date())

  const openPicker = () => {
    setDraft(value ? isoToDate(value) : new Date())
    setOpen(true)
  }

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // No Android o picker é um diálogo nativo do sistema, já fecha sozinho.
      setOpen(false)
      if (event.type === 'set' && selectedDate) {
        onChange(dateToISO(selectedDate))
      }
      return
    }
    // No iOS só guardamos o rascunho; confirma ao tocar em "Concluído".
    if (selectedDate) setDraft(selectedDate)
  }

  const confirmIOS = () => {
    onChange(dateToISO(draft))
    setOpen(false)
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={openPicker}
        activeOpacity={0.7}
        style={[styles.input, error && styles.inputError]}
      >
        <Text style={{ fontSize: 15, color: value ? COLORS.textPrimary : COLORS.textMuted }}>
          {value ? fmtDateBR(value) : 'Selecionar data'}
        </Text>
        <Text style={{ fontSize: 16 }}>📅</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Android: o próprio SO já mostra o diálogo como overlay nativo,
          então basta renderizar o picker sem precisar de Modal próprio. */}
      {open && Platform.OS === 'android' && (
        <DateTimePicker value={draft} mode="date" display="default" onChange={handleChange} />
      )}

      {/* iOS: colocamos o calendário dentro de um Modal para garantir que
          ele sempre apareça centralizado e com largura própria, mesmo se
          o campo estiver numa coluna estreita. */}
      {Platform.OS === 'ios' && (
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>{label}</Text>
              <DateTimePicker
                value={draft}
                mode="date"
                display="inline"
                onChange={handleChange}
                locale="pt-BR"
                style={{ alignSelf: 'center' }}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity onPress={() => setOpen(false)} style={[styles.modalBtn, styles.cancelBtn]}>
                  <Text style={{ color: COLORS.textSecondary, fontWeight: '700', fontSize: 14 }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIOS} style={[styles.modalBtn, styles.confirmBtn]}>
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>Concluído</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 8 },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: { backgroundColor: COLORS.screenBg },
  confirmBtn: { backgroundColor: COLORS.tealMain },
})
