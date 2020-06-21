import {HexString, Network} from "ferrum-plumbing";
import {SignableMessageType} from "../../common/model/SignableMessages";
import {SendMoneyResponse, SignedMessageResponse, CustomTransactionCallRequest} from "../../common/model/Types";

export interface RemoteSendMoneyRequest {
  accountGroupId?: string;
  currency: string;
  fromAddress?: string;
  toAddress: string;
  amount: string;
}

export interface RemoteSignRequest {
  network: Network;
  accountGroupId?: string;
  messageHex: HexString;
  messageType: SignableMessageType;
  description?: string;
}

export interface RemoteSendCustomTransactionRequest {
  network: string;
  appId: string;
  userId: string;
  transactions: CustomTransactionCallRequest[]
}

export interface WalletRemoteRequest {
  requestId: string;
  appId: string;
  requestType: 'REQUEST_SIGN_CLEAN_MESSAGE' | 
    'REQUEST_SIGN_TYPED_MESSAGE' | 
    'REQUEST_SEND_MONEY' | 
    'REQUEST_SIGN_CUSTOM_MESSAGE' |
    'REQUEST_SIGN_CUSTOM_TRANSACTION';
  request: RemoteSendMoneyRequest | RemoteSignRequest
}

export interface WalletRemoteResponse {
  requestId: string;
  appId: string;
  response: SendMoneyResponse|SignedMessageResponse|SendMoneyResponse[];
  rejected: boolean;
  reason?: string;
}