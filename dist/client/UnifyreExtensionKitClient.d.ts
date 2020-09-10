import { Injectable, Network } from "ferrum-plumbing";
import { ServerApi } from "../common/ServerApi";
import { WalletJsonRpcClient } from "./WalletJsonRpcClient";
import { AppUserProfile } from "./model/AppUserProfile";
import { SendMoneyResponse, CustomTransactionCallRequest, CustomTransactionCallResponse } from "../common/model/Types";
import { AppLinkRequest } from "./model/AppLink";
import { RequestSigner } from "src/crypto/RequestSigner";
export declare abstract class UnifyreExtensionKitClient implements Injectable {
    constructor();
    __name__(): string;
    abstract setToken(token: string): Promise<void>;
    abstract signInWithToken(token: string): Promise<void>;
    abstract getUserProfile(): AppUserProfile;
    abstract createLinkObject<T>(linkObject: AppLinkRequest<T>): Promise<string>;
    abstract getLinkObject<T>(linkId: string): Promise<T>;
    abstract sendMoneyAsync(toAddress: string, currency: string, amount: string, accountGroupId?: string): Promise<string>;
    abstract getSendMoneyResponse(requestId: string): Promise<SendMoneyResponse>;
    abstract sendTransactionAsync(network: Network, transactions: CustomTransactionCallRequest[]): Promise<string>;
    abstract getSendTransactionResponse(requestId: string, timeout?: number): Promise<CustomTransactionCallResponse>;
    abstract getTransaction(transactionId: string): Promise<any>;
}
export declare class UnifyreExtensionKitClientImpl extends UnifyreExtensionKitClient {
    private api;
    private walletProxy;
    private appId;
    private requestSigner?;
    private _userProfile;
    constructor(api: ServerApi, walletProxy: WalletJsonRpcClient, appId: string, requestSigner?: RequestSigner | undefined);
    setToken(token: string): Promise<void>;
    signInWithToken(token: string): Promise<void>;
    getUserProfile(): AppUserProfile;
    createLinkObject<T>(linkObject: AppLinkRequest<T>): Promise<string>;
    getLinkObject<T>(linkId: string): Promise<T>;
    sendMoneyAsync(toAddress: string, currency: string, amount: string, accountGroupId?: string): Promise<string>;
    getSendMoneyResponse(requestId: string): Promise<SendMoneyResponse>;
    sendTransactionAsync(network: Network, transactions: CustomTransactionCallRequest[]): Promise<string>;
    getSendTransactionResponse(requestId: string, timeout?: number): Promise<CustomTransactionCallResponse>;
    getTransaction(transactionId: string): Promise<any>;
}
//# sourceMappingURL=UnifyreExtensionKitClient.d.ts.map