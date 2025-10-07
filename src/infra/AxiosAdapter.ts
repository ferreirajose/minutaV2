// AxiosAdapter.ts
import type HttpClient from "./HttpClient";
import axios from "axios";

export default class AxiosAdapter implements HttpClient {
  async get<T = any>(url: string): Promise<T> {
    const response = await axios.get<T>(url);
    return response.data;
  }

  async post<T = any>(url: string, body: any): Promise<T> {
    const response = await axios.post<T>(url, body);
    return response.data;
  }

  async delete<T = any>(url: string): Promise<T> {
    const response = await axios.delete<T>(url);
    return response.data;
  }

  async put<T = any>(url: string, body: any): Promise<T> {
    const response = await axios.put<T>(url, body);
    return response.data;
  }

  async patch<T = any>(url: string, body: any): Promise<T> {
    const response = await axios.patch<T>(url, body);
    return response.data;
  }
}
