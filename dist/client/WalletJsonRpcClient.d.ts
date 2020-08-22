import { Injectable, JsonRpcRequest } from "ferrum-plumbing";
import { ServerApi } from "../common/ServerApi";
import { AsyncRequestRepeater } from "./AsyncRequestRepeater";
export declare class WalletJsonRpcClient implements Injectable {
    private api;
    private repeater;
    constructor(api: ServerApi, repeater: AsyncRequestRepeater);
    __name__(): string;
    /**
     * Asynchronously calls the wallet. Produces a response once a result is ready.
     * This may be done through polling or websockets, but the user sees this as a
     * simple request/response.
     */
    callAsync(req: JsonRpcRequest): Promise<string>;
    waitForResponse(requestId: string, timeout?: number): Promise<any>;
    jsonRpcRes(res: any): any;
}
//# sourceMappingURL=WalletJsonRpcClient.d.ts.map