import { HexString, Injectable, Network } from "ferrum-plumbing";
import { ServerApi } from "../common/ServerApi";
import { WalletJsonRpcClient } from "./WalletJsonRpcClient";
import { AppUserProfile } from "./model/AppUserProfile";
import { SignableMessageType } from "../common/model/SignableMessages";
import { SendMoneyResponse, SignedMessageResponse, CustomTransactionCallRequest } from "../common/model/Types";
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
    sendMoney(toAddress: string, currency: string, amount: string, accountGroupId?: string): Promise<SendMoneyResponse>;
    sendTransaction(network: Network, transactions: CustomTransactionCallRequest[]): Promise<SendMoneyResponse[]>;
    sign(network: Network, messageHex: HexString, messageType: SignableMessageType, description?: string, accountGroupId?: string): Promise<SignedMessageResponse>;
    getTransaction(transactionId: string): Promise<any>;
}
//# sourceMappingURL=UnifyreExtensionKitClient.d.ts.map