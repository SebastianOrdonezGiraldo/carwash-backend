// Este archivo solo se usará si no se pueden cargar las tipificaciones oficiales
declare module 'cors' {
    import { RequestHandler } from 'express';
  
    interface CorsOptions {
      origin?: boolean | string | RegExp | (string | RegExp)[] | Function;
      methods?: string | string[];
      allowedHeaders?: string | string[];
      exposedHeaders?: string | string[];
      credentials?: boolean;
      maxAge?: number;
      preflightContinue?: boolean;
      optionsSuccessStatus?: number;
    }
  
    function cors(options?: CorsOptions): RequestHandler;
    export = cors;
  }