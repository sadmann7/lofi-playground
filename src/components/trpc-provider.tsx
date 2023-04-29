"use client"

import type { PropsWithChildren } from "react"

import { api } from "@/lib/api-beta"

export function TRPCProvider({ children }: PropsWithChildren) {
  return <api.Provider>{children}</api.Provider>
}
