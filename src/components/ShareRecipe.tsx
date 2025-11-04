"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, QrCode } from "lucide-react";

export default function ShareRecipe({ slug, userId }: { slug: string; userId: string }) {
  const [showQR, setShowQR] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${userId}/${slug}`
      : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    toast("Enlace copiado 📋");
  }

  return (
    <div className="mt-4 flex flex-col items-start gap-3 border-t pt-4">
      <h3 className="text-sm font-semibold text-amber-800">Compartir receta</h3>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          <Share2 size={14} className="mr-1" />
          Copiar enlace
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setShowQR(!showQR)}>
          <QrCode size={14} className="mr-1" />
          {showQR ? "Ocultar QR" : "Mostrar QR"}
        </Button>
      </div>
      {showQR && (
        <div className="bg-white p-3 rounded border">
          <QRCodeCanvas value={shareUrl} size={160} />
        </div>
      )}
    </div>
  );
}
