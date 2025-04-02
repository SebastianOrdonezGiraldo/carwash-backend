// Este archivo solo se usará si no se pueden cargar las tipificaciones oficiales
declare module 'express' {
    import { EventEmitter } from 'events';
    import { Server } from 'http';
  
    export interface Request {
      body: any;
      params: any;
      query: any;
      [key: string]: any;
    }
  
    export interface Response {
      status(code: number): Response;
      send(body: any): Response;
      json(body: any): Response;
      [key: string]: any;
    }
  
    export interface Application {
      use(...args: any[]): Application;
      get(path: string, ...handlers: any[]): Application;
      post(path: string, ...handlers: any[]): Application;
      put(path: string, ...handlers: any[]): Application;
      delete(path: string, ...handlers: any[]): Application;
      patch(path: string, ...handlers: any[]): Application;
      listen(port: number, callback?: () => void): Server;
      [key: string]: any;
    }
  
    export interface Router {
      use(...args: any[]): Router;
      get(path: string, ...handlers: any[]): Router;
      post(path: string, ...handlers: any[]): Router;
      put(path: string, ...handlers: any[]): Router;
      delete(path: string, ...handlers: any[]): Router;
      patch(path: string, ...handlers: any[]): Router;
      [key: string]: any;
    }
  
    function express(): Application;
    namespace express {
      export function Router(): Router;
      export function json(): any;
      export function urlencoded(options: any): any;
      export function static(path: string): any;
    }
  
    export default express;
  }