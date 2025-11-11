import { supabaseServer } from "@/lib/supabase-client";
import { isAdmin } from "@/utils/authRole";
import { redirect } from "next/navigation";
import UsersTable from "./UsersTable";

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
