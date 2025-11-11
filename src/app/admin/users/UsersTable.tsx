"use client";
import { useState, useTransition } from 'react';

function badgeColor(plan: string) {
  switch (plan) {
    case 'premium': return 'bg-amber-500 text-neutral-900';
    default: return 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100';
  }
}
function roleColor(role: string) {
  return role === 'admin' ? 'bg-red-500 text-white' : 'bg-neutral-300 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-100';
}

export interface UserRow {
  user_id: string;
  email: string | null;
  plan: string;
  role: string;
  created_at: string;
}

export default function UsersTable({ initial }: { initial: UserRow[] }) {
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
