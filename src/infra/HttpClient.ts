// HttpClient.ts
export default interface HttpClient {
  get<T = any>(url: string): Promise<T>;
  post<T = any>(url: string, body: any): Promise<T>;
  delete<T = any>(url: string): Promise<T>;
  put<T = any>(url: string, body: any): Promise<T>;
  patch<T = any>(url: string, body: any): Promise<T>;
}