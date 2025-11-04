import { supabaseServer } from "@/lib/supabase-client";
import { isAdmin } from "@/utils/authRole";
import { redirect } from "next/navigation";

export default async function TestersPage() {
  if (!supabaseServer) {
    redirect("/login");
  }

  const { data: { user } } = await supabaseServer.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const adminCheck = await isAdmin(user.id);
  if (!adminCheck) {
    redirect("/dashboard");
  }

  const { data: invites } = await supabaseServer
    .from("beta_invites")
    .select("id, email, token, used, created_at, used_at, notes")
    .order("created_at", { ascending: false });

  const usedCount = invites?.filter(i => i.used).length || 0;
  const pendingCount = invites?.filter(i => !i.used).length || 0;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-2">Testers privados 🧪</h1>
        <p className="text-neutral-600">
          Gestión de invitaciones para la beta cerrada de Cocorico
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border">
          <p className="text-sm text-neutral-500">Total invitaciones</p>
          <p className="text-2xl font-bold text-amber-700">{invites?.length || 0}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow border border-green-200">
          <p className="text-sm text-neutral-500">Usadas</p>
          <p className="text-2xl font-bold text-green-700">{usedCount}</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg shadow border border-orange-200">
          <p className="text-sm text-neutral-500">Pendientes</p>
          <p className="text-2xl font-bold text-orange-700">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 dark:bg-neutral-700 border-b">
              <tr>
                <th className="p-3 text-left font-semibold">Email</th>
                <th className="p-3 text-center font-semibold">Estado</th>
                <th className="p-3 text-center font-semibold">Creada</th>
                <th className="p-3 text-center font-semibold">Usada en</th>
                <th className="p-3 text-left font-semibold">Notas</th>
                <th className="p-3 text-center font-semibold">Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {invites && invites.length > 0 ? (
                invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <td className="p-3">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {invite.email}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {invite.used ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ Usada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          ⏳ Pendiente
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center text-neutral-600 dark:text-neutral-400">
                      {new Date(invite.created_at).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-center text-neutral-600 dark:text-neutral-400">
                      {invite.used_at
                        ? new Date(invite.used_at).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400">
                      {invite.notes || "-"}
                    </td>
                    <td className="p-3 text-center">
                      <code className="text-xs bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        {invite.token.substring(0, 8)}...
                      </code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    No hay invitaciones registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href="/admin"
          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          ← Volver al admin
        </a>
        <a
          href="/admin/testers/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          + Nueva invitación
        </a>
      </div>
    </div>
  );
}
