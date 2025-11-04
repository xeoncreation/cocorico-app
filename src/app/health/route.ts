// Health check endpoint to bypass i18n middleware and heavy rendering
// GET /health -> 200 OK with a small JSON payload
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', time: new Date().toISOString() });
}
