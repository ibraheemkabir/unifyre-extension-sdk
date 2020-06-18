import { Injectable, Network } from "ferrum-plumbing";
import { ServerApi } from "../common/ServerApi";
import { WalletJsonRpcClient } from "./WalletJsonRpcClient";
import { AppUserProfile } from "./model/AppUserProfile";
import { SendMoneyResponse, CustomTransactionCallRequest } from "../common/model/Types";
import { AppLinkRequest } from "./model/AppLink";
import { RequestSigner } from "src/crypto/RequestSigner";
export declare class UnifyreExtensionKitClient implements Injectable {
    private api;
    private walletProxy;
    private appId;
    private requestSigner?;
    private _userProfile;
    constructor(api: ServerApi, walletProxy: WalletJsonRpcClient, appId: string, requestSigner?: RequestSigner | undefined);
    __name__(): string;
    setToken(token: string): Promise<void>;
    signInWithToken(token: string): Promise<void>;
    getUserProfile(): AppUserProfile;
    createLinkObject<T>(linkObject: AppLinkRequest<T>): Promise<string>;
    getLinkObject<T>(linkId: string): Promise<T>;
    sendMoneyAsync(toAddress: string, currency: string, amount: string, accountGroupId?: string): Promise<string>;
    getSendMoneyResponse(requestId: string): Promise<SendMoneyResponse>;
    sendTransactionAsync(network: Network, transactions: CustomTransactionCallRequest[]): Promise<string>;
    getSendTransactionResponse(requestId: string): Promise<SendMoneyResponse[]>;
    getTransaction(transactionId: string): Promise<any>;
}
//# sourceMappingURL=UnifyreExtensionKitClient.d.ts.map