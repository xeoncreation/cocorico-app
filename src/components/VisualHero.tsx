type Props = { url?: string | null; className?: string };

export default function VisualHero({ url, className }: Props) {
  if (!url) return null;
  
  const isVideo = url.endsWith(".mp4") || url.includes(".mp4?");
  
  return (
    <div className={className ?? "relative w-full h-[48vh] overflow-hidden rounded-2xl"}>
      {isVideo ? (
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src={url} type="video/mp4" />
        </video>
      ) : (
        <img src={url} alt="" className="w-full h-full object-cover" />
      )}
      {/* overlay suave para contraste */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
}
