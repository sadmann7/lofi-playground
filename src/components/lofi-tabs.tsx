import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LofiTabsProps {
  defaultTab?: string
  tabs: {
    title: string
    content: JSX.Element
  }[]
}

export function LofiTabs({ defaultTab, tabs }: LofiTabsProps) {
  return (
    <Tabs defaultValue={defaultTab ?? tabs[0]?.title}>
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((tab, i) => (
          <TabsTrigger key={i} value={tab.title}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={i} value={tab.title}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
