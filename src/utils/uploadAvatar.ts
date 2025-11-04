import { supabase } from "@/app/lib/supabase-client";

/**
 * Sube un archivo de avatar al bucket de Supabase Storage
 * @param file - El archivo de imagen a subir
 * @param userId - El ID del usuario (para organizar por carpetas)
 * @returns La URL pública del avatar subido
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  // Sanitizar nombre del archivo
  const fileName = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  
  // Subir al bucket 'avatars' (o 'recipes' si prefieres usar el mismo)
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { 
      upsert: true,
      contentType: file.type
    });

  if (error) throw error;

  // Obtener la URL pública
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

/**
 * Elimina un avatar del storage
 * @param avatarUrl - La URL completa del avatar a eliminar
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  // Extraer el path del avatar de la URL
  const path = avatarUrl.split('/avatars/')[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from("avatars")
    .remove([path]);

  if (error) throw error;
}
