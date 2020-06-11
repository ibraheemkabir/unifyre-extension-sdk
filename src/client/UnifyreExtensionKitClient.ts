import {HexString, Injectable, JsonRpcRequest, Network, ValidationUtils} from "ferrum-plumbing";
import {ServerApi} from "../common/ServerApi";
import {WalletJsonRpcClient} from "./WalletJsonRpcClient";
import {AppUserProfile} from "./model/AppUserProfile";
import {SIGNABLE_MESSAGE_TYPES, SignableMessageType} from "../common/model/SignableMessages";
import {SendMoneyResponse, SignedMessageResponse} from "../common/model/Types";
import { AppLinkRequest } from "./model/AppLink";

function getAddressForCurrency(prof: AppUserProfile, currency: string, accountGroupId?: string): string|undefined {
  if (prof.accountGroups.length === 0) {
    return undefined;
  }
  const ag = !!accountGroupId ? prof.accountGroups.find(g => g.id === accountGroupId) : prof.accountGroups[0];
  if (!ag) {
    return undefined;
  }
  return (ag.addresses[currency] || {} as any).address;
}

export class UnifyreExtensionKitClient implements Injectable {
  private _userProfile: AppUserProfile|undefined;
  constructor(
    private api: ServerApi,
    private walletProxy: WalletJsonRpcClient,
    private appId: string,
  ) {}

  __name__(): string { return 'UnifyreExtensionKitClient'; }

  async signInWithToken(token: string) {
    await this.api.setBearerToken(token);
    this._userProfile = await this.api.get('extension/userProfile', {}) as AppUserProfile
  }

  getUserProfile() {
    ValidationUtils.isTrue(!!this._userProfile, 'You must first sign in');
    return this._userProfile!;
  }

  async createLinkObject<T>(linkObject: AppLinkRequest<T>): Promise<string> {
    ValidationUtils.isTrue(!!linkObject, '"linkObject" must be provided');
    ValidationUtils.isTrue(!!linkObject.data && typeof linkObject.data === 'object',
      '"linkObject.data" must be provided and be an object');
    ValidationUtils.isTrue(!!linkObject.message, '"message" must be provided');
    ValidationUtils.isTrue(!!linkObject.imageMainLine, '"imageMainLine" must be provided');
    ValidationUtils.isTrue(!!linkObject.imageSecondLine, '"imageSecondLinke" must be provided');
    const res = await this.api.post(`extensions/createLink`, {...linkObject, appId: this.appId}) as any;
    ValidationUtils.isTrue(!!res && !!res.objectId, "Error creating link. Unsuccessful");
    return res.objectId;
  }

  async getLinkObject<T>(linkId: string) {
    ValidationUtils.isTrue(!!linkId, '"linkId" must be provided');
    const res = await this.api.get(`extensions/getLink/${linkId}`, {}) as T;
    ValidationUtils.isTrue(!!res, "Error getting link. Unsuccessful");
    return res;
  }

  async sendMoney(toAddress: string, currency: string, amount: string, accountGroupId?: string): Promise<SendMoneyResponse> {
    const prof = this.getUserProfile();
    const fromAddress = getAddressForCurrency(prof, currency, accountGroupId);
    const res = await this.walletProxy.call(this.appId, {
      command: 'REQUEST_SEND_MONEY',
      data: {
        userId: prof.userId,
        appId: prof.appId,
        currency,
        fromAddress,
        toAddress,
        amount,
        accountGroupId,
      } as any,
    } as JsonRpcRequest);
    return res.data as SendMoneyResponse;
  }

  async sign(network: Network,
             messageHex: HexString,
             messageType: SignableMessageType,
             gasLimit?: string,
             description?: string,
             accountGroupId?: string): Promise<SignedMessageResponse> {
    ValidationUtils.isTrue(!!messageHex, '"message" must be provided');
    ValidationUtils.isTrue(SIGNABLE_MESSAGE_TYPES.has(messageType), 'Invalid "messageType"');
    ValidationUtils.isTrue(
      messageType !== 'CUSTOM_TRANSACTION' || !!gasLimit, '"gasLimit" is requried for custom transactions');
    const prof = this.getUserProfile();
    const res = await this.walletProxy.call(this.appId, {
      command: messageType === 'PLAIN_TEXT' ? 'REQUEST_SIGN_CLEAN_MESSAGE' : 'REQUEST_SIGN_CUSTOM_MESSAGE',
      data: {
        network,
        userId: prof.userId,
        appId: prof.appId,
        accountGroupId,
        messageHex,
        messageType,
        description,
      } as any,
    } as JsonRpcRequest);
    return res.data as SignedMessageResponse;
  }

  async getTransaction(transactionId: string): Promise<any> {
    return this.api.get(`extensions/transaction/${transactionId}`, {});
  }
}