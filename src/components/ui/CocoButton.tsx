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
  const base = "px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed coco-glass";
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${base} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
