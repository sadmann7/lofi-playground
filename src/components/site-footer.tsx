import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="w-full bg-background">
      <div className="container flex flex-col items-center justify-between space-y-1 border-t py-5 sm:h-16 sm:flex-row sm:py-0">
        <div className="text-center text-sm text-muted-foreground sm:text-base">
          Powered by{" "}
          <a
            aria-label="Navigate to Vercel's website"
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            Vercel
          </a>
        </div>
        <div>
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.twitter className="h-5 w-5 fill-current" />
              <span className="sr-only">Twitter</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}
