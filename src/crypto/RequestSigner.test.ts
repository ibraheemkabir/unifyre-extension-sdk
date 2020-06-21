import { JsonRpcRequest } from "ferrum-plumbing";
import { RequestSigner } from "./RequestSigner";
const SK = '37ff9ae02be75eb21bd1ff24e0a21907d6bbfb7694c16968095480f33bed8e0c';
const PUB = '0ffd3d21a3ea78d79ac18caebf494d5bdac7f91795e5dbbd86adbc964f07934a';

test('Signed request can be verified', () => {
    const req = {
        command: 'DUMMY_COMMAND',
        params: [1, 'two', 'three'],
        data: {
            _x: 123,
            a: 'A',
            v: { j: '123', someLongerKey: 'SOME S$%$%$%' },
        }
    } as JsonRpcRequest;
    const signer = new RequestSigner(SK);
    const signed = signer.signProxyRequest(req);

    const verif = signer.verifyProxyRequest(PUB, signed);
    expect(verif).toBe(true);

    // Verify after jsonization
    const newReq = JSON.parse(JSON.stringify(signed));
    const verif2 = signer.verifyProxyRequest(PUB, newReq);
    expect(verif2).toBe(true);

    // Now mess with the request
    const messedWith = {...newReq};
    messedWith.data.messedUp = true;
    const verif3 = signer.verifyProxyRequest(PUB, messedWith);
    expect(verif3).toBe(false);

    let error = 'no';
    try {
        signer.verifyProxyRequest(PUB, req);
    } catch(e) {
        error = 'yes';
    }
    expect(error).toBe('yes');
});

test('Verify example signed message', () => {
    const signer = new RequestSigner(SK);
    const val = {...__SIG};
    const sig = signer.signProxyRequest(val);
    console.log('SIGNED')
    console.log(JSON.stringify(sig));
    const res = signer.verifyProxyRequest(PUB, sig);
    console.log('Sig res', res);
})

const __SIG: any =  {
    "command":"REQUEST_SIGN_CUSTOM_TRANSACTION",
    "data":{
        "network":"ETHEREUM",
        "userId":"7PC56PKGAFCBTEH2XY7T4BRGTU======",
        "appId":"POOL_DROP",
        "transactions":[
            {"network":"ETHEREUM",
            "currency":"ETHEREUM:0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4",
            "from":"0x3911b8f9c8dd3fb673e4bf6068b4120f2360fa6d",
            "amount":"0","contract":"0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4",
            "data":"0x095ea7b300000000000000000000000032d7c376594bb287a252ffba01e70ad56174702a00000000000000000000000000000000000000000000000006f05b59d3b20000",
            "gas":{"gasPrice":"0","gasLimit":"45734"},
            "nonce":0,
            "description":"Approve 0.5 0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4 to be spent by PoolDrop contract"},
            {"network":"ETHEREUM",
            "currency":"ETHEREUM:0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4",
            "from":"0x3911b8f9c8dd3fb673e4bf6068b4120f2360fa6d",
            "amount":"0",
            "contract":"0x32d7c376594bb287a252ffba01e70ad56174702a",
            "data":"0x74f2d0de0000000000000000000000009e35b147d4bf95983ffcb527ad04fbb3a9f121a40000000000000000000000003911b8f9c8dd3fb673e4bf6068b4120f2360fa6d000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000d776ab1388c96ac5a51481a21fed98df4f0f4da0",
            "gas":{"gasPrice":"0","gasLimit":"58788"},
            "nonce":1,
            "description":"0.5 0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4 to be distributed to 1 addresses using PoolDrop contract"}],
            "_timestamp":1592718438491,
            "_signature":"46FE7F1974D2BF1F66A03650C8C5AF29BBE6284DAD5AC35FCEAF5B157E4B2B6179728C73D13984B1B831EDED6FC2C2AD4B618864EC52BAAC3EC8EAC0DFC49804"
    }
}

const _SIG = {
    "command": "REQUEST_SIGN_CUSTOM_TRANSACTION",
    "data": {
      "_signature": "1D722F1CD50307C6364BC12E9BFABAF11CE1B4556958E1EF6431030232C9F0CEBEEB0320EE16A2479DCADAA5955E7602582F023D46D82EB24B1DCE152277610C",
      "_timestamp": 1592715528195,
      "appId": "POOL_DROP",
      "network": "ETHEREUM",
      "transactions": [
        {
          "amount": "0",
          "contract": "0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4",
          "currency": "ETHEREUM:0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4",
          "data": "0x095ea7b300000000000000000000000032d7c376594bb287a252ffba01e70ad56174702a00000000000000000000000000000000000000000000000006f05b59d3b20000",
          "description": "Approve 0.5 0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4 to be spent by PoolDrop contract",
          "from": "0x3911b8f9c8dd3fb673e4bf6068b4120f2360fa6d",
          "gas": {
            "gasLimit": "45734",
            "gasPrice": "0",
          },
          "network": "ETHEREUM",
          "nonce": 0,
        },
        {
          "amount": "0",
          "contract": "0x32d7c376594bb287a252ffba01e70ad56174702a",
          "currency": "ETHEREUM:0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4",
          "data": "0x74f2d0de0000000000000000000000009e35b147d4bf95983ffcb527ad04fbb3a9f121a40000000000000000000000003911b8f9c8dd3fb673e4bf6068b4120f2360fa6d000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000d776ab1388c96ac5a51481a21fed98df4f0f4da0",
          "description": "0.5 0x9e35b147d4bf95983ffcb527ad04fbb3a9f121a4 to be distributed to 1 addresses using PoolDrop contract",
          "from": "0x3911b8f9c8dd3fb673e4bf6068b4120f2360fa6d",
          "gas": {
            "gasLimit": "58788",
            "gasPrice": "0",
          },
          "network": "ETHEREUM",
          "nonce": 1,
        },
      ],
      "userId": "7PC56PKGAFCBTEH2XY7T4BRGTU======",
    },
    "params": [],
}