from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import base64
import io
from PIL import Image
import binascii

def decrypt_image(encrypted_data: bytes, key: str) -> Image.Image:
    """
    Decrypts the encrypted image data using AES-CBC.
    Expects encrypted_data to be IV (16 bytes) + Ciphertext.
    Expects key to be a hex string (32 bytes / 64 hex chars).
    """
    try:
                                  
        try:
            key_bytes = binascii.unhexlify(key)
        except binascii.Error:
                                                                                                  
            if len(key) == 32:
                key_bytes = key.encode('utf-8')                             
            else:
                raise ValueError("Invalid key format. Expected 32-byte hex string.")

        if len(key_bytes) != 32:
             raise ValueError(f"Invalid key length: {len(key_bytes)} bytes. Expected 32 bytes.")

                                   
        iv = encrypted_data[:16]
        ciphertext = encrypted_data[16:]

                 
        cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(ciphertext) + decryptor.finalize()

               
        unpadder = padding.PKCS7(128).unpadder()
        data = unpadder.update(padded_data) + unpadder.finalize()
        
                            
        import json
        try:
            json_str = data.decode('utf-8')
            payload = json.loads(json_str)
                                                       
            if 'image' in payload:
                image_b64 = payload['image']
                                                           
                if ',' in image_b64:
                    image_b64 = image_b64.split(',')[1]
                image_bytes = base64.b64decode(image_b64)
                image = Image.open(io.BytesIO(image_bytes))
                return image
            else:
                                                                              
                print("Warning: 'image' field not found in payload, attempting to treat as raw image bytes.")
                image = Image.open(io.BytesIO(data))
                return image
        except (json.JSONDecodeError, UnicodeDecodeError):
                                   
            print("Warning: Failed to decode as JSON, treating as raw image bytes.")
            image = Image.open(io.BytesIO(data))
            return image
    except Exception as e:
        print(f"Decryption failed: {e}")
        raise e

