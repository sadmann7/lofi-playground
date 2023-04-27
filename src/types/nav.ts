export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}
