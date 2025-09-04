"use client"

import type React from "react"

import { Navigation } from "./navigation"
import { Header } from "./header"
import { useSidebar } from "@/hooks/use-sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 overflow-auto">
        <Header isCollapsed={isCollapsed} onToggleSidebar={toggleSidebar} />
        <div className="p-6 bg-gray-50 dark:bg-gray-900">{children}</div>
      </div>
    </div>
  )
}