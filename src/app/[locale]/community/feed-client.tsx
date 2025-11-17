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

// Dummy data
const dummyFeed = [
  {
    id: 1,
    user: "Chef Mateo",
    avatar: "/placeholder-avatar.png",
    content: "Acabo de subir una nueva receta de pasta cremosa 🍝🔥",
    likes: 22,
    comments: 4,
    following: false,
  },
  {
    id: 2,
    user: "Cocina en 10 Min",
    avatar: "/placeholder-avatar.png",
    content: "Nuevo truco para pelar ajos sin esfuerzo 🧄💨",
    likes: 18,
    comments: 2,
    following: true,
  },
];

export default function FeedClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    const theme = document.documentElement.dataset.theme === "premium" ? "premium" : "free";
    setPlan(theme);
  }, []);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Comunidad</h1>
        <p className="text-sm text-muted-foreground">
          Sigue a otros cocineros, descubre trucos y comparte tus ideas.
        </p>
      </header>

      {/* POSTS */}
      <div className="grid gap-6">
        {dummyFeed.map((post) => (
          <Card
            key={post.id}
            className={cn(
              "p-5 border border-border/60 rounded-2xl",
              plan === "premium" &&
                "bg-white/10 backdrop-blur-xl border-white/20 shadow-xl"
            )}
          >
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="w-10 h-10 rounded-full bg-surface border overflow-hidden" />
                <div className="flex flex-col">
                  <span className="font-semibold">{post.user}</span>
                  <span className="text-xs text-muted-foreground">hace 1h</span>
                </div>

                <div className="ml-auto">
                  {post.following ? (
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <UserCheck className="w-4 h-4 mr-1" /> Siguiendo
                    </Button>
                  ) : (
                    <Button size="sm" className="rounded-xl">
                      <UserPlus className="w-4 h-4 mr-1" /> Seguir
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <p>{post.content}</p>

              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition">
                  <Heart className="w-4 h-4" /> {post.likes}
                </button>

                <button className="flex items-center gap-1 hover:text-primary transition">
                  <MessageCircle className="w-4 h-4" /> {post.comments}
                </button>

                <button className="flex items-center gap-1 hover:text-primary transition">
                  <Share2 className="w-4 h-4" /> Compartir
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
