"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const schema = z.object({
  pomodoro: z.string(),
  shortBreak: z.string(),
  longBreak: z.string(),
})
type Inputs = z.infer<typeof schema>
export function Pomodoro() {
  // react-hook-form
  const { register, handleSubmit, formState, control } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  return (
    <Tabs defaultValue="pomodoro" className="px-6">
      <TabsList className="grid w-full grid-cols-3 bg-transparent">
        <TabsTrigger
          value="pomodoro"
          className="data-[state=active]:bg-foreground data-[state=active]:text-background"
        >
          Pomodoro
        </TabsTrigger>
        <TabsTrigger
          value="shortBreak"
          className="data-[state=active]:bg-foreground data-[state=active]:text-background"
        >
          Short Break
        </TabsTrigger>
        <TabsTrigger
          value="longBreak"
          className="data-[state=active]:bg-foreground data-[state=active]:text-background"
        >
          Long Break
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pomodoro">Tab 1</TabsContent>
      <TabsContent value="shortBreak">Tab 2</TabsContent>
      <TabsContent value="longBreak">Tab 3</TabsContent>
      <div className="mx-auto flex w-60 items-center justify-center gap-2.5">
        <Button aria-label="Start timer" size="sm" className="flex-1">
          Start
        </Button>
        <Button aria-label="Reset timer" size="sm">
          Reset
        </Button>
        <Button aria-label="Edit timer" size="sm">
          Edit
        </Button>
      </div>
    </Tabs>
  )
}
