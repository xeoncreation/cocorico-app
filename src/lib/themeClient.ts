// Lightweight client for the get_theme Edge Function with 60s in-memory cache
type ThemeResponse = {
  ok: boolean
  page: string
  plan: 'free' | 'premium'
  asset: string | null
  fallback?: string | null
}

const TTL_MS = 60_000
const cache = new Map<string, { value: string | null; expires: number }>()

function getPlanFromDOM(): 'free' | 'premium' {
  if (typeof document === 'undefined') return 'free'
  const p = (document.documentElement.dataset.theme as 'free' | 'premium') || 'free'
  return p
}

export async function getThemeAsset(page: string, plan?: 'free' | 'premium', signal?: AbortSignal): Promise<string | null> {
  const currentPlan = plan || getPlanFromDOM()
  const key = `${page}:${currentPlan}`
  const now = Date.now()

  const hit = cache.get(key)
  if (hit && hit.expires > now) return hit.value

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) {
    console.warn('getThemeAsset: NEXT_PUBLIC_SUPABASE_URL missing')
    return null
  }

  try {
    const url = `${base.replace(/\/$/, '')}/functions/v1/get_theme`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, plan: currentPlan }),
      signal,
    })
    if (!res.ok) throw new Error(`get_theme ${res.status}`)
    const data = (await res.json()) as ThemeResponse
    const value = data.asset ?? data.fallback ?? null
    cache.set(key, { value, expires: now + TTL_MS })
    return value
  } catch (err) {
    // Premium fallback to free on error
    if (currentPlan === 'premium') {
      return getThemeAsset(page, 'free', signal)
    }
    console.warn('getThemeAsset error:', err)
    cache.set(key, { value: null, expires: now + 10_000 }) // short negative cache
    return null
  }
}
