import CocoricoTip from "@/components/CocoricoTip";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";

export default function LearnPage() {
  return (
    <LegacyPageWrapper>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-amber-800 text-center">
          Aprende con Cocorico 🐓
        </h1>
        <p className="text-center text-neutral-600">
          Consejos de alimentación, seguridad e ideas para aprovechar mejor tus alimentos.
        </p>

        <section className="space-y-4">
          <CocoricoTip
            title="Lava bien las verduras 🍃"
            text="Usa agua fría y un cepillo suave para eliminar residuos de tierra. Evita el uso de jabón o lejía, ya que pueden dejar residuos peligrosos."
            image="/branding/cocorico/cocorico-washing.png"
          />

          <CocoricoTip
            title="Aprovecha las sobras 🍲"
            text="Convierte el arroz del día anterior en croquetas o mezcla las verduras asadas en una sopa cremosa."
            image="/branding/cocorico/cocorico-cooking.png"
          />

          <CocoricoTip
            title="Corta con cuidado 🔪"
            text="Usa una tabla limpia y cuchillo afilado. Mantén siempre los dedos curvados para evitar cortes."
            image="/branding/cocorico/cocorico-cutting.png"
          />

          <CocoricoTip
            title="Organiza tu nevera 🧊"
            text="Coloca los alimentos perecederos delante para usarlos antes. Guarda frutas y verduras separadas."
            image="/branding/cocorico/cocorico-smiling.png"
          />
        </section>
      </main>
    </LegacyPageWrapper>
  );
}
