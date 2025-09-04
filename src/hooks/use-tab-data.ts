// // hooks/use-tab-data.ts
// "use client"

// import { useControleEtce } from "@/controllers/useControleEtce";

// import type {
//   ResultadoData,
//   Inidoneidade,
//   QuadroLimiteArea,
//   Considerando,
//   Medida,
//   Encaminhamento
// } from "@/types/minutas-types"

// export function useTabData() {
//   const {
//     getResultados,
//     getInidoneidade,
//     getQuadroLimites,
//     getConsiderandos,
//     getMedidas,
//     getEncaminhamentos,
//     getDadosEstruturados
//   } = useControleEtce()

//   return {
//     getResultados: (): ResultadoData[] => getResultados(),
//     getInidoneidade: (): Inidoneidade[] => getDadosEstruturados().inidoneidade || [],
//     getQuadroLimites: (): QuadroLimiteArea[] => getDadosEstruturados().quadroLimites?.areas || [],
//     getConsiderandos: (): Considerando[] => getConsiderandos(),
//     getMedidas: (): Medida[] => getDadosEstruturados().medidas || [],
//     getEncaminhamentos: (): Encaminhamento[] => getEncaminhamentos()
//   }
// }

// hooks/use-tab-data.ts (atualizado)
"use client"

 import { useControleEtce } from "@/controllers/useControleEtce";

 import type {
  ResultadoData,
  Inidoneidade,
  QuadroLimiteArea,
  Considerando,
  Medida,
  Encaminhamento,
  MultaDebito
} from "@/types/minutas-types"

export function useTabData() {
  const {
    getResultados,
    getConsiderandos,
    getEncaminhamentos,
    getDadosEstruturados
  } = useControleEtce()

  const getMultaDebito = (): MultaDebito[] => {
    return getDadosEstruturados().multaDebito || []
  }

  return {
    getResultados: (): ResultadoData[] => getResultados(),
    getMultaDebito,
    getInidoneidade: (): Inidoneidade[] => getDadosEstruturados().inidoneidade || [],
    getQuadroLimites: (): QuadroLimiteArea[] => getDadosEstruturados().quadroLimites?.areas || [],
    getConsiderandos: (): Considerando[] => getConsiderandos(),
    getMedidas: (): Medida[] => getDadosEstruturados().medidas || [],
    getEncaminhamentos: (): Encaminhamento[] => getEncaminhamentos()
  }
}