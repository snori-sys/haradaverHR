/**
 * ポイント計算関連のユーティリティ関数
 */

/**
 * 利用金額から付与ポイントを計算
 * @param amount 利用金額
 * @param pointRate ポイント還元率（%）
 * @returns 付与ポイント（小数点以下切り捨て）
 */
export function calculatePoints(amount: number, pointRate: number): number {
  return Math.floor((amount * pointRate) / 100)
}

/**
 * 利用可能なポイント単位を計算
 * @param currentPoints 現在のポイント残高
 * @param minPoints 利用可能最小値
 * @param pointUnit ポイント利用単位
 * @returns 利用可能なポイント単位の配列（例: [500, 1000, 1500]）
 */
export function getAvailablePointUnits(
  currentPoints: number,
  minPoints: number,
  pointUnit: number
): number[] {
  if (currentPoints < minPoints) {
    return []
  }

  const units: number[] = []
  let unit = minPoints

  while (unit <= currentPoints) {
    units.push(unit)
    unit += pointUnit
  }

  return units
}

/**
 * 次回利用可能ポイントを計算
 * @param currentPoints 現在のポイント残高
 * @param minPoints 利用可能最小値
 * @param pointUnit ポイント利用単位
 * @returns 次回利用可能ポイント（500ポイント刻み）
 */
export function getNextAvailablePoints(
  currentPoints: number,
  minPoints: number,
  pointUnit: number
): number {
  if (currentPoints < minPoints) {
    return minPoints
  }

  // 現在の残高を超える最小の単位を計算
  const remainder = currentPoints % pointUnit
  if (remainder === 0) {
    return currentPoints
  }

  return currentPoints + (pointUnit - remainder)
}

