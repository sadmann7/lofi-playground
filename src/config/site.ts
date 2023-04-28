export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Lofi Playground",
  description:
    "A collection of lofi music, and images to help you focus and relax.",
  url: "https://lofi-playground.vercel.app/",
  ogImage: "https://lofi-playground.vercel.app/og.png",
  mainNav: [
    {
      title: "Your Playgrounds",
      href: "/your-playgrounds",
    },
  ],
  links: {
    twitter: "https://twitter.com/sadmann17",
    github: "https://github.com/sadmann7/lofi-playground",
  },
}
