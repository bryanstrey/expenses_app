import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { TouristSpot } from '../types'
import { COLORS } from '../constants'

function SpotCard({
  spot,
  onEdit,
  onDelete,
  onToggleVisited,
}: {
  spot: TouristSpot
  onEdit: (spot: TouristSpot) => void
  onDelete: (id: string) => void
  onToggleVisited: (spot: TouristSpot) => void
}) {
  const confirmDelete = () => {
    Alert.alert('Excluir ponto', `Tem certeza que deseja excluir "${spot.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => onDelete(spot.id) },
    ])
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onToggleVisited(spot)} style={[styles.checkBtn, spot.visited && styles.checkBtnDone]}>
        <Text style={{ fontSize: 15 }}>{spot.visited ? '✅' : '📍'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7} onPress={() => onEdit(spot)}>
        <Text style={[styles.spotName, spot.visited && styles.spotNameDone]} numberOfLines={1}>
          {spot.name}
        </Text>
        {spot.description ? (
          <Text style={styles.spotDesc} numberOfLines={2}>
            {spot.description}
          </Text>
        ) : null}
      </TouchableOpacity>

      <View style={{ flexDirection: 'column', gap: 4 }}>
        <TouchableOpacity onPress={() => onEdit(spot)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} style={styles.iconBtn}>
          <Text style={{ fontSize: 13 }}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmDelete} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} style={styles.iconBtn}>
          <Text style={{ fontSize: 13 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function SpotsTab({
  spots,
  onEditSpot,
  onDeleteSpot,
  onToggleVisited,
}: {
  spots: TouristSpot[]
  onEditSpot: (spot: TouristSpot) => void
  onDeleteSpot: (id: string) => void
  onToggleVisited: (spot: TouristSpot) => void
}) {
  const pending = spots.filter(s => !s.visited)
  const visited = spots.filter(s => s.visited)

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 14, paddingBottom: 140 }}>
      {spots.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Text style={{ fontSize: 32, marginBottom: 10 }}>📍</Text>
          <Text style={styles.emptyTitle}>Nenhum ponto ainda</Text>
          <Text style={styles.emptySubtitle}>Adicione os lugares que quer visitar</Text>
        </View>
      ) : (
        <>
          {pending.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>A VISITAR · {pending.length}</Text>
              {pending.map(spot => (
                <SpotCard key={spot.id} spot={spot} onEdit={onEditSpot} onDelete={onDeleteSpot} onToggleVisited={onToggleVisited} />
              ))}
            </>
          )}

          {visited.length > 0 && (
            <View style={{ marginTop: pending.length > 0 ? 16 : 0 }}>
              <Text style={[styles.sectionLabel, { color: COLORS.tealMain }]}>✓ VISITADOS · {visited.length}</Text>
              {visited.map(spot => (
                <SpotCard key={spot.id} spot={spot} onEdit={onEditSpot} onDelete={onDeleteSpot} onToggleVisited={onToggleVisited} />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  emptySubtitle: { fontSize: 12, color: COLORS.textMuted },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  checkBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnDone: { backgroundColor: '#E8F6EF' },
  spotName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  spotNameDone: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  spotDesc: { fontSize: 11, color: COLORS.textMuted, lineHeight: 15 },
  iconBtn: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0EEEC' },
})
