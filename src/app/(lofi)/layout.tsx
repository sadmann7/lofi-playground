import { prisma } from "@/server/db"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

interface LofiLayoutProps {
  children: React.ReactNode
}

export default async function LofiLayout({ children }: LofiLayoutProps) {
  const users = await prisma.user.findMany()
  console.log(users)

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
