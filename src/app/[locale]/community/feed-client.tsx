"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RippleButton } from "@/components/ui/ripple-button";
import { Heart, Share2, MessageCircle, UserPlus, UserCheck } from "lucide-react";

type Post = {
  id: string;
  content: string;
  image_url?: string | null;
  likes: number;
  created_at: string;
  user_id: string;
  user: { id?: string; display_name?: string | null; avatar_url?: string | null } | null;
  following?: boolean;
  comments?: number;
};
type Comment = { id: string; content: string; created_at: string; user_id: string };

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function FeedClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");
  useEffect(() => {
    setPlan(document.documentElement.dataset.theme === "premium" ? "premium" : "free");
  }, []);

  const { data, mutate, isLoading } = useSWR<{ posts: Post[] }>("/api/community/posts", fetcher, { refreshInterval: 15000 });
  const posts = data?.posts || [];

  const like = async (id: string) => {
    await fetch(`/api/community/posts/${id}/like`, { method: "POST" });
    mutate();
  };

  const followToggle = async (post: Post) => {
    await fetch(`/api/community/follows`, { method: "POST", body: JSON.stringify({ target_id: post.user_id, action: post.following ? "unfollow" : "follow" }) });
    mutate();
  };

  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentsData, setCommentsData] = useState<Record<string, Comment[]>>({});
  const toggleComments = async (postId: string) => {
    const next = !openComments[postId];
    setOpenComments(prev => ({ ...prev, [postId]: next }));
    if (next && !commentsData[postId]) {
      const res = await fetch(`/api/community/posts/${postId}/comments`);
      if (res.ok) {
        const json = await res.json();
        setCommentsData(prev => ({ ...prev, [postId]: json.comments }));
      }
    }
  };
  const addComment = async (postId: string, content: string) => {
    if (!content.trim()) return;
    await fetch(`/api/community/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ content }) });
    const res = await fetch(`/api/community/posts/${postId}/comments`);
    if (res.ok) {
      const json = await res.json();
      setCommentsData(prev => ({ ...prev, [postId]: json.comments }));
      mutate();
    }
  };

  const [filter,setFilter]=useState<"all"|"tips"|"recipes"|"organization">("all");
  return (
    <section className="py-10 px-4">
      <header className={cn(
        "mb-6 p-8 rounded-3xl text-center glass-card glass-card-purple glass-frosted-border"
      )}>
        <h1 className="text-3xl font-bold mb-2">Comunidad 👥</h1>
        <p className="text-sm opacity-80">Comparte ideas y descubre trucos.</p>
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
          {[
            {id:"all",label:"Todo"},
            {id:"tips",label:"Trucos"},
            {id:"recipes",label:"Recetas"},
            {id:"organization",label:"Organización"},
          ].map(f=> (
            <button key={f.id} onClick={()=>setFilter(f.id as any)} className={cn("px-3 py-1 rounded-full border", filter===f.id?"bg-primary text-white border-primary":"bg-white/10 border-white/20")}>{f.label}</button>
          ))}
        </div>
      </header>
      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading && !posts.length && (
          <div className="text-center text-sm opacity-60">Cargando feed…</div>
        )}
        {!isLoading && posts.length === 0 && (
          <div className="text-center text-sm opacity-60">Sin publicaciones aún.</div>
        )}
        {posts
          .filter(p=>{
            if(filter==="all") return true;
            // placeholder until type field exists; simulate mapping by content keywords
            if(filter==="tips") return /truco|tip|consejo/i.test(p.content);
            if(filter==="recipes") return /receta|ingrediente|hornear/i.test(p.content);
            if(filter==="organization") return /organiza|desperdicio|planifica/i.test(p.content);
            return true;
          })
          .map((p, i) => (
          <Card
            key={p.id}
            className={cn(
              "rounded-3xl p-6 glass-card glass-frosted-border transition",
              i % 3 === 0 && "glass-card-blue",
              i % 3 === 1 && "glass-card-purple",
              i % 3 === 2 && "glass-card-green"
            )}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-4 text-base font-medium">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 overflow-hidden flex items-center justify-center">
                  {p.user?.avatar_url ? (
                    <img src={p.user.avatar_url} alt={p.user.display_name || "Usuario"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span>{p.user?.display_name || "Usuario"}</span>
                  <span className="text-xs opacity-60">{new Date(p.created_at).toLocaleString()}</span>
                </div>
                <div className="ml-auto">
                  <RippleButton onClick={() => followToggle(p)} className="h-9 px-4 rounded-xl text-xs inline-flex items-center gap-2">
                    {p.following ? (<><UserCheck className="w-4 h-4"/> Siguiendo</>) : (<><UserPlus className="w-4 h-4"/> Seguir</>)}
                  </RippleButton>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{p.content}</p>
              {p.image_url && (
                <div className="rounded-xl overflow-hidden border border-white/20">
                  <img src={p.image_url} alt="Imagen" className="w-full h-auto" />
                </div>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <RippleButton
                  onClick={() => like(p.id)}
                  className="h-11 px-5 rounded-xl inline-flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" /> {p.likes}
                </RippleButton>
                <RippleButton
                  onClick={() => toggleComments(p.id)}
                  className="h-11 px-5 rounded-xl inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> {p.comments ?? 0}
                </RippleButton>
                <RippleButton className="h-11 px-5 rounded-xl inline-flex items-center gap-2">
                  <Share2 className="w-5 h-5" /> Compartir
                </RippleButton>
              </div>
              {openComments[p.id] && (
                <div className="mt-4 space-y-3 w-full">
                  <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const input = form.elements.namedItem('c') as HTMLInputElement; addComment(p.id, input.value); input.value=''; }} className="flex gap-2 w-full">
                    <input name="c" placeholder="Añadir comentario" className="flex-1 rounded-xl px-3 py-2 bg-white/10 border border-white/20" />
                    <RippleButton type="submit" className="h-10 px-4 rounded-xl text-xs">Enviar</RippleButton>
                  </form>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 w-full">
                    {(commentsData[p.id] || []).map(c => (
                      <div key={c.id} className="text-xs p-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="opacity-70 mr-1">{new Date(c.created_at).toLocaleTimeString()}</span>
                        {c.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
