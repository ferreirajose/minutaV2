//import type { ResponseData } from './../../interface/documentos-base';
//import { MOCK_DATA_RESPONSE_GENERIC } from "./../../mock/index";
//import { ProjectService } from './../../service/project-service';
import type { DocumentosRepository } from "../../domain/repository/DocumentosRepository";
import type { ResponseData } from '@/interface/documentos-base';
import { FileProcessor } from './FileProcessorRepository';

export class UploadServiceRepository implements DocumentosRepository {

  constructor(
    private fileProcessor: FileProcessor,
  ) {}

  uploadAndProcess(file: File): Promise<ResponseData> {
    const data = this.fileProcessor.uploadAndProcess(file);
    console.log(data);
    return data;
  }

  viewOriginalFile(id: string): Promise<{ blob: Blob; filename: string; } | null> {
    throw new Error('Method not implemented.');
  }

  // viewOriginalFile(id: string): Promise<{ blob: Blob; filename: string; } | null> {
  //   throw new Error('Method not implemented.');
  // }
  // async uploadAndProcess(file: File): Promise<ResponseData> {
  //   return ProjectService.uploadAndProcess(file) // chamar a api
  //   // console.log(file, 'UploadServiceRepository')
  //   // const p: Promise<ResponseData> = new Promise((resolve, rejects) => {
  //   //   const mock = MOCK_DATA_RESPONSE_GENERIC;
  //   //   setTimeout(function () {
  //   //     resolve(mock);
  //   //   }, 1000);
  //   // });

  //   // return p;
  // }


  
}
