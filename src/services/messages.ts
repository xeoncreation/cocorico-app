import { supabase } from "@/app/lib/supabase-client";
import type { Database } from "@/types/supabase";

type Message = Database['public']['Tables']['messages']['Row'];
type InsertMessage = Database['public']['Tables']['messages']['Insert'];

export const messageService = {
  async getMessages(): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async insertMessage(message: InsertMessage): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Error de conexión:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error al probar conexión:', err);
      return false;
    }
  }
};