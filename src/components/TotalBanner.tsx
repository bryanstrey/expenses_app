import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { fmt, fmtDateShort } from '../utils'
import { Trip } from '../types'

export function TotalBanner({
  trip,
  total,
  count,
  dateLabel,
}: {
  trip: Trip
  total: number
  count: number
  dateLabel?: string
}) {
  return (
    <LinearGradient colors={[trip.gradientFrom, trip.gradientTo]} style={styles.banner}>
      <View style={[styles.circle, { top: -30, right: -30, width: 120, height: 120 }]} />
      <View style={[styles.circle, { bottom: -20, left: '40%', width: 80, height: 80 }]} />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>TOTAL DA VIAGEM</Text>
          <Text style={styles.total}>{fmt(total)}</Text>
          <View style={styles.countRow}>
            <Text style={styles.count}>
              {count} {count === 1 ? 'gasto registrado' : 'gastos registrados'}
            </Text>
            {dateLabel ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>📅 {dateLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.tripBox}>
          <Text style={styles.tripEmoji}>{trip.emoji}</Text>
          <Text style={styles.tripCity} numberOfLines={1}>{trip.name}</Text>
          <Text style={styles.tripDate}>
            {fmtDateShort(trip.startDate)} → {fmtDateShort(trip.endDate)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  banner: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '500', letterSpacing: 0.5, marginBottom: 6 },
  total: { color: '#FFFFFF', fontSize: 38, fontWeight: '400', lineHeight: 42 },
  countRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' },
  count: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  badge: {
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  tripBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    maxWidth: 110,
  },
  tripEmoji: { fontSize: 18, marginBottom: 3 },
  tripCity: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  tripDate: { color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 2 },
})