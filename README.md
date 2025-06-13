
# Tokat Digital Backend

Tokat Digital, Tokat ilindeki işletmeleri ve ürünlerini kullanıcılarla buluşturan, sesli arama destekli bir dijital rehber ve ticaret platformudur. Bu proje, Node.js ve Express.js kullanılarak geliştirilmiş bir RESTful API içerir. MongoDB veritabanı, Swagger belgelendirmesi ve güçlü kullanıcı/rol yönetimi desteği bulunmaktadır.

## 🔧 Teknolojiler

- Node.js
- Express.js
- MongoDB (Mongoose)
- Swagger (API dokümantasyonu)
- JWT (Authentication)
- Multer (Dosya yükleme)
- Node:Crypto (Şifreleme)
- Yapay Zeka ile Sesli Arama (Frontend entegrasyon)
- RESTful API mimarisi

---

## 📁 Proje Yapısı

📦 tokat-digital-backend
├── logs/
├── src/
│   ├── configs/
│   │   ├── dbConnection.js
│   │   └── swagger.json
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── category.js
│   │   ├── comment.js
│   │   ├── firm.js
│   │   ├── log.js
│   │   ├── product.js
│   │   ├── token.js
│   │   ├── type.js
│   │   └── user.js
│   ├── errors/
│   │   └── customError.js
│   ├── helpers/
│   │   ├── passwordCreate.js
│   │   ├── passwordEncrypt.js
│   │   ├── sendMail.js
│   │   └── sync.js
│   ├── middlewares/
│   │   ├── authentication.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── permission.js
│   │   ├── queryHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── category.js
│   │   ├── comment.js
│   │   ├── firm.js
│   │   ├── product.js
│   │   ├── token.js
│   │   ├── type.js
│   │   └── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── category.js
│   │   ├── comment.js
│   │   ├── document.js
│   │   ├── firm.js
│   │   ├── index.js
│   │   ├── log.js
│   │   ├── product.js
│   │   ├── token.js
│   │   ├── type.js
│   │   └── user.js
├── uploads/
├── .env
├── index.js
├── swaggerAutogen.json
└── README.md

---

## 👥 Roller

### 1. **Ana Admin (Tokat Digital)**
- Yeni dükkânlar ekleyebilir
- Tüm dükkânları ve ürünlerini görebilir
- Log kayıtlarına erişebilir
- Dükkanları silebilir

### 2. **Dükkan Admini**
- Kendi dükkanını düzenleyebilir
- Ürün ekleyebilir, silebilir, düzenleyebilir
- Dükkan silme isteği gönderebilir (asıl admin onaylar)

### 3. **Kullanıcı**
- Arama motorunu kullanarak dükkan/ürün arayabilir
- Sesli arama (AI destekli) yapabilir
- Dükkanlara yorum ve puan verebilir
- Ürün detaylarına erişebilir
- Üyelik oluşturabilir

---

## 🔍 Özellikler

- 🔐 JWT ile güvenli kimlik doğrulama
- 🧠 Sesli arama desteği (frontend üzerinden yapay zeka destekli)
- 🔎 Gelişmiş arama motoru (dükkan ve ürün için)
- 📄 Swagger ile API belgelendirmesi
- 📦 Yorum ve puanlama sistemi
- 📋 Admin panel yönetimi
- 🗂 Kategorilere ve türlere göre ürün/dükkan sınıflandırması
- 📧 E-posta gönderimi (doğrulama, bilgilendirme)

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB

### Başlatmak için

git clone https://github.com/kullaniciadi/tokat-digital-backend.git
cd tokat-digital-backend
npm install
cp .env.example .env
# .env dosyasını kendine göre düzenle
npm start

---

## 💡 Notlar

- Yorum ve puanlar, her dükkan için ayrı ayrı ortalama olarak hesaplanır.
- Kullanıcı rolleri `User`, `Staff`, `Admin` olarak sınıflandırılmıştır.
