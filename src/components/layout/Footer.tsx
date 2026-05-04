import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({}: FooterProps) {
  return (
    <footer
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-20",
        "w-[40%] px-10 h-14 flex items-center justify-center rounded-full",
        "uppercase tracking-widest font-bold text-brand-primary text-lg",
        "bg-white/15 backdrop-blur-md border border-white/30 shadow-2xl",
      )}
    >
      By MJ Solution Indonesia
    </footer>
  );
}
