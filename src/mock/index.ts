import type { ResponseData } from "./../interface/documentos-base";

export const MOCK_DATA_RESPONSE_GENERIC: ResponseData = {
  success: true,
  data: {
    uuid_documento: "1234567890",
    arquivo_original: "documento_contrato.pdf",
    titulo_arquivo: "Contrato de Prestação de Serviços",
    extensao: "pdf",
    total_paginas: 3,
    total_tokens: 1200,
    paginas: [
      {
        fonte: "Calibri",
        numero_pagina: 1,
        quantidade_tokens: 400,
        texto: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem por objeto a prestação de serviços de consultoria técnica especializada, conforme termos descritos no anexo I.

CLÁUSULA SEGUNDA - DO PRAZO
O contrato vigorará pelo prazo de 12 meses, iniciando-se na data de sua assinatura.`,
      },
      {
        fonte: "Calibri",
        numero_pagina: 2,
        quantidade_tokens: 400,
        texto: `CLÁUSULA TERCEIRA - DO VALOR E PAGAMENTO
O valor total dos serviços é de R$ 50.000,00, parcelado em 12 vezes mensais de R$ 4.166,67.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES
As partes se obrigam ao cumprimento integral dos termos deste contrato, respeitando os prazos e condições estabelecidas.`,
      },
      {
        fonte: "Calibri",
        numero_pagina: 3,
        quantidade_tokens: 400,
        texto: `CLÁUSULA QUINTA - DA RESCISÃO
O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.

ASSINATURAS

Contratante: ___________________
Contratada: ___________________
Testemunhas: ___________________`,
      },
    ],
  },
};
