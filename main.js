// Zero-Knowledge File Encryption System
// main.js - Kriptografi ve Firebase işlemleri

class ZeroKnowledgeCrypto {
    constructor() {
        this.saltLength = 16; // 16 byte salt
        this.ivLength = 12;    // 12 byte IV for AES-GCM
        this.keyLength = 256;  // 256-bit key
        this.iterations = 200000; // PBKDF2 iterations
    }

    // Utility: ArrayBuffer to Base64
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Utility: Base64 to ArrayBuffer
    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Generate random bytes
    async generateRandomBytes(length) {
        return crypto.getRandomValues(new Uint8Array(length));
    }

    // PBKDF2 ile anahtar türetme
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            'PBKDF2',
            false,
            ['deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: this.iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: this.keyLength },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // Dosya şifreleme
    async encryptFile(file, password) {
        try {
            // 1. Random salt ve IV oluştur
            const salt = await this.generateRandomBytes(this.saltLength);
            const iv = await this.generateRandomBytes(this.ivLength);

            // 2. Dosyayı ArrayBuffer olarak oku
            const fileBuffer = await file.arrayBuffer();

            // 3. Anahtar türet
            const key = await this.deriveKey(password, salt);

            // 4. AES-GCM ile şifrele
            const encryptedBuffer = await crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                fileBuffer
            );

            // 5. Base64 formatında birleştir: salt:iv:ciphertext
            const saltB64 = this.arrayBufferToBase64(salt);
            const ivB64 = this.arrayBufferToBase64(iv);
            const cipherB64 = this.arrayBufferToBase64(encryptedBuffer);

            return `${saltB64}:${ivB64}:${cipherB64}`;

        } catch (error) {
            throw new Error(`Şifreleme hatası: ${error.message}`);
        }
    }

    // Dosya şifre çözme
    async decryptFile(encryptedBundle, password) {
        try {
            // 1. Formatı parçala: salt:iv:ciphertext
            const parts = encryptedBundle.split(':');
            if (parts.length !== 3) {
                throw new Error('Geçersiz şifreli dosya formatı');
            }

            const [saltB64, ivB64, cipherB64] = parts;

            // 2. Base64'ten ArrayBuffer'a çevir
            const salt = this.base64ToArrayBuffer(saltB64);
            const iv = this.base64ToArrayBuffer(ivB64);
            const cipherBuffer = this.base64ToArrayBuffer(cipherB64);

            // 3. Anahtar türet
            const key = await this.deriveKey(password, salt);

            // 4. AES-GCM ile şifre çöz
            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                cipherBuffer
            );

            return decryptedBuffer;

        } catch (error) {
            throw new Error(`Şifre çözme hatası: ${error.message}`);
        }
    }

    // Firebase Storage'a yükleme
    async uploadToFirebase(fileName, encryptedBundle) {
        try {
            if (!window.firebaseStorage) {
                throw new Error('Firebase yapılandırması bulunamadı');
            }

            const { storage, ref, uploadBytes, getDownloadURL } = window.firebaseStorage;

            // Firebase storage referansı
            const storageRef = ref(storage, `encrypted/${fileName}`);

            // Blob olarak yükle
            const blob = new Blob([encryptedBundle], { type: 'text/plain' });
            await uploadBytes(storageRef, blob);

            // Download URL al
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;

        } catch (error) {
            throw new Error(`Firebase yükleme hatası: ${error.message}`);
        }
    }

    // Firebase'den indirme
    async downloadFromFirebase(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Dosya indirilemedi');
            }

            const encryptedBundle = await response.text();
            return encryptedBundle;

        } catch (error) {
            throw new Error(`Firebase indirme hatası: ${error.message}`);
        }
    }
}

// Global crypto instance
window.zeroKnowledgeCrypto = new ZeroKnowledgeCrypto();
