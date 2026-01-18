import crypto from "crypto";

type KeyFormat = BufferEncoding; 

interface KeyOptions {
  size?: number; 
  format?: KeyFormat; 
}

export function generateEncrytionDecrytionKeys({
  size = 32,
  format = "hex",
}: KeyOptions = {}) {
  const key = crypto.randomBytes(size).toString(format);

  return {
    encryptionKey: key,
    decryptionKey: key,
  };
}
