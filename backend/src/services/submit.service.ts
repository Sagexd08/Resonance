import { grpcClient } from "./grpc.client.js";

export async function sendEncrytedData(
   { userId, encryptedData }: { userId: string, encryptedData: string }
) {
  return new Promise((resolve, reject) => {
    
    
    
    
    
    const imageBuffer = Buffer.from(encryptedData, 'base64'); 

    grpcClient.SendEncryptedImage({ uid: userId, encrypted_image: imageBuffer }, (err: any, response: any) => {
      if (err) {
        console.error("gRPC SendEncryptedImage Error:", err);
        reject(err);
      } else {
        console.log("gRPC SendEncryptedImage Response:", response);
        resolve(response);
      }
    });
  });
}
