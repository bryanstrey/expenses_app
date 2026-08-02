import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../constants'
import { supabase } from '../lib/supabase'
import { nameToLoginEmail, slugifyUsername } from '../utils'

export function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')

    if (slugifyUsername(name).length < 2) {
      setError('Digite um nome com pelo menos 2 letras')
      return
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres')
      return
    }

    const email = nameToLoginEmail(name)

    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // Sucesso: o listener onAuthStateChange no App.tsx já cuida
        // de trocar de tela sozinho.
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        })
        if (error) throw error
        // Sem confirmação de email (é um email interno, não existe de
        // verdade) — o login já libera na hora.
      }
    } catch (e: any) {
      setError(traduzErro(e?.message ?? 'Algo deu errado, tente novamente'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[COLORS.tealMain, COLORS.tealDark]} style={styles.header}>
        <Text style={{ fontSize: 40, marginBottom: 8 }}>✈️</Text>
        <Text style={styles.title}>Gastos de Viagem</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Entre para ver suas viagens' : 'Crie sua conta para começar'}
        </Text>
      </LinearGradient>

      <View style={styles.form}>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>NOME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>SENHA</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            style={styles.input}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={handleSubmit} disabled={loading} style={{ marginTop: 16 }}>
          <LinearGradient colors={[COLORS.tealMain, COLORS.tealDark]} style={styles.submitBtn}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMode(m => (m === 'login' ? 'signup' : 'login'))
            setError('')
          }}
          style={{ marginTop: 18, alignItems: 'center' }}
        >
          <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
            {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <Text style={{ color: COLORS.tealMain, fontWeight: '700' }}>
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

/** Traduz as mensagens de erro mais comuns do Supabase pro português. */
function traduzErro(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return 'Nome ou senha incorretos'
  if (/user already registered/i.test(msg)) return 'Já existe uma conta com esse nome — escolha outro'
  if (/email not confirmed/i.test(msg))
    return 'A confirmação de email precisa estar desativada no Supabase (Authentication → Providers → Email → Confirm email: desligado)'
  return msg
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 6 },
  form: { padding: 24, flex: 1, justifyContent: 'center' },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 8 },
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
  errorText: { color: COLORS.error, fontSize: 13, marginTop: 8, textAlign: 'center' },
  submitBtn: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})
