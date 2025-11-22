import Link from "next/link";
import { RippleButton } from "@/components/ui/ripple-button";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";

export default function UpgradePage() {
  return (
    <LegacyPageWrapper>
      <div className="p-6 space-y-10 glass-card glass-card-purple glass-frosted-border">
        <h1 className="text-3xl font-bold">Mejorar a Premium</h1>

        <p className="opacity-70">
          Desbloquea el Liquid Glass completo, IA avanzada y contenidos exclusivos.
        </p>

        <form action="/api/billing/checkout" method="POST">
          <RippleButton className="bg-primary text-white w-full h-12">
            Proceder al pago
          </RippleButton>
        </form>

        <Link
          href="/plans"
          className="opacity-60 underline text-sm text-center block"
        >
          Volver a planes
        </Link>
      </div>
    </LegacyPageWrapper>
  );
}
