// src/app/[locale]/dashboard/feedback/feedback-client.tsx
"use client";

import { useState } from "react";
import { RippleButton } from "@/components/ui/ripple-button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR from "swr";
import { motion } from "framer-motion";

export default function FeedbackClient() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/feedback/list", fetcher, { refreshInterval: 4000 });

  async function uploadImage() {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const filePath = `feedback/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("assets")
      .upload(filePath, file);

    if (error) return null;

    return supabase.storage.from("assets").getPublicUrl(filePath).data.publicUrl;
  }

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const category = form.get("category");
    const title = form.get("title");
    const message = form.get("message");
    const image_url = await uploadImage();

    await fetch("/api/feedback/new", {
      method: "POST",
      body: JSON.stringify({
        category,
        title,
        message,
        image_url
      })
    });

    setLoading(false);
    e.target.reset();
    setFile(null);
  }

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-3xl font-bold text-primary">Feedback & Sugerencias</h1>

      <div className="glass-card glass-card-blue glass-frosted-border p-6">
        <form onSubmit={submit} className="space-y-4">
          <select
            name="category"
            className="w-full rounded-xl bg-surface p-3"
            required
          >
            <option value="bug">Bug 🐞</option>
            <option value="feature">Nueva función ✨</option>
            <option value="improvement">Mejora 🔧</option>
          </select>

          <input
            name="title"
            className="w-full rounded-xl bg-surface p-3"
            placeholder="Título"
            required
          />

          <textarea
            name="message"
            className="w-full rounded-xl bg-surface p-3"
            placeholder="Describe tu sugerencia…"
            required
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <RippleButton disabled={loading} className="bg-primary text-white">
            Enviar feedback
          </RippleButton>
        </form>
      </div>

      <div className="glass-card glass-card-orange glass-frosted-border p-6">
        <h2 className="text-xl font-semibold mb-4">Historial</h2>
        <div className="space-y-4">
          {data?.data && data.data.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card glass-card-purple glass-frosted-border p-4"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm opacity-60">{item.status}</div>
              </div>

              <p className="text-sm mt-2">{item.message}</p>

              {item.image_url && (
                <img src={item.image_url} className="rounded-lg mt-3 max-h-40" alt="feedback" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const theme = document.documentElement.dataset.theme === "premium" ? "premium" : "free";
    setPlan(theme);
  }, []);

  const form = useForm({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      title: "",
      category: "bug" as const,
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FeedbackSchema>) {
    setUploading(true);

    let fileUrl = null;

    // Upload image to Supabase Storage
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("assets")
        .upload(`feedback/${fileName}`, imageFile);

      if (!error) {
        const { data: publicUrl } = supabase.storage
          .from("assets")
          .getPublicUrl(`feedback/${fileName}`);
        fileUrl = publicUrl.publicUrl;
      }
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Save to database
    try {
      const { error: insertError } = await supabase
        .from("feedback_tickets")
        .insert({
          user_id: user?.id,
          title: values.title,
          category: values.category,
          description: values.description,
          image_url: fileUrl,
          status: "pending",
          priority: "medium",
        });

      if (insertError) {
        console.error("Error inserting feedback:", insertError);
        alert("Error al guardar el feedback. Por favor intenta de nuevo.");
      } else {
        alert("✅ Feedback enviado correctamente. ¡Gracias por ayudarnos a mejorar Cocorico!");
        form.reset();
        setImageFile(null);
        
        // Reload tickets
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50/80 via-white to-emerald-50/60 dark:from-green-950/20 dark:via-neutral-900 dark:to-emerald-950/20 py-8">
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-300">
            📝 Enviar Feedback
          </h1>
          <p className="text-muted-foreground">
            Tu opinión es crucial para mejorar Cocorico. Reporta bugs, sugiere features o comparte tu experiencia.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* FORMULARIO CREATE FEEDBACK       */}
        {/* -------------------------------- */}
        <Card
          className={cn(
            "border border-green-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-green-800/40 p-6 rounded-2xl space-y-6",
            plan === "premium" && "glass-card-premium"
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-green-900 dark:text-green-300">
              Nuevo ticket
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Título */}
              <div>
                <label className="text-sm font-medium mb-2 block">Título</label>
                <Input
                  placeholder="Título del ticket"
                  {...form.register("title")}
                  className="bg-white dark:bg-neutral-800"
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <select
                  {...form.register("category")}
                  className="w-full p-2 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                >
                  <option value="bug">🔧 Bug / Error</option>
                  <option value="feature">💡 Nueva Función</option>
                  <option value="improvement">✨ Mejora</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-sm font-medium mb-2 block">Descripción</label>
                <Textarea
                  placeholder="Describe el problema o sugerencia con detalle..."
                  rows={4}
                  {...form.register("description")}
                  className="bg-white dark:bg-neutral-800"
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Adjuntar imagen */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Adjuntar captura (opcional)</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="bg-white dark:bg-neutral-800"
                  />
                  {imageFile && (
                    <FileImage className="w-6 h-6 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </div>

              <Button 
                disabled={uploading} 
                className="w-full rounded-xl h-12 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" /> Enviar feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* -------------------------------- */}
        {/* HISTORIAL DE TICKETS ENVIADOS   */}
        {/* -------------------------------- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-300">
            Tu historial de tickets
          </h2>

          <div className="grid gap-4">
            {dummyTickets.map((t) => (
              <Card
                key={t.id}
                className={cn(
                  "p-4 border border-green-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-green-800/40 rounded-xl flex items-center justify-between",
                  plan === "premium" && "glass-card-premium"
                )}
              >
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{t.category}</p>
                </div>

                <div className="text-xs font-medium flex items-center gap-1">
                  {t.status === "pending" && (
                    <>
                      <Bug className="w-4 h-4 text-orange-500" /> Pendiente
                    </>
                  )}
                  {t.status === "working" && (
                    <>
                      <Lightbulb className="w-4 h-4 text-yellow-500" /> En progreso
                    </>
                  )}
                  {t.status === "done" && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" /> Resuelto
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className={cn(
              "p-6 border border-blue-200/60 bg-blue-50/80 dark:bg-blue-900/20 dark:border-blue-800/40 rounded-xl",
              plan === "premium" && "glass-card-premium"
            )}
          >
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-300">💬 Contacto directo</h3>
            <p className="text-sm text-muted-foreground">
              También puedes escribirnos a:<br />
              <a href="mailto:feedback@cocorico.app" className="text-blue-600 dark:text-blue-400 underline">
                feedback@cocorico.app
              </a>
            </p>
          </Card>

          <Card
            className={cn(
              "p-6 border border-purple-200/60 bg-purple-50/80 dark:bg-purple-900/20 dark:border-purple-800/40 rounded-xl",
              plan === "premium" && "glass-card-premium"
            )}
          >
            <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-300">🎁 Recompensas</h3>
            <p className="text-sm text-muted-foreground">
              Los mejores feedbacks recibirán 1 mes de Premium gratis y aparecerán en los agradecimientos.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
