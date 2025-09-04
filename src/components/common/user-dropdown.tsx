// "use client"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/common/switch"
// import { User, FolderOpen, Share2, LogOut, Sun, Moon } from "lucide-react"
// import { useTheme } from "./theme-provider"

// export function UserDropdown() {
//   const { theme, setTheme } = useTheme()

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark")
//   }

//   const handleMenuAction = (action: string) => {
//     switch (action) {
//       case "compartilhados":
//         alert("Compartilhados comigo - funcionalidade em desenvolvimento")
//         break
//       case "signout":
//         alert("Sign out - funcionalidade em desenvolvimento")
//         break
//       default:
//         break
//     }
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-10 w-10 p-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
//           title="Menu do usuário"
//         >
//           <User className="h-5 w-5" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80 p-0">
//         {/* Main Menu Items */}
//         <div className="py-2">
//           <DropdownMenuItem onClick={() => handleMenuAction("projetos")} className="px-4 py-2 cursor-pointer">
//             <FolderOpen className="mr-3 h-4 w-4 text-blue-600" />
//             <span className="text-blue-600">Projetos</span>
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => handleMenuAction("compartilhados")} className="px-4 py-2 cursor-pointer">
//             <Share2 className="mr-3 h-4 w-4 text-blue-600" />
//             <span className="text-blue-600">Compartilhados comigo</span>
//           </DropdownMenuItem>
//         </div>

//         <DropdownMenuSeparator />

//         {/* Sign Out */}
//         <div className="py-2">
//           <DropdownMenuItem onClick={() => handleMenuAction("signout")} className="px-4 py-2 cursor-pointer">
//             <LogOut className="mr-3 h-4 w-4 text-blue-600" />
//             <span className="text-blue-600">Sign out</span>
//           </DropdownMenuItem>
//         </div>

//         <DropdownMenuSeparator />

//         {/* Dark Mode Toggle */}
//         <div className="p-4">
//           <div className="flex items-center justify-center gap-3">
//             <Sun className="h-4 w-4 text-gray-500" />
//             <Switch
//               checked={theme === "dark"}
//               onCheckedChange={toggleTheme}
//               className="data-[state=checked]:bg-blue-600"
//             />
//             <Moon className="h-4 w-4 text-gray-500" />
//           </div>
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/common/switch"
import { User, LogOut, Sun, Moon, Share2 } from "lucide-react"
import { useTheme } from "./theme-provider"

import logo from '/logo-menu.png'
import { useNavigate } from "react-router-dom"


export function UserDropdown() {
  const { theme, setTheme } = useTheme()
  const [userEmail] = useState("joseferreira@tcepe.tc.br")
  const [userName] = useState("José Ferreira")

  const navigate = useNavigate()


  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSignOutAll = () => {
    navigate("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex rounded p-2 border items-center gap-2 cursor-pointer">
          {/* Logo TCE-PE */}
          <div className="flex items-center justify-center flex-shrink-0">
             <img src={logo} alt="Aurora Minutas Logo" width={64} />
          </div>

          {/* User Avatar */}
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
            title="Menu do usuário"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="p-4 text-center border-b border-gray-200 dark:border-gray-700">
          

          {/* Profile Section with TCE-PE Logo */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative flex items-center justify-center">
              {/* User Avatar */}
              <div className="relative z-10">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            <div className="text-xl font-medium text-gray-900 dark:text-white">Olá, {userName.split(" ")[0]}!</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{userEmail}</div>

          </div>
        </div>

        {/* Account Management */}
        <div className="p-4">

          <div
            className="flex items-center space-x-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2"
            onClick={handleSignOutAll}
          >
            <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Deslogar</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Main Menu Items */}
        <div className="p-4">
          {/* <Button
            onClick={() => alert("Compartilhados comigo - funcionalidade em desenvolvimento")}
            variant="ghost"
            className="px-4 py-2 cursor-pointer text-blue-600"
          >
            <Share2 className="mr-3 h-4 w-4 text-blue-600" />
            Compartilhados comigo
          </Button> */}


          <div
            className="flex items-center space-x-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2"
            onClick={() => alert("Compartilhados comigo - funcionalidade em desenvolvimento")}
          >
            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Compartilhados comigo</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Dark Mode Toggle */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Modo escuro</span>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-gray-500" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-blue-600"
              />
              <Moon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Footer */}
        <div className="p-4 text-center">
          <div className="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
