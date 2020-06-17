import { Injectable, JsonRpcRequest, ValidationUtils, HexString } from "ferrum-plumbing";
import { sha256sync, utf8ToHex, Eddsa } from 'ferrum-crypto';

export class RequestSigner implements Injectable {
    constructor(private privateKey?: string) { }

    __name__() { return 'RequestSigner'; }

    signProxyRequest(req: JsonRpcRequest): JsonRpcRequest {
        ValidationUtils.isTrue(!!this.privateKey, '"privateKey" is not provided to RequestSigner');
        req.data = (req.data || {});
        req.data._timestamp = Date.now();
        const msg = this.prepRequest(req);
        const msgHash = sha256sync(utf8ToHex(msg));
        const sig = Eddsa.sign(this.privateKey!, msgHash);
        return {...req, data: {...req.data, _signature: sig}};
    }

    verifyProxyRequest(publicKey: HexString, req: JsonRpcRequest): boolean {
        const msg = this.prepRequest(req);
        const msgHash = sha256sync(utf8ToHex(msg));
        const sig = req.data._signature;
        return Eddsa.verify(publicKey, msgHash, sig);
    }

    private prepRequest(req: JsonRpcRequest) {
        const params = [...(req.params || [])].map(i => i.toString()).join(',');
        const data = {...req.data || {}};
        delete data._signature;
        ValidationUtils.isTrue(timeInRange(data._timestamp), 'Invalid _timestamp on signable data');
        const kvp = objToStrSorted(data);
        return `${req.command || '_'}&pars=${params}&${kvp}`;
    }

}

function objToStrSorted(obj: any): string {
    if (typeof obj !== 'object') {
        return obj.toString();
    }
    const dataKeys = Object.keys(obj).sort();
    return dataKeys.map(k => `${k.toString()}=${(objToStrSorted(obj[k]||'')).toString()}` ).join('&');
}

const TIMESTAMP_RANGE = 10 * 60 * 1000;
function timeInRange(t: number|undefined) {
    if (!t) { return false; }
    const now = Date.now();
    return t > (now - TIMESTAMP_RANGE) && t < (now + TIMESTAMP_RANGE);
}