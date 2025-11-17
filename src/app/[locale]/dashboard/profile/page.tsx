"use client";
import { useEffect, useState } from "react";
import { getProfile, updateProfile, UserProfile } from "@/utils/profile";
import { uploadAvatar } from "@/utils/uploadAvatar";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err) => {
        console.error("Error cargando perfil:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      await updateProfile(profile);
      alert("✅ Perfil actualizado");
    } catch (err) {
      alert("❌ Error al actualizar: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    try {
      const url = await uploadAvatar(file, profile.user_id);
      setProfile((p) => (p ? { ...p, avatar_url: url } : null));
    } catch (err) {
      alert("❌ Error al subir avatar: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-600 dark:text-neutral-400">Cargando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-600 dark:text-neutral-400">No se encontró perfil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-indigo-950/20 dark:via-neutral-900 dark:to-purple-950/20 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-indigo-900 dark:text-indigo-300">👤 Tu perfil</h1>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="bg-white/80 dark:bg-neutral-900/80 border border-indigo-200/60 dark:border-indigo-800/40 rounded-lg p-6 glass-card-premium">
            <label className="font-semibold text-lg mb-3 block text-indigo-900 dark:text-indigo-300">Avatar</label>
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar_url || "/default-avatar.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-neutral-200 dark:border-neutral-700 object-cover"
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="avatar-upload" className="sr-only">Upload profile picture</label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                disabled={uploading}
                className="text-sm"
                aria-label="Upload profile picture"
              />
              {uploading && <p className="text-sm text-neutral-500">Subiendo...</p>}
            </div>
          </div>
        </div>

          {/* Información básica */}
          <div className="bg-white/80 dark:bg-neutral-900/80 border border-indigo-200/60 dark:border-indigo-800/40 rounded-lg p-6 space-y-4 glass-card-premium">
            <div>
            <label className="font-semibold block mb-2">Nombre de usuario</label>
            <input
              type="text"
              className="w-full border dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800"
              value={profile.username || ""}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              placeholder="usuario123"
            />
          </div>

          <div>
            <label className="font-semibold block mb-2">Biografía</label>
            <textarea
              className="w-full border dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800"
              rows={4}
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="language-select" className="font-semibold block mb-2">Idioma</label>
              <select
                id="language-select"
                className="w-full border dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800"
                value={profile.language || "es"}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                aria-label="Select language"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-2">País</label>
              <input
                type="text"
                className="w-full border dark:border-neutral-700 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800"
                value={profile.country || ""}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                placeholder="España"
              />
            </div>
          </div>
        </div>

          {/* Estadísticas */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-lg p-6 glass-card-premium">
            <h2 className="text-xl font-bold mb-4">📊 Tus Estadísticas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-90">Nivel</p>
              <p className="text-3xl font-bold">{profile.level}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-90">Experiencia</p>
              <p className="text-3xl font-bold">{profile.experience} XP</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-white/30 rounded-full h-2 overflow-hidden">
              <progress
                value={profile.experience % 100}
                max={100}
                className="w-full h-2 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-white [&::-moz-progress-bar]:bg-white"
                aria-label="Progreso al siguiente nivel"
              />
            </div>
            <p className="text-xs mt-1 opacity-75">
              {100 - (profile.experience % 100)} XP para nivel {profile.level + 1}
            </p>
          </div>
        </div>

          {/* Enlace al perfil público */}
          {profile.username && (
            <div className="bg-white/80 dark:bg-neutral-900/80 border border-indigo-200/60 dark:border-indigo-800/40 rounded-lg p-6 text-center glass-card-premium">
              <p className="text-sm text-muted-foreground mb-2">
              Tu perfil público:
            </p>
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cocorico-red font-semibold text-lg underline hover:text-cocorico-red/80 transition-colors"
            >
              cocorico.app/u/{profile.username}
            </a>
            <p className="text-xs text-neutral-500 mt-2">
              Comparte este enlace para mostrar tus recetas y logros
            </p>
          </div>
        )}

          {/* Botón de guardar */}
          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
