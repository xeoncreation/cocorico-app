interface CocoCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function CocoCard({ title, children, className = "" }: CocoCardProps) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-md border border-neutral-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-cocorico-brown mb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
