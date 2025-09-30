import { HttpClient } from "./HttpClient";
import axios from "axios";

// 3. MÓDULOS DE BAIXO NÍVEL (implementam as abstrações)
export class AxiosAdapter implements HttpClient {

  delete(url: string, config?: any): Promise<any> {
      throw new Error("Method not implemented.");
  }

  async post(url: string, data: any, config?: any): Promise<any> {
    const response = await axios.post(url, data, config);
    return response.data;
  }

  async get(url: string, config?: any): Promise<any> {
    const response = await axios.get(url, config);
    return response.data;
  }
  
}