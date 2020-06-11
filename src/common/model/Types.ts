import {HexString} from "ferrum-plumbing";

export interface SendMoneyResponse {
  transactionId: string;
}

export interface SignedRawDataResponse {
  signature: { r: HexString, s: HexString, v: number};
  publicKeyHex: HexString;
}

export type SignedMessageResponse = SignedRawDataResponse | SendMoneyResponse;