import GlassCard from "@/components/ui/GlassCard";
import Wallpaper from "@/components/layout/Wallpaper";

export default async function ScannerHistoryPage({ params }: { params: { locale: string } }) {
  // TODO: Replace with actual DB fetch
  const scans = [
    { id: 1, product: "Producto A", date: "2025-11-20", score: 85 },
    { id: 2, product: "Producto B", date: "2025-11-18", score: 92 },
  ];

  // Add blurred wallpaper background for scanner history
  // ...existing code...
  return (
    <>
      <Wallpaper
        imageLight="/branding/HISTORIAL DE ESCANEOS — Pasillo de supermercado, modo claro.png"
        imageDark="/branding/HISTORIAL DE ESCANEOS — Supermercado, modo oscuro.png"
      />
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-2">Historial de Escaneos</h1>
            <p className="text-neutral-600 dark:text-neutral-400">Tus productos analizados recientemente</p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {scans.map(scan => (
            <GlassCard key={scan.id} className="p-6 flex items-center justify-between group hover:scale-[1.02] transition-transform">
              <div>
                <h2 className="text-xl font-bold mb-1 text-neutral-800 dark:text-neutral-200">{scan.product}</h2>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Fecha: {scan.date}</div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Puntaje: {scan.score}
                </div>
              </div>
              <a 
                href={`/scanner/${scan.id}`} 
                className="px-4 py-2 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors text-sm font-semibold text-cocorico-brown dark:text-amber-100"
              >
                Ver
              </a>
            </GlassCard>
          ))}
        </div>
        
        {scans.length === 0 && (
           <GlassCard className="p-12 text-center">
             <p className="text-neutral-500 dark:text-neutral-400">No hay escaneos recientes.</p>
           </GlassCard>
        )}
      </div>
    </>
  );
}
