import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn("absolute top-10 left-10 right-10 z-20")}>
      <div className="flex justify-between items-center w-full">
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
        <div className="flex gap-5">
          <Link href="/" aria-label="Home">
            <Image
              src="/inabuyer.png"
              width={120}
              height={48}
              alt="Inabuyer"
              className="h-10 w-auto md:h-14"
              priority
            />
          </Link>
          <Link href="/" aria-label="Home">
            <Image
              src="/vision-works.png"
              width={120}
              height={48}
              alt="Vision Works"
              className="h-10 w-auto md:h-14"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
