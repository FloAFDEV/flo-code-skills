import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-700 focus-visible:ring-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
  secondary:
    "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
};

/**
 * Primitive bouton réutilisable. Une seule responsabilité visuelle ;
 * les variantes restent volontairement minimales (élargies si un vrai besoin apparaît).
 */
export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]}${className ? ` ${className}` : ""}`;
  return <button type={type} className={classes} {...props} />;
}
