import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex items-center py-3">
      <h1 className="text-2xl font-bold">TODOs</h1>
      <div className="ml-auto">
        {session?.user ? (
          <div>
            <p>{session.user.name}</p>
            <Link href={"/api/auth/signout"}>Logout</Link>
          </div>
        ) : (
          <div>
            <Link href={"/api/auth/signin"}>Sign in</Link>
          </div>
        )}
      </div>
    </header>
  )
}
