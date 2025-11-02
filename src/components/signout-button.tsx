"use client"
import { signOut } from "next-auth/react"
 
export function SignOutButton() {
  return <button
    onClick={() => signOut({ redirectTo: '/' })}
    className="cursor-pointer block text-red-500 my-1"
  >Sign Out</button>
}
