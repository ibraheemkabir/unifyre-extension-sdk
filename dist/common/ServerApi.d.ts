import { Injectable, JsonStorage, LoggerFactory } from "ferrum-plumbing";
import { AuthenticationContext } from "./AuthenticationContext";
export declare class ServerApiHeaders {
    [key: string]: string | number;
}
export declare class ServerApiError extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string);
    static translate(e: string): string;
    static fromError(e: Object): string;
    static stringify(e: Error): string;
    private static cleanError;
}
export interface ServerApiCustomizer {
    startMetric(command: string): any;
    endMetric(metric: any): void;
    getCustomHeaders(command: string): any;
    processCustomResult(res: any): Promise<'retry' | 'ok'>;
}
export declare class ServerApi implements Injectable {
    private storage;
    private context;
    private host;
    private customizer;
    private log;
    constructor(storage: JsonStorage, loggerFactory: LoggerFactory, context: AuthenticationContext, host: string, customizer?: ServerApiCustomizer);
    __name__(): string;
    /**
     * Authenticate user using provided token
     */
    setBearerToken(token: string): Promise<void>;
    post(command: string, data: Object, extraHeaders?: ServerApiHeaders): Promise<Object>;
    get(command: string, args: Object, extraHeaders?: ServerApiHeaders): Promise<Object>;
    private fetchUrl;
}
//# sourceMappingURL=ServerApi.d.ts.map