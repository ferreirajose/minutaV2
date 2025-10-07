import { ResponseData } from "@/interface/documentos-base";

export default interface DocumentGateway {
  uploadAndProcess(file: File): Promise<ResponseData>;
}