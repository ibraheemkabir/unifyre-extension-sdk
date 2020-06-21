import {Injectable, ValidationUtils, HexString} from "ferrum-plumbing";
import {ServerApi} from "../common/ServerApi";
import {WalletRemoteRequest, WalletRemoteResponse} from "./model/WalletRemoteRequest";
import { RequestSigner } from '../crypto/RequestSigner';

export class InvalidRequestSignatureError extends Error { }

function createQueryString(queryParams: any) {
  return encodeURI(Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`).join('&'));
}

export class WalletRemoteRequestClient implements Injectable {
  constructor(private api: ServerApi) { }

  __name__(): string { return 'WalletRemoteRequestClient'; }

  async getRequest(requestId: string, publicKey?: string): Promise<WalletRemoteRequest|undefined> {
    ValidationUtils.isTrue(!!requestId, '"requestId" must be provided');
    const res = await this.api.get(`extension/walletProxy/getRequest/${requestId}`, {}) as any;
    if (!res) { return undefined; }
    if (!!publicKey) {
      const signableCommand = {
        command: res.method || res.command,
        params: [],
        data: res.data,
      };
      const signer = new RequestSigner();
      const verified = signer.verifyProxyRequest(publicKey, signableCommand);
      if (!verified) {
        throw new InvalidRequestSignatureError();
      }
    }
    const request = {
      appId: res.policyData.EXTENSION_APP_ID,
      requestId: res.requestId,
      requestType: res.method,
      request: res.data,
    } as WalletRemoteRequest;
    ValidationUtils.isTrue(!!request.appId, 'Retrieved request has no "appId"');
    ValidationUtils.isTrue(request.requestId === requestId, 'Retrieved "requetId" does not match provided');
    return request;
  }

  async getSignedRequest(publicKey: HexString, requestId: string): Promise<WalletRemoteRequest|undefined> {
    ValidationUtils.isTrue(!!requestId, '"requestId" must be provided');
    ValidationUtils.isTrue(!!publicKey, '"publicKey" must be provided');
    const res = await this.api.get(`extension/walletProxy/getRequest/${requestId}`, {}) as any;
    if (!res) { return undefined; }
    const signer = new RequestSigner();
    signer.verifyProxyRequest(publicKey, res);
    const request = {
      appId: res.policyData.EXTENSION_APP_ID,
      requestId: res.requestId,
      requestType: res.method,
      request: res.data,
    } as WalletRemoteRequest;
    ValidationUtils.isTrue(!!request.appId, 'Retrieved request has no "appId"');
    ValidationUtils.isTrue(request.requestId === requestId, 'Retrieved "requetId" does not match provided');
    return request;
  }

  async sendResponse(response: WalletRemoteResponse): Promise<boolean> {
    ValidationUtils.isTrue(!!response.requestId, '"requestId" must be provided');
    const res = await this.api.post(`extension/walletProxy/setResponse/${response.requestId}`, response);
    return !!res;
  }

  async getAppLink(appId: string, walletAccountGroupId?: string, walletCurrency?: string, queryParams?: any): Promise<string|undefined> {
    const res =  await this.api.post(`extension/appSignInRedirect`, {
      appId, walletAccountGroupId, walletCurrency, queryString: createQueryString(queryParams || {})}) as any;
    if (!res) { return undefined; }
    return res.redirectUrl;
  }

  async getAppLinkFromLinkId(linkId: string, walletAccountGroupId?: string, walletCurrency?: string): Promise<string | undefined> {
    const res =  await this.api.post(`extension/appSignInRedirectFromLink`, {
      linkId, walletAccountGroupId, walletCurrency }) as any;
    if (!res) { return undefined; }
    return res.redirectUrl;
  }
}