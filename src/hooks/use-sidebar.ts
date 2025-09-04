"use client"

import { useState } from "react"

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  const collapseSidebar = () => {
    setIsCollapsed(true)
  }

  const expandSidebar = () => {
    setIsCollapsed(false)
  }

  return {
    isCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  }
}
