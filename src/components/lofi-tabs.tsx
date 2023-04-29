import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LofiTabsProps {
  defaultTab?: string
  tabs: {
    title: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    content: React.ReactNode
  }[]
}

export function LofiTabs({ defaultTab, tabs }: LofiTabsProps) {
  return (
    <Tabs defaultValue={defaultTab ?? tabs[0]?.title}>
      <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent px-6 pt-6">
        {tabs.map((tab, i) => (
          <TabsTrigger
            key={i}
            value={tab.title}
            className="rounded-none border-b-2 py-2 data-[state=active]:border-b-foreground data-[state=active]:bg-transparent"
          >
            {tab.icon && (
              <tab.icon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={i} value={tab.title} className="py-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
