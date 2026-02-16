# Dani Konveksi - Backend

Backend API untuk website Dani Konveksi. Dibangun dengan Express.js + MongoDB.

## Setup

```bash
npm install
cp .env.example .env   # edit sesuai config
npm run dev
```

## Konfigurasi .env

```
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/konveksi
JWT_SECRET=ganti_dengan_secret_key

MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
MIDTRANS_PRODUCTION=false
FRONTEND_URL=http://localhost:3000
```

Key Midtrans bisa didapat dari https://dashboard.midtrans.com (Settings > Access Keys).

## WhatsApp

Saat pertama kali dijalankan, scan QR code yang muncul di terminal pakai WhatsApp > Linked Devices. Session tersimpan otomatis.

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/health | Health check |
| GET/POST | /api/products | CRUD produk |
| POST | /api/orders | Buat order + payment |
| GET | /api/orders/:id/payment-status | Cek status bayar |
| POST | /api/midtrans/notification | Webhook Midtrans |
| GET | /api/whatsapp/status | Status WhatsApp |
| POST | /api/contact | Kirim pesan |

## Flow Pembayaran

1. Customer checkout -> backend buat order + transaksi Midtrans
2. Notifikasi WA dikirim ke customer (status PENDING + link bayar)
3. Customer bayar via Midtrans
4. Frontend polling status -> backend update order + kirim WA konfirmasi
