"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestSigner_1 = require("./RequestSigner");
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
    };
    const signer = new RequestSigner_1.RequestSigner(SK);
    const signed = signer.signProxyRequest(req);
    const verif = signer.verifyProxyRequest(PUB, signed);
    expect(verif).toBe(true);
    // Verify after jsonization
    const newReq = JSON.parse(JSON.stringify(signed));
    const verif2 = signer.verifyProxyRequest(PUB, newReq);
    expect(verif2).toBe(true);
    // Now mess with the request
    const messedWith = Object.assign({}, newReq);
    messedWith.data.messedUp = true;
    const verif3 = signer.verifyProxyRequest(PUB, messedWith);
    expect(verif3).toBe(false);
    let error = 'no';
    try {
        signer.verifyProxyRequest(PUB, req);
    }
    catch (e) {
        error = 'yes';
    }
    expect(error).toBe('yes');
});
//# sourceMappingURL=RequestSigner.test.js.map