"use client"

import * as React from "react"

import { LofiDialog } from "@/components/lofi-dialog"

export function DialogWrapper() {
  const [defaultTab, setDefaultTab] = React.useState("")

  return <LofiDialog defaultTab={defaultTab} setDefaultTab={setDefaultTab} />
}
