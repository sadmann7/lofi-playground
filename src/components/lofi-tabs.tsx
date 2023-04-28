import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LofiTabsProps {
  defaultTab?: string
  tabs: {
    title: string
    content: React.ReactNode
  }[]
}

export function LofiTabs({ defaultTab, tabs }: LofiTabsProps) {
  return (
    <Tabs defaultValue={defaultTab ?? tabs[0]?.title}>
      <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent">
        {tabs.map((tab, i) => (
          <TabsTrigger
            key={i}
            value={tab.title}
            className="rounded-none border-b-2 py-2 data-[state=active]:border-b-foreground data-[state=active]:bg-transparent"
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={i} className="mt-3" value={tab.title}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
