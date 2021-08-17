import {HexString} from "ferrum-plumbing";

export interface GasParameters {
  gasLimit: string;
  gasPrice?: string;
}

export interface CustomTransactionCallRequest {
  from: string;
  currency: string;
  contract: string;
  amount: string;
  data: string;
  gas: GasParameters;
  nonce?: number;
  description?: string;
  value?: string;
}

export interface SendMoneyResponse {
  transactionId: string;
  requestPayload?: string;
}

export interface CustomTransactionCallResponse {
  requestId: string;
  rejected: boolean;
  response: SendMoneyResponse[];
  requestPayload?: any;
  reason?: string;
}

export interface SignedRawDataResponse {
  signature: { r: HexString, s: HexString, v: number};
  publicKeyHex: HexString;
}

export type SignedMessageResponse = SignedRawDataResponse | SendMoneyResponse | SendMoneyResponse[];