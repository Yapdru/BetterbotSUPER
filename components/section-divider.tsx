export function SectionDivider({
  variant = "primary",
}: {
  variant?: "primary" | "secondary" | "mixed"
}) {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div
        className={`h-px bg-gradient-to-r from-transparent to-transparent ${
          variant === "primary"
            ? "via-primary/20"
            : variant === "secondary"
              ? "via-secondary/20"
              : "via-primary/15"
        }`}
      />
    </div>
  )
}
