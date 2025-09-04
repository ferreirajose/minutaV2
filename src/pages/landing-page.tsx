"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Scale, Users, Database, FileCheck, Settings, ArrowRight, LogIn } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logo from '/Aurora-logo.svg';
import escritorio from '/escritorio.png';
import escritorio2 from '/escritorio2.png';

const features = [
  {
    id: "documentos",
    title: "Gestão de Documentos",
    description: "Organize e gerencie todos os seus documentos jurídicos de forma centralizada e segura.",
    icon: FileText,
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "bg-blue-600",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    id: "jurisprudencia",
    title: "Base Jurisprudencial",
    description: "Acesse uma vasta base de jurisprudências para fundamentar suas decisões técnicas.",
    icon: Scale,
    color: "gray",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    iconColor: "bg-gray-600",
    hoverColor: "group-hover:text-gray-600",
  },
  {
    id: "modelos",
    title: "Modelos Personalizados",
    description: "Crie e utilize modelos personalizados para agilizar a criação de minutas.",
    icon: Settings,
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "bg-blue-600",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    id: "interessados",
    title: "Gestão de Interessados",
    description: "Gerencie participantes e interessados nos processos de forma organizada.",
    icon: Users,
    color: "gray",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    iconColor: "bg-gray-600",
    hoverColor: "group-hover:text-gray-600",
  },
  {
    id: "dados",
    title: "Dados Estruturados",
    description: "Organize informações de forma estruturada para facilitar análises e relatórios.",
    icon: Database,
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "bg-blue-600",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    id: "minuta",
    title: "Minuta Final",
    description: "Gere minutas finais profissionais com base em todos os dados coletados.",
    icon: FileCheck,
    color: "gray",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    iconColor: "bg-gray-600",
    hoverColor: "group-hover:text-gray-600",
  },
]

export function LandingPage() {
  const navigate = useNavigate()

  const onLogin = () => {
    navigate("/home")
  }

  const onAccessSystem = () => {
    navigate("/home")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Aurora Minutas Logo"
            className="h-24 w-auto"
          />
        </div>

            {/* Login Button */}
            <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Login
              <LogIn className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"  />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background Meeting Room Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={escritorio}
            alt="Sala de reunião moderna"
            className="w-full h-full object-cover opacity-10 dark:opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/50 dark:from-gray-900/90 dark:via-gray-900/70 dark:to-gray-900/50"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  Crie Minutas
                  <span className="text-blue-600 block">Profissionais</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Gerencie e crie minutas técnicas com eficiência. O Aurora oferece todas as ferramentas necessárias
                  para documentos jurídicos e técnicos de alta qualidade.
                </p>
              </div>

              <Button
                onClick={onAccessSystem}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group shadow-lg"
              >
                Acessar Sistema
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Right Image - Keep the original office image but make it more prominent */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <img
                  src={escritorio2}
                  alt="Ambiente de trabalho moderno com múltiplos monitores"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Enhanced decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -right-8 w-24 h-24 bg-blue-400/15 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Recursos Principais</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Descubra todas as funcionalidades que tornam o Aurora a melhor escolha para gestão de minutas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.id}
                  className={`group ${feature.bgColor} border-0 hover:shadow-xl hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer overflow-hidden`}
                >
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 ${feature.iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300 ${feature.hoverColor}`}
                      >
                        {feature.title}
                      </h3>

                      {/* Description - Hidden by default, shown on hover */}
                      <div className="max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                        <p className="text-gray-600 dark:text-gray-300 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">Pronto para começar?</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Experimente o Aurora e transforme a forma como você cria e gerencia minutas. Sistema completo, intuitivo e
              confiável.
            </p>
            <Button
              onClick={onAccessSystem}
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold group"
            >
              Começar Agora
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo */}
            {/* <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">Au</span>
              </div>
              <div>
                <div className="font-bold text-white">Aurora</div>
                <div className="text-xs text-gray-400">Sistema Integrado</div>
              </div>
            </div> */}

            {/* Logo */}
            <div className="flex items-center">
            <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Aurora Minutas Logo"
            className="h-24 w-auto"
          />
        </div>
        </div>
{/* 
        <div className="flex items-center space-x-3">
             <img src={logo} alt="Aurora Minutas Logo" width={32} />
             <span className="font-bold text-xl dark:text-white">Aurora Minutas</span>
           </div> */}
            

            {/* Description */}
            <p className="text-gray-400 text-center max-w-md">
              Solução completa para gestão de minutas técnicas e jurídicas.
            </p>

            {/* Copyright */}
            <div className="pt-8 border-t border-gray-800 w-full text-center">
              <p className="text-gray-500 text-sm">2024 Aurora Sistema Integrado. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
