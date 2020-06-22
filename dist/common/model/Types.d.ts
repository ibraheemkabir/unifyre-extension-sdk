import { HexString } from "ferrum-plumbing";
export interface GasParameters {
    gasLimit: string;
    gasPrice: string;
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
}
export interface SendMoneyResponse {
    transactionId: string;
}
export interface SignedRawDataResponse {
    signature: {
        r: HexString;
        s: HexString;
        v: number;
    };
    publicKeyHex: HexString;
}
export declare type SignedMessageResponse = SignedRawDataResponse | SendMoneyResponse | SendMoneyResponse[];
//# sourceMappingURL=Types.d.ts.map