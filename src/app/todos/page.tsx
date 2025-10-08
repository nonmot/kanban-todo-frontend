"use client"
import TodoList from "@/components/TodoList"
import { SessionProvider } from "next-auth/react"

export default function Page() {
  return (
    <SessionProvider>
      <div className="container mx-auto">
        <TodoList />
      </div>
    </SessionProvider>
  )
}
