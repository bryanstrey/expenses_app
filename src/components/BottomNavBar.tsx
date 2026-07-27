import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS } from '../constants'


export function BottomNavBar({
  onHome,
  onAdd,
  onLogout,
  homeActive,
}: {
  onHome: () => void
  onAdd: () => void
  onLogout: () => void
  /** Destaca o botão Home como a tela atual (usado na tela de viagens). */
  homeActive?: boolean
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <TouchableOpacity onPress={onHome} activeOpacity={0.7} style={[styles.homeBtn, homeActive && styles.homeBtnActive]}>
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onAdd} activeOpacity={0.85} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} activeOpacity={0.8} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  homeBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: COLORS.tealMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnActive: {
    backgroundColor: COLORS.tealDark,
  },
  homeText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.tealMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: -2 },
  logoutBtn: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: '#D64545',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
})