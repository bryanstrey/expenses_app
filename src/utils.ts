export const centsToDisplay = (digits: string): string => {
  const cents = parseInt(digits || '0', 10)
  const value = cents / 100
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

/** Converte a mesma string de dígitos (centavos) para o valor numérico real. */
export const centsToNumber = (digits: string): number => {
  const cents = parseInt(digits || '0', 10)
  return cents / 100
}

/** Converte um valor numérico (ex: 35.05) de volta para a string de dígitos ("3505"), usado ao abrir o formulário em modo edição. */
export const numberToCents = (value: number): string => String(Math.round(value * 100))

export const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d} ${months[parseInt(m, 10) - 1]}, ${y}`
}

export const fmtDateShort = (iso: string) => {
  if (!iso) return '—'
  const [, m, d] = iso.split('-')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d} ${months[parseInt(m, 10) - 1]}`
}

/**
 * Transforma um nome em um identificador "limpo" (sem acentos, espaços ou
 * símbolos), usado para gerar um email interno de login a partir do nome
 * (o Supabase Auth só entende email por baixo dos panos).
 */
export const slugifyUsername = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // mantém só letras/números

/** Domínio interno usado para montar o email de login a partir do nome. */
export const LOGIN_EMAIL_DOMAIN = '@gastosdeviagem.app'

export const nameToLoginEmail = (name: string): string =>
  `${slugifyUsername(name)}${LOGIN_EMAIL_DOMAIN}`

/** Gera um UUID v4 válido (formato exigido pelas colunas `uuid` do Supabase). */
export const uid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const r = (Math.random() * 16) | 0
    const v = char === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const todayISO = () => new Date().toISOString().split('T')[0]

/** Converte uma string ISO (AAAA-MM-DD) em um objeto Date local (sem fuso horário). */
export const isoToDate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

/** Converte um objeto Date em string ISO (AAAA-MM-DD), no fuso local. */
export const dateToISO = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Exibe a data no formato brasileiro DD/MM/AAAA a partir do ISO salvo no banco. */
export const fmtDateBR = (iso: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}