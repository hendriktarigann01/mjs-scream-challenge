import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "px-6 pb-5 text-white text-xs font-bold text-brand-primary uppercase tracking-widest",
        "text-center md:text-left",
        className,
      )}
    >
      By MJ Solution Indonesia
    </footer>
  );
}
