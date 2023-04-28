import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import LoginButton from "@/components/login-button"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <section className="container flex min-h-screen w-full max-w-xl flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="w-full max-w-xs">
        <h1 className="mb-4 text-center text-3xl font-bold">Sign in</h1>
        <LoginButton />
      </div>
    </section>
  )
}
