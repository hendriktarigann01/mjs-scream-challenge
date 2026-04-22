import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn("absolute top-10 left-10 z-20")}>
      <div className="flex gap-10">
        <Link href="/" aria-label="Home">
          <Image
            src="/mjs_logo_text.png"
            width={120}
            height={48}
            alt="MJ Solution Indonesia"
            className="h-10 w-auto md:h-14"
            priority
          />
        </Link>
        <Link href="/" aria-label="Home">
          <Image
            src="/arch_id.png"
            width={120}
            height={48}
            alt="Arch ID"
            className="h-10 w-auto md:h-14"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
