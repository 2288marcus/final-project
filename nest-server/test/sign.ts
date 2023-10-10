import * as forge from 'node-forge';

let { publicKey, privateKey } = forge.pki.ed25519.generateKeyPair();

let message = 'hello '.repeat(132);

let signature = forge.pki.ed25519.sign({
  privateKey,
  message,
  encoding: 'utf8',
});

let signatureString = signature.toString('base64');

console.log({
  message,
  signature,
  signatureLength: signature.length,
  signatureString: signatureString,
  signatureStringLength: signatureString.length,
  decodedSignature: forge.util.decode64(signatureString),
  decodedSignatureLength: forge.util.decode64(signatureString).length,
});

// message = 'bye';

let isMatching = forge.pki.ed25519.verify({
  signature: forge.util.decode64(signatureString),
  publicKey,
  message,
  encoding: 'utf8',
});

console.log({ isMatching });
