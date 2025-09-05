import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para limpar o texto
export const cleanText = (text: string): string => {
  if (!text) return text

  // Remove ![](#) do início e fim
  let cleanedText = text.replace(/^!\[\]\(#\)/, "").replace(/!\[\]\(#\)$/, "") //text.replace(/^!\[\]$$#$$/, "").replace(/!\[\]$$#$$$/, "")

  // Remove múltiplas quebras de linha, mantendo apenas uma
  cleanedText = cleanedText.replace(/\n{2,}/g, "\n")

  // Remove quebras de linha no início e fim
  cleanedText = cleanedText.trim()

   // Transforma URLs em links clicáveis
  cleanedText = cleanedText.replace(
    /https?:\/\/[^\s]+/g,
    (url) => `<a href="${url}" class="text-blue-500 hover:underline font-bold" target="_blank">${url}</a>`
  )

  return cleanedText
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Método moderno (HTTPS/localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback para HTTP
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return success;
  } catch (error) {
    console.error('Erro na cópia:', error);
    return false;
  }
};

export const renderMarkdown = (text: string): string => {
  if (!text) return '';
  
  const lines = text.split('\n');
  let output = '';
  let inList: false | 'ol' | 'ul' = false;
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    
    const paragraphContent = paragraphLines.join('<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\[([^\]]+)\]/g, '<span class="bg-yellow-100 px-2 py-1 rounded text-sm font-medium">[Campo: $1]</span>')
      .replace(/`(.*?)`/g, '<span class="bg-gray-200 px-1.5 py-1 rounded font-medium">$1</span>'); // Novo destaque para backticks

    output += `<p class="mb-4 leading-relaxed text-gray-700">${paragraphContent}</p>\n`;
    paragraphLines = [];
  };

  const formatInline = (content: string): string => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\[([^\]]+)\]/g, '<span class="bg-yellow-100 px-2 py-1 rounded text-sm font-medium">[Campo: $1]</span>')
      .replace(/`(.*?)`/g, '<span class="bg-gray-200 px-1.5 py-1 rounded font-medium">$1</span>'); // Novo destaque para backticks
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Títulos
    if (/^#{1,6} /.test(trimmedLine)) {
      flushParagraph();
      
      const level = Math.min(6, (trimmedLine.match(/#/g) || []).length);
      const content = trimmedLine.replace(/^#+ /, '');
      
      const classes = [
        'text-3xl font-extrabold mb-6 text-gray-900',         // h1
        'text-2xl font-bold mb-4 text-gray-800 mt-8',        // h2
        'text-xl font-semibold mb-3 text-gray-700 mt-6',     // h3
        'text-lg font-medium mb-3 text-gray-600 mt-4',       // h4
        'text-lg font-normal mb-3 text-gray-500 mt-4',        // h5
        'text-base font-light mb-3 text-gray-500 mt-4'        // h6
      ];
      
      output += `<h${level} class="${classes[level - 1]}">${formatInline(content)}</h${level}>\n`;
    }
    
    // Divisor - linha contínua de 2px (modificado)
    else if (/^---+$/.test(trimmedLine)) {
      flushParagraph();
      if (inList) {
        output += `</${inList}>\n`;
        inList = false;
      }
      output += '<hr class="my-8 border-t-2 border-gray-300">\n'; // Linha de 2px
    }
    
    // Listas
    else if (/^(\d+)\. /.test(trimmedLine)) {
      flushParagraph();
      const content = trimmedLine.replace(/^(\d+)\. /, '');
      
      if (inList !== 'ol') {
        if (inList) output += `</${inList}>\n`;
        output += '<ol class="list-decimal pl-8 mb-4">\n';
        inList = 'ol';
      }
      output += `<li class="mb-2">${formatInline(content)}</li>\n`;
    }
    else if (/^- /.test(trimmedLine)) {
      flushParagraph();
      const content = trimmedLine.replace(/^- /, '');
      
      if (inList !== 'ul') {
        if (inList) output += `</${inList}>\n`;
        output += '<ul class="list-disc pl-8 mb-4">\n';
        inList = 'ul';
      }
      output += `<li class="mb-2">${formatInline(content)}</li>\n`;
    }
    
    // Linha vazia
    else if (trimmedLine === '') {
      flushParagraph();
      if (inList) {
        output += `</${inList}>\n`;
        inList = false;
      }
    }
    
    // Texto normal
    else {
      if (inList) {
        output += `</${inList}>\n`;
        inList = false;
      }
      paragraphLines.push(line);
    }
  }

  flushParagraph();
  if (inList) output += `</${inList}>\n`;

  return output;
};

export const formatTimestamp = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Hoje";
      if (diffDays === 1) return "Há 1 dia";
      if (diffDays < 7) return `Há ${diffDays} dias`;
      if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return "Data não disponível";
    }
  }