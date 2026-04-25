import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  return (
    <header className={cn("absolute top-10 left-10 right-10 z-20")}>
      <div className="flex items-center justify-between">
        <div className="flex gap-5">
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

        {pathname === "/leaderboard" && (
          <Link
            href="https://mjs-spin-wheel.vercel.app/"
            rel="noopener noreferrer"
            style={{ padding: "12px 28px" }}
            className="inline-flex items-center rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/30 transition"
          >
            Spin Wheel
          </Link>
        )}
      </div>
    </header>
  );
}