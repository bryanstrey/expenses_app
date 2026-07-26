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

export const uid = () => Math.random().toString(36).slice(2, 10)

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