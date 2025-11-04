// Dummy middleware placeholder to avoid Next.js loader error when both root and src exist.
// This one matches nothing and immediately passes through.
import { NextResponse } from 'next/server';

export default function middleware() {
	return NextResponse.next();
}

export const config = {
	matcher: ['/__never_match__'],
};
