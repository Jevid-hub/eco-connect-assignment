import type { ReactNode } from "react"

// variant type 
type ButtonVariant = "primary" | "outline"

type ButtonProps = {
  label: string
  onClick?: () => void
  variant?: ButtonVariant
  // icon import type
  icon?: ReactNode
}

export default function Button({
  label,
  onClick,
  variant = "primary",
  icon,
}: ButtonProps) {
    // css basis of variant 
  const base =
    "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors"

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#B5481F] text-white hover:bg-[#9c3d1a]",
    outline:
      "bg-white text-[#B5481F] border border-[#B5481F] hover:bg-orange-50",
  }

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <span>{label}</span>
      {icon}
    </button>
  )
}