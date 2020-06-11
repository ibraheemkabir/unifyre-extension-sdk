import { HexString, Injectable, Network } from "ferrum-plumbing";
import { ServerApi } from "../common/ServerApi";
import { WalletJsonRpcClient } from "./WalletJsonRpcClient";
import { AppUserProfile } from "./model/AppUserProfile";
import { SignableMessageType } from "../common/model/SignableMessages";
import { SendMoneyResponse, SignedMessageResponse } from "../common/model/Types";
import { AppLinkRequest } from "./model/AppLink";
export declare class UnifyreExtensionKitClient implements Injectable {
    private api;
    private walletProxy;
    private appId;
    private _userProfile;
    constructor(api: ServerApi, walletProxy: WalletJsonRpcClient, appId: string);
    __name__(): string;
    signInWithToken(token: string): Promise<void>;
    getUserProfile(): AppUserProfile;
    createLinkObject<T>(linkObject: AppLinkRequest<T>): Promise<string>;
    getLinkObject<T>(linkId: string): Promise<T>;
    sendMoney(toAddress: string, currency: string, amount: string, accountGroupId?: string): Promise<SendMoneyResponse>;
    sign(network: Network, messageHex: HexString, messageType: SignableMessageType, gasLimit?: string, description?: string, accountGroupId?: string): Promise<SignedMessageResponse>;
    getTransaction(transactionId: string): Promise<any>;
}
//# sourceMappingURL=UnifyreExtensionKitClient.d.ts.map