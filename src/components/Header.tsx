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
            <Link href="/api/auth/signout" className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600">Logout</Link>
          </div>
        ) : (
          <div className="flex">
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#features" className="hover:text-gray-600">機能</Link>
              <Link href="#pricing" className="hover:text-gray-600">料金</Link>
              <Link href="#faq" className="hover:text-gray-600">FAQ</Link>
              <Link href="/api/auth/signin" className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600">
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
