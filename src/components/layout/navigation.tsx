"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FileText, LayoutTemplateIcon as Template, Scale, FileCheck, Menu, ChevronLeft, BookDashedIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import logo from '/Aurora-logo.svg'

const menuItems = [
  {
    id: "projetos",
    icon: BookDashedIcon,
    title: "Projetos",
    subtitle: "Projetos Minuta",
  },
  {
    id: "documentos",
    icon: FileText,
    title: "Documentos",
    subtitle: "Gestão de Arquivos",
  },
  {
    id: "modelos",
    icon: Template,
    title: "Modelos",
    subtitle: "Templates",
  },
  {
    id: "jurisprudencia",
    icon: Scale,
    title: "Jurisprudência",
    subtitle: "Base Jurídica",
  },
  {
    id: "minuta-final",
    icon: FileCheck,
    title: "Minuta Final",
    subtitle: "Finalização",
  },
  {
    id: "e-tce",
    icon: FileText,
    title: "E-TCE",
    subtitle: "Dados Estruturados",
    active: true,
  },
]

interface NavigationProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Navigation({ isCollapsed, onToggle }: NavigationProps) {

  const [, setIsOpen] = useState(false)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  
  const projectName = searchParams.get('projectName')
  const creation = searchParams.get('creation')

  const shouldBlockNavigation = false

  // Função para construir a URL com os parâmetros apropriados
  const buildHref = (itemId: string) => {
    const baseHref = `/${itemId}`
    
    if (projectName) {
      return `${baseHref}?projectName=${encodeURIComponent(projectName)}`
    }
    
    if (creation === 'true') {
      return `${baseHref}?creation=true`
    }
    
    return baseHref
  }

  // Função para lidar com o clique nos itens do menu
  const handleMenuItemClick = () => {

    setIsOpen(false);
  }

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
               <img src={logo} alt="Aurora Minutas Logo" width={32} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white truncate">Aurora</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Sistema Integrado</div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            disabled={shouldBlockNavigation}
          >
            {isCollapsed ? 
              <Menu className="w-4 h-4 text-gray-700 dark:text-gray-300" /> : 
              <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            }
          </Button>
        </div>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const href = buildHref(item.id)
            const isActive = location.pathname === `/${item.id}`
            
            return (
              <Link
                key={item.id}
                to={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  isCollapsed ? "justify-center" : "",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                  shouldBlockNavigation && "opacity-50 pointer-events-none cursor-not-allowed"
                )}
                title={isCollapsed ? item.title : ""}
                onClick={() => handleMenuItemClick}
                aria-disabled={shouldBlockNavigation}
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-current" />
                {!isCollapsed && (
                  <div className="min-w-0">
                    <div className="font-bold truncate">{item.title}</div>
                    <div className="text-xs truncate dark:text-gray-400">{item.subtitle}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}