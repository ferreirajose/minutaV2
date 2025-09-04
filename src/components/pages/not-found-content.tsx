"use client"

import { Button } from "@/components/ui/button"
import { Home, AlertTriangle } from "lucide-react"
import logo from '/Aurora-logo.svg'

interface NotFoundProps {
  onGoHome: () => void
}

export default function NotFound({ onGoHome }: NotFoundProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-12">
          <div className="text-[200px] lg:text-[300px] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
            404
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Central Icon */}
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>

              {/* Orbiting Elements */}
              <div className="absolute -top-8 -right-8 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -bottom-8 -left-8 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="absolute top-0 -left-12 w-3 h-3 bg-green-500 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -top-6 right-0 w-5 h-5 bg-purple-500 rounded-full animate-pulse delay-500"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Oops! Página não encontrada
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A página que você está procurando pode ter sido movida, removida ou não existe. Mas não se preocupe, vamos
              te ajudar a encontrar o que você precisa!
            </p>
          </div>

          
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={onGoHome} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 group">
            <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Ir para Home
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            
            <div className="flex items-center space-x-3">
             <img src={logo} alt="Aurora Minutas Logo" width={32} />
             <span className="font-bold text-xl dark:text-white">Aurora Minutas</span>
           </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Se o problema persistir, entre em contato com o suporte técnico
          </p>
        </div>
      </div>
    </div>
  )
}
