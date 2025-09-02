import logo from "@/assets/logo.png";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchBar } from "@/components/search-bar";
import { UserDropdown } from "@/components/user-dropdown";
import { getServerSession } from "@/lib/get-session";
import Image from "next/image";
import Link from "next/link";



export async function Navbar() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <Link
          href="/blog"
          className="flex items-center gap-2 font-semibold text-sm sm:text-base lg:text-lg hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <Image
              src={logo}
              alt="Dawn Blog"
              width={28}
              height={28}
              className="border-muted rounded-full border sm:w-8 sm:h-8"
            />
          </div>
          <span className="hidden xs:inline sm:inline-block truncate">
            Dawn-Blog
          </span>
          <span className="xs:hidden sm:hidden">
            Dawn
          </span>
        </Link>

        <SearchBar />

        <div className="flex items-center gap-1 sm:gap-2">
          <ModeToggle />
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  );
}