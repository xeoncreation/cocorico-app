"use client";

interface CocoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export default function CocoButton({ 
  children, 
  onClick, 
  variant = "solid", 
  type = "button",
  className = "",
  disabled = false
}: CocoButtonProps) {
  const base = "px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "solid"
      ? "bg-cocorico-yellow text-cocorico-red hover:bg-cocorico-orange"
      : "border border-cocorico-red text-cocorico-red hover:bg-cocorico-red hover:text-white";

  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${base} ${styles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
