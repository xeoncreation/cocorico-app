export async function secureLog(event: string, detail: any) {
  const payload = { ts: new Date().toISOString(), event, detail };
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`[secureLog]`, payload);
    return;
  }
  const url = process.env.LOGGING_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // ignore logging failures
  }
}
