"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  UserCheck,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dummy data con imágenes de Cocorico
const dummyFeed = [
  {
    id: 1,
    user: "Chef Mateo",
    avatar: "/branding/cocorico/chef.png",
    content: "Acabo de subir una nueva receta de pasta cremosa 🍝🔥 ¡Quedó increíble!",
    likes: 22,
    comments: 4,
    following: false,
  },
  {
    id: 2,
    user: "Cocina en 10 Min",
    avatar: "/branding/cocorico/cocorico-smiling.png",
    content: "Nuevo truco para pelar ajos sin esfuerzo 🧄💨 Te va a cambiar la vida",
    likes: 18,
    comments: 2,
    following: true,
  },
  {
    id: 3,
    user: "Repostería Feliz",
    avatar: "/branding/cocorico/happy.png",
    content: "Brownies perfectos en 30 minutos 🍫✨ Receta en mi perfil",
    likes: 45,
    comments: 8,
    following: false,
  },
  {
    id: 4,
    user: "Cocina Saludable",
    avatar: "/branding/cocorico/thinking.png",
    content: "5 desayunos ricos en proteína para empezar el día con energía 💪🥑",
    likes: 31,
    comments: 6,
    following: true,
  },
  {
    id: 5,
    user: "El Gourmet",
    avatar: "/branding/cocorico/cocorico-cooking.png",
    content: "Técnica secreta para un risotto cremoso sin batir constantemente 🍚👨‍🍳",
    likes: 67,
    comments: 12,
    following: false,
  },
];

export default function FeedClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    const theme = document.documentElement.dataset.theme === "premium" ? "premium" : "free";
    setPlan(theme);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50/80 via-purple-50/60 to-rose-50/80 dark:from-pink-950/40 dark:via-purple-900/30 dark:to-rose-950/40 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
      <header className={cn(
        "p-8 rounded-3xl text-center",
        plan === "premium" ? "glass-card-premium" : "bg-white/80 dark:bg-neutral-900/80 border border-pink-200 dark:border-pink-800"
      )}>
        <h1 className={cn(
          "text-4xl font-bold mb-3",
          plan === "premium" ? "glass-text-premium" : "text-pink-900 dark:text-pink-300"
        )}>
          Comunidad 👥
        </h1>
        <p className={cn(
          "text-base",
          plan === "premium" ? "text-white/80" : "text-muted-foreground"
        )}>
          Sigue a otros cocineros, descubre trucos y comparte tus ideas.
        </p>
      </header>

      {/* POSTS */}
      <div className="grid gap-6">
        {dummyFeed.map((post) => (
          <Card
            key={post.id}
            className={cn(
              "p-6 border rounded-3xl transition-all hover:scale-102",
              plan === "premium" ? "glass-card-premium" : "bg-white/90 dark:bg-neutral-900/90 border-pink-200 dark:border-pink-800 shadow-lg hover:shadow-2xl"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-4 text-base">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 border-2 border-white/30 overflow-hidden flex items-center justify-center">
                  <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{post.user}</span>
                  <span className="text-xs text-muted-foreground">hace 1h</span>
                </div>

                <div className="ml-auto">
                  {post.following ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "rounded-xl font-medium",
                        plan === "premium" && "glass-droplet"
                      )}
                    >
                      <UserCheck className="w-4 h-4 mr-1" /> Siguiendo
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className={cn(
                        "rounded-xl font-medium",
                        plan === "premium" && "glass-button-premium"
                      )}
                    >
                      <UserPlus className="w-4 h-4 mr-1" /> Seguir
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 text-base">
              <p className={plan === "premium" ? "text-white/90" : ""}>{post.content}</p>

              <div className="flex items-center gap-6 text-sm">
                <button className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105",
                  plan === "premium" ? "glass-droplet" : "hover:bg-pink-50 dark:hover:bg-pink-900/20"
                )}>
                  <Heart className="w-5 h-5 text-pink-600" /> 
                  <span className="font-medium">{post.likes}</span>
                </button>

                <button className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105",
                  plan === "premium" ? "glass-droplet" : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}>
                  <MessageCircle className="w-5 h-5 text-blue-600" /> 
                  <span className="font-medium">{post.comments}</span>
                </button>

                <button className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105",
                  plan === "premium" ? "glass-droplet" : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}>
                  <Share2 className="w-5 h-5 text-purple-600" /> 
                  <span className="font-medium">Compartir</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </section>
  );
}
