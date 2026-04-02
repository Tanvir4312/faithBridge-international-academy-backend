export interface ITErrorSources {
  path: string;
  message: string;
}

export interface ITErrorResponse {
  statusCode?: number;
  message: string;
  errorSources: ITErrorSources[];
  error?: unknown;
  success: boolean;
  stack?: string;
}
