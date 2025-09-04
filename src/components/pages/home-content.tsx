import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { FileUp, Pencil, FileCheck, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import logo from '@/assets/Aurora-logo.svg';


export function HomeContent() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Aurora Minutas Logo"
            width={300}
            height={100}
            className="h-24 w-auto"
          />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Aurora Minutas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <FileUp className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Adicione Contexto</h2>
              <p className="text-muted-foreground">
                Faça upload dos documentos do processo e enriqueça o contexto com modelos, jurisprudência e resultados
                de pesquisa web.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Pencil className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Gere a Minuta</h2>
              <p className="text-muted-foreground">
                Descreva o que você precisa e deixe o Aurora Minutas criar uma minuta personalizada com base no contexto
                fornecido.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Revise e Aprimore</h2>
              <p className="text-muted-foreground">
                Edite e aprimore a minuta gerada com a ajuda da IA, que pode sugerir melhorias e fazer correções.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center mb-16">
        <Button size="lg" className="px-8 py-6 rounded-full text-lg mb-4" asChild>
          <Link to="/documentos">
            <span className="mr-2">Começar</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
