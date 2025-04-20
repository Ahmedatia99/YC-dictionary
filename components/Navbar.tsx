import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus,LogOut } from 'lucide-react';

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="px-4 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/images/logo.png" alt="logo" width={144} height={30} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">create</span>
                <BadgePlus className="size-6 sm:hidden text-red-500" />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="cursor-primary flex items-center">
                <span className="max-sm:hidden">Logout</span>
                <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>

              <Link href={`user/${session?.id}`}>
                <Image src={session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-200"
                />
              </Link>
            </>
          ) : (
            <>
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <button type="submit">
                  <span className="cursor-pointer">Login</span>
                </button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
