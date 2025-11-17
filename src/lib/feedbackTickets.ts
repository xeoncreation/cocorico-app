// Script to load user feedback tickets from Supabase
// Usage: Call this from feedback-client.tsx to load real tickets

import { createClient } from "@supabase/supabase-js";

export type FeedbackTicket = {
  id: string;
  user_id: string;
  title: string;
  category: "bug" | "feature" | "improvement";
  description: string;
  image_url: string | null;
  status: "pending" | "working" | "done" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  votes: number;
  admin_response: string | null;
  admin_user_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export async function loadUserTickets(userId: string): Promise<FeedbackTicket[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("feedback_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading tickets:", error);
    return [];
  }

  return data as FeedbackTicket[];
}

export async function loadAllTickets(
  limit: number = 20,
  status?: string
): Promise<FeedbackTicket[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("feedback_tickets")
    .select("*")
    .order("votes", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading all tickets:", error);
    return [];
  }

  return data as FeedbackTicket[]  ;
}

export async function voteTicket(ticketId: string, increment: number = 1) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: ticket } = await supabase
    .from("feedback_tickets")
    .select("votes")
    .eq("id", ticketId)
    .single();

  if (!ticket) return false;

  const { error } = await supabase
    .from("feedback_tickets")
    .update({ votes: ticket.votes + increment })
    .eq("id", ticketId);

  return !error;
}
