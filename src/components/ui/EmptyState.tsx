import Image from "next/image";

export default function EmptyState({
  title = "Nada por aquí…",
  subtitle = "Cuando guardes recetas o generes versiones, las verás aquí.",
  image = "/branding/cocorico-thinking.png"
}: {
  title?: string;
  subtitle?: string;
  image?: string;
}) {
  const isGif = image.toLowerCase().endsWith('.gif');
  return (
    <div className="text-center py-16">
      <Image
        src={image}
        alt="Cocorico"
        width={120}
        height={120}
        className="mx-auto mb-4 opacity-80 fade-edge-sm"
        unoptimized={isGif}
      />
      <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
      <p className="text-sm text-neutral-500">{subtitle}</p>
    </div>
  );
}
