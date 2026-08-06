import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
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
        <TouchableOpacity onPress={onHome} activeOpacity={0.85} style={styles.btnShadow}>
          <LinearGradient
            colors={homeActive ? [COLORS.tealDark, '#081E1D'] : [COLORS.tealMain, COLORS.tealDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.homeBtn}
          >
            <Text style={styles.homeText}>Home</Text>
            {homeActive && <View style={styles.activeDot} />}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} activeOpacity={0.85} style={styles.btnShadow}>
          <LinearGradient
            colors={['#C24A3D', '#9E362B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutBtn}
          >
            <Text style={styles.logoutBtnText}>Sair</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Botão + centralizado de verdade na barra, independente da largura dos outros dois */}
      <View style={styles.addBtnWrap} pointerEvents="box-none">
        <TouchableOpacity onPress={onAdd} activeOpacity={0.85} style={styles.addBtnShadow}>
          <LinearGradient
            colors={[COLORS.fabFrom, COLORS.fabTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 22,
    left: 22,
    right: 22,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#1A1512',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  addBtnWrap: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  btnShadow: {
    borderRadius: 16,
    shadowColor: COLORS.tealDark,
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  homeBtn: {
    height: 50,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 },
  activeDot: {
    position: 'absolute',
    bottom: 7,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  addBtnShadow: {
    borderRadius: 18,
    shadowColor: COLORS.fabTo,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 16,
  },
  addBtn: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.screenBg,
    backgroundColor: COLORS.fabTo,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 30, fontWeight: '700', marginTop: -3 },
  logoutBtn: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 },
})
