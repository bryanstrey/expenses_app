export const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d} ${months[parseInt(m, 10) - 1]}, ${y}`
}

export const uid = () => Math.random().toString(36).slice(2, 10)

export const todayISO = () => new Date().toISOString().split('T')[0]
