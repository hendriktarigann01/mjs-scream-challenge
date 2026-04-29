import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({}: FooterProps) {
  return (
    <footer
      className={cn(
        "relative z-20 w-full uppercase tracking-widest font-bold text-brand-primary text-xl",
        "h-16 flex items-center justify-center",
      )}
    >
      By MJ Solution Indonesia
    </footer>
  );
}
