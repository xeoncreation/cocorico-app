import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";

export default function Success() {
  return (
    <LegacyPageWrapper>
      <main className="p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600">¡Suscripción activada!</h1>
        <p className="mt-4 text-lg">Gracias por apoyar Cocorico. Disfruta del plan Premium.</p>
      </main>
    </LegacyPageWrapper>
  );
}
