# 🔐 Zero-Knowledge File Encryption System

Firebase Storage tabanlı, client-side şifreleme ile güvenli dosya yükleme/indirme sistemi. **Parola asla sunucuya gönderilmez** - tam zero-knowledge encryption.

## 🚀 Özellikler

- ✅ **Client-side şifreleme**: PBKDF2 (200,000 iterasyon) + AES-GCM 256
- ✅ **Zero-knowledge**: Parola tarayıcı dışına çıkmaz
- ✅ **Firebase Storage**: Ücretsiz, hızlı, güvenli
- ✅ **GitHub Pages**: Statik hosting, HTTPS zorunlu
- ✅ **Modern UI**: Responsive, mobil uyumlu
- ✅ **50MB limit**: Büyük dosyalar için uyarı

## 📋 Kurulum Adımları

### 1. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/) → **Create a project**
2. Proje adı: `secure-file-storage` (veya istediğiniz)
3. Google Analytics: **Devre dışı** (opsiyonel)

### 2. Firebase Storage Aktif Et

1. Firebase Console → **Storage** → **Get started**
2. **Test mode** seçin (development için)
3. Kurallar otomatik oluşacak

### 3. Web App Yapılandırması

1. **Project Overview** → **Add app** → **Web** (</>)
2. App nickname: `SecureFileApp`
3. **Firebase SDK** kısmını kopyalayın
4. `firebase-config.js` dosyasını düzenleyin:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 4. GitHub Repository Oluştur

1. [GitHub](https://github.com) → **New repository**
2. Repository name: `secure-file-storage`
3. **README.md oluşturma** kutucuğunu işaretleyin
4. **Create repository**

### 5. Dosyaları GitHub'a Yükle

```bash
# Yerel klasör oluştur
mkdir secure-file-storage
cd secure-file-storage

# Dosyaları kopyala
# (Bu repodaki tüm dosyaları kopyalayın)

# Git init
git init
git add .
git commit -m "Initial commit: Zero-knowledge file encryption system"

# Remote repository ekle
git remote add origin https://github.com/YOUR_USERNAME/secure-file-storage.git

# Push
git push -u origin main
```

### 6. GitHub Pages Aktif Et

1. Repository → **Settings** → **Pages**
2. **Source**: `main` branch → `/root`
3. **Save**
4. URL oluşacak: `https://YOUR_USERNAME.github.io/secure-file-storage/`

## 🔧 Kullanım

### Dosya Yükleme

1. `index.html` sayfasına gidin
2. Dosya seçin (max 50MB)
3. Güçlü bir parola girin
4. **"Şifreleyip Yükle"** butonuna tıklayın
5. Oluşan link ve parolayı kaydedin

### Dosya İndirme

1. Oluşan linki tarayıcıya yapıştırın
2. Veya `download.html?url=FIREBASE_URL` şeklinde kullanın
3. Parolayı girin
4. **"Şifreyi Çöz ve İndir"** butonuna tıklayın

## 🔐 Güvenlik Detayları

### Şifreleme Algoritması
```javascript
// PBKDF2 ile anahtar türetme
const key = await crypto.subtle.deriveKey(
    {
        name: 'PBKDF2',
        salt: salt,           // 16 byte random
        iterations: 200000,   // Yüksek güvenlik
        hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
);

// AES-GCM şifreleme
const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv }, // 12 byte random IV
    key,
    fileBuffer
);
```

### Veri Formatı
```
saltBase64:ivBase64:cipherTextBase64
```
- **Salt**: 16 byte rastgele (PBKDF2 için)
- **IV**: 12 byte rastgele (AES-GCM için)
- **CipherText**: Şifreli dosya verisi

## ⚠️ Önemli Uyarılar

### 🔑 Parola Güvenliği
- **Parola kaybolursa dosya geri getirilemez!**
- Güçlü, benzersiz parolalar kullanın
- Parola yönetimi için password manager önerilir

### 🌐 HTTPS Zorunluluğu
- **GitHub Pages HTTPS kullanır** ✅
- Yerel test için `http://localhost` kabul edilir
- Production'da **mutlaka HTTPS** kullanın

### 📁 Firebase Storage Kuralları
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Test mode
    }
  }
}
```

## 🧪 Test Etme

### Yerel Development
```bash
# Python 3+ gerekli
python -m http.server 8000

# Tarayıcıda aç
http://localhost:8000
```

### Production Test
1. GitHub Pages URL'ini kullanın
2. Farklı dosya türleri test edin
3. Parola değiştirerek test edin
4. 50MB limitini test edin

## 🚨 Güvenlik Notları

- ✅ **Zero-knowledge**: Parola sunucuya gitmez
- ✅ **Client-side encryption**: Şifreleme tarayıcıda
- ✅ **HTTPS**: Tüm iletişim şifreli
- ✅ **Random salt/IV**: Her dosya için benzersiz
- ✅ **PBKDF2 200k iterations**: Brute-force koruması
- ✅ **AES-GCM 256**: Askeri seviye şifreleme

## 🐛 Sorun Giderme

### "Firebase yapılandırması bulunamadı"
- `firebase-config.js` dosyasındaki API key'leri kontrol edin
- Firebase Console'dan doğru config'i kopyalayın

### "CORS hatası"
- Firebase Storage kurallarında `allow read, write: if true` olduğundan emin olun
- HTTPS kullandığınızdan emin olun

### "Şifreleme hatası"
- Modern tarayıcı kullandığınızdan emin olun (Chrome, Firefox, Safari)
- Web Crypto API desteği gerekli

## 📄 Lisans

MIT License - Ücretsiz kullanım ve geliştirme

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

Sorularınız için Issues sayfasını kullanın.

---

**🔒 Unutmayın: Parolanızı kaybederseniz dosyanız sonsuza dek kaybolur!**
