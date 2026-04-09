export function crowdLabel(crowd) {
  if (crowd === 'empty') return { text: 'Empty', variant: 'success' }
  if (crowd === 'some') return { text: 'Some seats', variant: 'warning' }
  if (crowd === 'full') return { text: 'Full', variant: 'danger' }
  return { text: 'No data', variant: 'secondary' }
}

export function noiseLabel(noise) {
  if (noise <= 2) return { text: 'Quiet', variant: 'success' }
  if (noise === 3) return { text: 'Moderate', variant: 'warning' }
  return { text: 'Loud', variant: 'danger' }
}

function crowdToScore(crowd) {
  if (crowd === 'empty') return 1
  if (crowd === 'some') return 2
  if (crowd === 'full') return 3
  return null
}

function scoreToCrowd(score) {
  if (score <= 1.4) return 'empty'
  if (score <= 2.4) return 'some'
  return 'full'
}

function normalizeEntries(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (raw.crowd && raw.ts) return [raw]
  return []
}

function median(nums) {
  if (nums.length === 0) return null
  const a = [...nums].sort((x, y) => x - y)
  const mid = Math.floor(a.length / 2)
  return a.length % 2 ? a[mid] : Math.round((a[mid - 1] + a[mid]) / 2)
}

export function computeCommunityStatus(rawEntries, fallbackNoise, windowMs = 2 * 60 * 60 * 1000) {
  const now = Date.now()
  const entries = normalizeEntries(rawEntries)
    .filter((e) => typeof e?.ts === 'number' && now - e.ts <= windowMs)

  if (entries.length === 0) {
    return {
      crowd: null,
      noiseNow: fallbackNoise,
      reportCount: 0,
      latestTs: null,
      latestNote: null
    }
  }

  const crowdScores = entries
    .map((e) => crowdToScore(e.crowd))
    .filter((v) => v !== null)

  const avgCrowd = crowdScores.reduce((a, b) => a + b, 0) / crowdScores.length
  const crowd = scoreToCrowd(avgCrowd)

  const noiseVals = entries
    .map((e) => Number(e.noise))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 5)

  const noiseNow = median(noiseVals) ?? fallbackNoise
  const latestTs = Math.max(...entries.map((e) => e.ts))

  const latestNote =
    entries
      .slice()
      .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
      .map((e) => (typeof e.note === 'string' ? e.note.trim() : ''))
      .find((t) => t.length > 0) || null

  return { crowd, noiseNow, reportCount: entries.length, latestTs, latestNote }
}

export function minutesAgo(ts) {
  if (!ts) return null
  return Math.round((Date.now() - ts) / 60000)
}

export function getDayKey(d) {
  const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return keys[d.getDay()]
}

export function isOpenNowApprox(spot) {
  const now = new Date()
  const dayKey = getDayKey(now)
  const range = spot.hours?.[dayKey]
  if (!range || (range[0] === 0 && range[1] === 0)) return false
  const hour = now.getHours()
  const [start, end] = range
  return hour >= start && hour < end
}