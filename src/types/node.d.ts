// Este archivo solo se usará si no se pueden cargar las tipificaciones oficiales
declare namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV?: string;
      PORT?: string;
      DATABASE_URL?: string;
    }
  
    interface Process {
      env: ProcessEnv;
    }
  
    // Añade aquí más interfaces según sea necesario
  }
  
  declare var process: NodeJS.Process;