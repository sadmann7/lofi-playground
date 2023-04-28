"use client"

import * as React from "react"

import { Ambient } from "@/components/ambient"
import { LofiTabs } from "@/components/lofi-tabs"
import { Pomodoro } from "@/components/pomodoro"
import { TodoList } from "@/components/todo-list"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const tabs = [
  { title: "Todo", content: <TodoList /> },
  {
    title: "Pomodoro",
    content: <Pomodoro />,
  },
  {
    title: "Ambient",
    content: <Ambient />,
  },
]

export function LofiDialog() {
  const [defaultTab, setDefaultTab] = React.useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {tabs.map((tab, i) => (
            <Button
              key={i}
              variant="outline"
              onClick={() => setDefaultTab(tab.title)}
            >
              {tab.title}
              <span className="sr-only">{tab.title}</span>
            </Button>
          ))}
        </div>
      </DialogTrigger>
      <DialogContent>
        <LofiTabs defaultTab={defaultTab} tabs={tabs} />
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when {`you're`} done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
