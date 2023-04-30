"use client"

import * as React from "react"
import type { Sound } from "@/types"

type AppContextType = {
  sounds: Sound[] | null
  setSounds: React.Dispatch<React.SetStateAction<Sound[] | null>>
}

const AppContext = React.createContext<AppContextType>({
  sounds: [],
  setSounds: () => null,
})

function useAppContext(): AppContextType {
  const context = React.useContext(AppContext)

  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider")
  }

  return context
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [sounds, setSounds] = React.useState<Sound[] | null>(null)

  return (
    <AppContext.Provider
      value={{
        sounds,
        setSounds,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider, useAppContext }
