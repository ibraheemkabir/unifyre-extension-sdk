import { Injectable, JsonRpcRequest, HexString } from "ferrum-plumbing";
export declare class RequestSigner implements Injectable {
    private privateKey?;
    constructor(privateKey?: string | undefined);
    __name__(): string;
    signProxyRequest(req: JsonRpcRequest): JsonRpcRequest;
    verifyProxyRequest(publicKey: HexString, req: JsonRpcRequest): boolean;
    private prepRequest;
}
//# sourceMappingURL=RequestSigner.d.ts.map