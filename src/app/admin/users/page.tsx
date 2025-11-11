import { supabaseServer } from "@/lib/supabase-client";
import { isAdmin } from "@/utils/authRole";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function fetchUsers() {
  if (!supabaseServer) return [];
  const { data } = await (supabaseServer as any)
    .from('user_profiles')
    .select('user_id,email,plan,role,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}

export default async function AdminUsersPage() {
  if (!supabaseServer) redirect('/');
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) redirect('/login');
  const admin = await isAdmin(user.id);
  if (!admin) redirect('/');

  const users = await fetchUsers();
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Usuarios del sistema 👥</h1>
      <p className="text-sm mb-6 opacity-70">Gestión de planes y roles (máx 50 más recientes).</p>
      <UsersTable initial={users} />
    </div>
  );
}

function badgeColor(plan: string) {
  switch (plan) {
    case 'premium': return 'bg-primary text-white';
    case 'pro': return 'bg-secondary text-white';
    default: return 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100';
  }
}

function roleColor(role: string) {
  return role === 'admin' ? 'bg-red-500 text-white' : 'bg-neutral-300 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-100';
}

// Client component for interactive updates
// Using a single file for brevity; could be moved to components/ later.
"use client";
import { useState, useTransition } from 'react';

function UsersTable({ initial }: { initial: any[] }) {
  const [rows, setRows] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [secret, setSecret] = useState('');

  async function updateUser(user_id: string, patch: { plan?: string; role?: string }) {
    if (!secret) { alert('Introduce ADMIN_SECRET'); return; }
    startTransition(async () => {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ user_id, ...patch }),
      });
      const json = await res.json();
      if (!res.ok) { alert(json.error || 'Error'); return; }
      setRows(r => r.map(x => x.user_id === user_id ? { ...x, ...json.user } : x));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          type="password"
          placeholder="ADMIN_SECRET"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          className="px-3 py-2 rounded border bg-surface text-text w-64"
        />
        {pending && <span className="text-sm opacity-60">Actualizando...</span>}
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Plan</th>
              <th className="p-2 text-left">Rol</th>
              <th className="p-2 text-left">Creado</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.user_id} className="border-t hover:bg-surface/60">
                <td className="p-2 font-medium break-all">{u.email || '—'}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${badgeColor(u.plan)}`}>{u.plan}</span>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${roleColor(u.role)}`}>{u.role}</span>
                </td>
                <td className="p-2 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-2 py-1 rounded bg-primary text-white text-xs hover:opacity-90"
                      onClick={() => updateUser(u.user_id, { plan: u.plan === 'free' ? 'premium' : 'free' })}
                    >Toggle Plan</button>
                    <button
                      className="px-2 py-1 rounded bg-secondary text-white text-xs hover:opacity-90"
                      onClick={() => updateUser(u.user_id, { role: u.role === 'admin' ? 'user' : 'admin' })}
                    >Toggle Rol</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
