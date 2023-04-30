import type { LucideIcon } from "lucide-react"

export type SessionUser = {
  id: string
} & {
  name?: string | null
  email?: string | null
  image?: string | null
}

export type Sound = {
  title: string
  href: string
  icon: LucideIcon
}
