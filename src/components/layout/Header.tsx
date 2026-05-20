import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn("absolute top-10 left-10 right-10 z-20")}>
      <div className="flex gap-6 w-full">
        <Link href="/" aria-label="Home">
          <Image
            src="/mjs-white.webp"
            width={140}
            height={56}
            alt="Vision Works"
            className="h-12 w-auto md:h-16"
            priority
          />
        </Link>

        <Link href="/" aria-label="Home">
          <Image
            src="/in-lite.webp"
            width={140}
            height={56}
            alt="Inabuyer"
            className="h-12 w-auto md:h-16"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
