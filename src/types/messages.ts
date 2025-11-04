export type Message = {
  id: number;
  user_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export type InsertMessage = Omit<Message, 'id' | 'created_at'>;