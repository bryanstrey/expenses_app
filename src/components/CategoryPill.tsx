import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { COLORS } from '../constants'

export function CategoryPill({
  label,
  active,
  meta,
  onPress,
}: {
  label: string
  active: boolean
  meta?: { icon: string; color: string; light: string; bg: string }
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.pill,
        {
          borderColor: active ? meta?.bg ?? COLORS.tealMain : COLORS.border,
          backgroundColor: active ? meta?.light ?? '#E8F6EF' : '#FFFFFF',
        },
      ]}
    >
      {meta ? <Text style={styles.icon}>{meta.icon}</Text> : null}
      <Text
        style={[
          styles.label,
          { color: active ? meta?.color ?? COLORS.tealMain : COLORS.textSecondary },
          active && { fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1.5,
    marginRight: 8,
  },
  icon: { fontSize: 14 },
  label: { fontSize: 13, fontWeight: '500' },
})
