// Este archivo solo se usará si no se pueden cargar las tipificaciones oficiales
declare module 'pg' {
    export interface PoolConfig {
      connectionString?: string;
      ssl?: boolean | { rejectUnauthorized: boolean };
      max?: number;
      idleTimeoutMillis?: number;
      connectionTimeoutMillis?: number;
      user?: string;
      password?: string;
      host?: string;
      database?: string;
      port?: number;
      [key: string]: any;
    }
  
    export interface QueryResult {
      rows: any[];
      rowCount: number;
      command: string;
      oid: number;
      fields: any[];
    }
  
    export class Pool {
      constructor(config?: PoolConfig);
      connect(): Promise<any>;
      query(text: string, params?: any[]): Promise<QueryResult>;
      end(): Promise<void>;
    }
  }