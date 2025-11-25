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
        imageLight="/branding/HISTORIAL_MODO_CLARO.jpg"
        imageDark="/branding/HISTORIAL_MODO_OSCURO.jpg"
      />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold glass-text-strong">Historial de Escaneos</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {scans.map(scan => (
            <GlassCard key={scan.id} className="p-6">
              <h2 className="text-xl font-bold mb-2">{scan.product}</h2>
              <div className="glass-text-medium mb-2">Fecha: {scan.date}</div>
              <div className="glass-text-soft mb-2">Puntaje: {scan.score}</div>
              <a href={`/scanner/${scan.id}`} className="glass-pill px-3 py-1 bg-blue-500 text-white font-bold">Ver producto</a>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
}
