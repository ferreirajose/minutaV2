// // FetchAdapter.ts
// import HttpClient, { HttpConfig } from "./HttpClient";

// export default class FetchAdapter implements HttpClient {
//   private defaultConfig: Partial<HttpConfig> = {};

//   constructor(defaultConfig?: Partial<HttpConfig>) {
//     if (defaultConfig) {
//       this.defaultConfig = defaultConfig;
//     }
//   }

//   async get<T = any>(url: string, config?: HttpConfig): Promise<T> {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: this.mergeHeaders(config?.headers),
//       ...this.mergeConfig(config)
//     });
//     return this.handleResponse<T>(response);
//   }

//   async post<T = any>(url: string, body: any, config?: HttpConfig): Promise<T> {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: this.mergeHeaders(config?.headers),
//       body: this.prepareBody(body, config?.headers?.['Content-Type']),
//       ...this.mergeConfig(config)
//     });
//     return this.handleResponse<T>(response);
//   }

//   async delete<T = any>(url: string, config?: HttpConfig): Promise<T> {
//     const response = await fetch(url, {
//       method: 'DELETE',
//       headers: this.mergeHeaders(config?.headers),
//       ...this.mergeConfig(config)
//     });
//     return this.handleResponse<T>(response);
//   }

//   async put<T = any>(url: string, body: any, config?: HttpConfig): Promise<T> {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers: this.mergeHeaders(config?.headers),
//       body: this.prepareBody(body, config?.headers?.['Content-Type']),
//       ...this.mergeConfig(config)
//     });
//     return this.handleResponse<T>(response);
//   }

//   async patch<T = any>(url: string, body: any, config?: HttpConfig): Promise<T> {
//     const response = await fetch(url, {
//       method: 'PATCH',
//       headers: this.mergeHeaders(config?.headers),
//       body: this.prepareBody(body, config?.headers?.['Content-Type']),
//       ...this.mergeConfig(config)
//     });
//     return this.handleResponse<T>(response);
//   }

//   private async handleResponse<T>(response: Response): Promise<T> {
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const contentType = response.headers.get('content-type');
    
//     if (contentType && contentType.includes('application/json')) {
//       return response.json() as Promise<T>;
//     }
    
//     return response.text() as Promise<T>;
//   }

//   private mergeHeaders(configHeaders?: Record<string, string>): HeadersInit {
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       ...this.defaultConfig.headers,
//       ...configHeaders
//     };

//     // Remove Content-Type se for FormData (o browser define automaticamente)
//     if (headers['Content-Type'] && this.isFormData(headers['Content-Type'])) {
//       delete headers['Content-Type'];
//     }

//     return headers;
//   }

//   private mergeConfig(config?: HttpConfig): Partial<RequestInit> {
//     return {
//       ...this.defaultConfig,
//       ...config,
//       headers: undefined // Headers são tratados separadamente
//     };
//   }

//   private prepareBody(body: any, contentType?: string): BodyInit | null {
//     if (!body) return null;

//     // Se for FormData, retorna diretamente (o browser cuida do Content-Type)
//     if (body instanceof FormData) {
//       return body;
//     }

//     // Se for Blob ou ArrayBuffer, retorna diretamente
//     if (body instanceof Blob || body instanceof ArrayBuffer) {
//       return body;
//     }

//     // Para outros tipos, converte para JSON se não especificado outro Content-Type
//     if (!contentType || contentType.includes('application/json')) {
//       return JSON.stringify(body);
//     }

//     // Para outros content types, retorna como string
//     return String(body);
//   }

//   private isFormData(contentType: string): boolean {
//     return contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded');
//   }
// }

// FetchAdapterSimplified.ts
import HttpClient, { HttpConfig } from "./HttpClient";

export default class FetchAdapter implements HttpClient {
  async get<T = any>(url: string, config?: HttpConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: config?.headers,
    });
    return this.handleResponse<T>(response);
  }

  async post<T = any>(url: string, body: any, config?: HttpConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: config?.headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T = any>(url: string, config?: HttpConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: config?.headers,
    });
    return this.handleResponse<T>(response);
  }

  async put<T = any>(url: string, body: any, config?: HttpConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: config?.headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async patch<T = any>(url: string, body: any, config?: HttpConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: config?.headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
}