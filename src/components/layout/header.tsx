"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "../common/user-dropdown"
import logo from '/Aurora-logo.svg'

interface HeaderProps {
  isCollapsed: boolean
  onToggleSidebar: () => void
}

export function Header({ isCollapsed, onToggleSidebar }: HeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
              title="Expandir sidebar"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
         
          <div className="flex items-center space-x-3">
             <img src={logo} alt="Aurora Minutas Logo" width={32} />
             <span className="font-bold text-xl dark:text-white">Aurora Minutas</span>
           </div>
        </div>

        <div className="flex items-center">
          <UserDropdown />
        </div>
      </div>
    </div>
  )
}
