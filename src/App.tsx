import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/common/theme-provider"
import { Layout } from "./components/layout/layout"
import "./App.css"
import { LandingPage } from "./components/layout/landing-page"
import { NotFoundPage } from "./components/layout/not-found-page"
import { HomePage } from "./components/layout/home-page"
import { DocumentosContent } from "./presentation/components/documentos/documentos-content"


function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
        <Router basename="/minutas">
          <Routes>
            {/* Rota para a landing page (sem providers) */}
            <Route path="/" element={<LandingPage />} />

            {/* Rota 404 (fora do layout do sistema) */}
            <Route path="/404" element={<NotFoundPage />} />

            {/* Rotas do sistema (com todos os providers e layout) */}
            <Route path="*" element={
                    <SystemRoutesWithLayout />
            } />
          </Routes>
        </Router>
    </ThemeProvider>
  )
}

// Componente para rotas do sistema COM layout
function SystemRoutesWithLayout() {
  // Verificar se a rota atual é 404 e redirecionar
  if (location.pathname === "/404") {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      <Routes>
        {/* Rota para a home page */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/documentos" element={<DocumentosContent />} />

        {/* Redirecionar rotas desconhecidas para 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  );
}

export default App