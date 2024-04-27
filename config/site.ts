import { NavItem } from "@/types"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "BajajRAG",
  description: "Unlock the secrets of any website",
  mainNav: [],
  links: {
    twitter: "https://twitter.com/",
    github: "https://github.com/",
  },
}
