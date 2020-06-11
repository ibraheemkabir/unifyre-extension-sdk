import { Injectable } from "ferrum-plumbing";
import { ServerApi } from "../common/ServerApi";
import { WalletRemoteRequest, WalletRemoteResponse } from "./model/WalletRemoteRequest";
export declare class WalletRemoteRequestClient implements Injectable {
    private api;
    constructor(api: ServerApi);
    __name__(): string;
    getRequest(requestId: string): Promise<WalletRemoteRequest | undefined>;
    sendResponse(response: WalletRemoteResponse): Promise<boolean>;
    getAppLink(appId: string, walletAccountGroupId?: string, walletCurrency?: string, queryParams?: any): Promise<string | undefined>;
    getAppLinkFromLinkId(linkId: string, walletAccountGroupId?: string, walletCurrency?: string): Promise<string | undefined>;
}
//# sourceMappingURL=WalletRemoteRequestClient.d.ts.map