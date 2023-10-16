import forge from "node-forge";

export function toHex(
  buffer:
    | forge.pki.ed25519.NativeBuffer
    | forge.pki.PublicKey
    | forge.pki.PrivateKey
): string {
  return forge.util.binary.hex.encode(buffer as forge.pki.ed25519.NativeBuffer);
}

export function toBase64(
  buffer:
    | forge.pki.ed25519.NativeBuffer
    | forge.pki.PublicKey
    | forge.pki.PrivateKey
): string {
  return forge.util.binary.base64.encode(
    buffer as forge.pki.ed25519.NativeBuffer
  );
}

type Obj = Record<string, any>;

export function encodeObject(object: Obj) {
  return JSON.stringify(
    Object.fromEntries(
      Object.keys(object)
        .sort()
        .map((key) => [key, object[key]])
    )
  );
}

export function hashString(message: string) {
  let hash = forge.sha512.create();
  hash.update(message);
  return hash;
}

export function hashObject(object: Obj) {
  let digestHex = hashString(encodeObject(object)).digest().toHex();
  let digestBin = forge.util.binary.hex.decode(digestHex);
  let digestBase64 = forge.util.binary.base64.encode(digestBin);
  return digestBase64;
}

export function verifyObjectSignature(input: {
  object: Obj;
  publicKeyBase64: string;
  signatureBase64: string;
}) {
  return forge.pki.ed25519.verify({
    publicKey: forge.util.decode64(input.publicKeyBase64),
    md: hashString(encodeObject(input.object)),
    signature: forge.util.decode64(input.signatureBase64),
  });
}

// on client side
export function signObject(input: {
  object: Obj;
  privateKey: forge.pki.ed25519.BinaryBuffer;
}) {
  return forge.pki.ed25519.sign({
    privateKey: input.privateKey,
    md: hashString(encodeObject(input.object)),
  });
}
