import Header from "@/components/Header"
import { SessionProvider } from "next-auth/react"

export default async function TodosLayout({ children }: { children: React.ReactNode}) {
  return (
    <div className="container mx-auto">
      <Header />
      <SessionProvider>
        {children}
      </SessionProvider>
    </div>
  )
}
