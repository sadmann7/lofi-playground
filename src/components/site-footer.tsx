export function SiteFooter() {
  return (
    <footer className="w-full bg-background">
      <div className="container grid h-16 place-items-center space-y-1 border-t">
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
      </div>
    </footer>
  )
}
