export const LiveKitOptionsSymbol = Symbol('LiveKitOptionsSymbol');

export interface LiveKitOptions {
    apiUrl: string;
    apiKey: string;
    apiSecret: string;
}

export interface LiveKitAsyncOptions {
    useFactory: (...args: any[]) => Promise<LiveKitOptions> | LiveKitOptions;
    inject?: any[];
    imports?: any[];
}