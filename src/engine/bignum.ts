import Decimal from 'break_infinity.js'

export type BigNum = Decimal | number

export function fromNumber(n: number): Decimal {
  return new Decimal(n)
}

export function formatBigNum(x: BigNum): string {
  const d = x instanceof Decimal ? x : new Decimal(x)
  if (d.gte(1e12)) return d.toExponential(2)
  if (d.gte(1e9)) return (d.toNumber() / 1e9).toFixed(2) + 'B'
  if (d.gte(1e6)) return (d.toNumber() / 1e6).toFixed(2) + 'M'
  if (d.gte(1e3)) return (d.toNumber() / 1e3).toFixed(2) + 'K'
  return Math.floor(d.toNumber()).toLocaleString()
}
