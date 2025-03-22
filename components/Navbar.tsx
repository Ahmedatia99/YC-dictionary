import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
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
                <span>create</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="cursor-pointer">
                  <span>Logout</span>
                </button>
              </form>

              <Link href={`user/${session?.id}`}>
                <span>{session?.user?.name}</span>
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
