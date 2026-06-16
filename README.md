# AGIA Shop — AI Ecommerce Chatbot

Aplikasi mini ecommerce dengan manajemen produk dan AI chatbot berbasis data produk real-time.

**Live Demo:** https://agia-shop.vercel.app

---

## Tech Stack

- **Frontend & Backend:** Next.js 15 (App Router) + TypeScript
- **Database & Auth:** Supabase (PostgreSQL + RLS)
- **AI:** Google Gemini 2.5 Flash via `@google/generative-ai`
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel

---

## Fitur

### Halaman Publik
- Daftar produk dengan grid responsif
- Pencarian produk (nama & deskripsi)
- Filter berdasarkan kategori
- Halaman detail produk

### Admin Panel
- Login dengan Supabase Auth
**Link Admin:** https://agia-shop.vercel.app/admin
- Email: `admin@agia.com`
- Password: `admin123456`
- CRUD produk (tambah, edit, hapus) dengan konfirmasi dialog
- Dashboard ringkasan (total produk, percakapan, stok menipis)
- Rekap seluruh percakapan chatbot beserta isi chat

### AI Chatbot
- Floating widget di halaman publik
- Menjawab berdasarkan data produk real-time dari Supabase
- Riwayat percakapan tersimpan per sesi (localStorage + Supabase)
- Dapat dilanjutkan saat halaman di-refresh

## Fitur yang Belum Selesai

- Semantic / vector search

---

## AI Tools yang Digunakan

- **Claude (Anthropic)** — arsitektur awal, scaffolding komponen, debugging

---

## Tradeoff Teknis

- **Konteks produk dikirim setiap request** — sederhana dan selalu up-to-date, tradeoff-nya token usage lebih besar. Alternatif yang lebih scalable adalah vector search / RAG, namun kompleksitasnya tidak sebanding untuk skala saat ini.
- **Session ID di localStorage** — mudah diimplementasi tanpa perlu auth pengguna, tradeoff-nya history hilang jika localStorage dibersihkan.
- **App Router + Server Components** — fetch data langsung di server tanpa API layer tambahan untuk halaman publik, lebih efisien tapi perlu hati-hati memisahkan Server dan Client Components.

---

## Setup Lokal

### 1. Clone & Install

```bash
git clone https://github.com/marsabilaaa/agia-shop.git
cd agia-shop
npm install
```

### 2. Environment Variables

Buat file `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GEMINI_API_KEY=AIza...
```

### 3. Setup Database Supabase

Jalankan SQL berikut di Supabase SQL Editor:

> Lihat file `supabase/schema.sql`

### 4. Buat Akun Admin

Di Supabase Dashboard → Authentication → Users → Add user:
- Email: `admin@agia.com`
- Password: `admin123456`

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Pertanyaan Refleksi

**1. Mengapa memilih tantangan ini?**
Pilihan 1 lebih menantang secara teknis karena melibatkan integrasi AI dengan data real-time. Kombinasi Next.js + Supabase + Gemini API juga relevan dengan kebutuhan produk modern.

**2. Bagian yang paling sulit?**
Merancang konteks prompt yang tepat agar AI hanya menjawab berdasarkan data produk yang ada, tidak hallucinate, dan tetap natural dalam Bahasa Indonesia.

**3. Jika ada tambahan waktu satu hari?**
Mengimplementasikan vector search menggunakan Supabase pgvector agar pencarian produk oleh AI lebih akurat secara semantik, bukan hanya keyword matching.

**4. Scaling strategy?**
- Pisahkan AI handler ke Edge Function atau dedicated service
- Implementasi pgvector untuk semantic search agar tidak perlu inject semua produk ke prompt
- Tambahkan rate limiting per session di API route
- Cache daftar produk dengan revalidasi berkala (ISR) agar tidak hit database setiap request chat