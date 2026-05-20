# SYSTEM_MAP — mjs-scream-challenge

> Dibuat otomatis · Bahasa: Indonesia · Diperbarui: 2026-04-24

---

## Project Summary

**Tujuan Aplikasi**
Game interaktif berbasis mikrofon untuk event/booth. Pemain berteriak ke mic selama 60 detik. Skor diakumulasi berdasarkan kekuatan suara (dB) dan dikalikan dengan Combo. Skor disimpan ke leaderboard Supabase. Pemenang (skor >= 300) mendapat link ke "Spin the Wheel". Dibuat untuk brand event **MJ Solution Indonesia × Arch ID**.

**Tech Stack Utama**

| Layer | Teknologi |
|---|---|
| Framework | Next.js **16.1.7** (App Router) |
| UI Library | React **19.2.3** |
| Language | TypeScript **5** |
| Styling | Tailwind CSS **v4** (PostCSS plugin) |
| Database | **Supabase** (PostgreSQL) — tabel `leaderboard` |
| Animation | Framer Motion **12** |
| Icons | Lucide React |
| Class Utils | clsx + tailwind-merge (`cn()`) |
| Compiler | React Compiler (Babel plugin, eksperimental) |

**Pola Arsitektur**
- App Router (`src/app/`) — seluruh halaman pakai `"use client"` (CSR murni, tidak ada RSC aktif)
- Tidak ada API Route / Server Action — semua data akses langsung dari client ke Supabase via anon key
- Responsive: satu halaman `/leaderboard` mendukung dua layout (`default` mobile vs `signage` desktop) melalui hook `useLayoutVariant`

---

## Core Logic Flow (Function-Level Flowchart)

### 🎮 Alur Game Utama
```
app/page.tsx [Home]
  └─ phase: "register"
       → RegisterScreen.onConfirm(player, level)
       → phase: "instruction"
            → InstructionScreen.onStartGame()
            → phase: "countdown"
                 → CountdownScreen.onComplete()   [3-2-1-SCREAM! timer ~4 detik]
                 → phase: "playing"
                      → GameplayScreen
                           ├─ useMicrophone.start()
                           │    └─ tick loop: hitung `db`, akumulasi `Score` = `rate * combo * elapsedSec`
                           ├─ Bar Meter mentok di 300 (Syarat Win), tapi Score terus naik sampai 60s
                           └─ setInterval (1s): timeLeft countdown 60s → finish(score >= 300)
                                → onFinish(GameResult)
                                → phase: "result"
                                     → WinModal (sebagai overlay di atas GameplayScreen)
                                          ├─ [isWin=true] useLeaderboard.addScore() (insert skor)
                                          ├─ Auto-reset jika kalah → phase: "register"
                                          └─ [isWin=true] Link ke Spin the Wheel
```

### 🏆 Alur Leaderboard
```
app/leaderboard/page.tsx [LeaderboardPage]
  └─ useLeaderboard.fetchLeaderboard()
       └─ supabase.from("leaderboard").select("*").order("score", desc).limit(10)
            → LeaderboardContent
                 ├─ PodiumPlayer (rank 1-3)   [top 3 di podium]
                 └─ RankRow (rank 4-10)       [list sisanya]
```

### 🔐 Autentikasi
Tidak ada autentikasi pengguna. Supabase diakses langsung via **anon key** publik (client-side only). Tidak ada middleware Next.js.

---

## Clean Tree

```
mjs-scream-challenge/
├── .env.local
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── public/
│   ├── in-lite.webp
│   ├── lamp.webp                        ← Gambar lampu untuk PowerMeter (fill effect)
│   ├── mjs-white.webp
│   ├── common/
│   │   ├── background.webp
│   │   ├── combo-x3.gif                 ← (tidak dipakai lagi, diganti glow effect)
│   │   ├── combo-x5.gif                 ← (tidak dipakai lagi, diganti glow effect)
│   │   ├── lamp.webp
│   │   └── power-meter.webp             ← (tidak dipakai lagi, diganti lamp.webp)
│   ├── icons/
│   ├── avatars/
│   │   ├── profile-1.png … profile-6.png
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx                     ← Entrypoint utama (state machine game)
    │   └── leaderboard/
    │       └── page.tsx                 ← Halaman leaderboard
    ├── components/
    │   ├── RegisterScreen.tsx
    │   ├── InstructionScreen.tsx
    │   ├── CountdownScreen.tsx
    │   ├── GameplayScreen.tsx
    │   ├── ResultScreen.tsx
    │   ├── PowerMeter.tsx
    │   ├── constants/
    │   │   └── avatars.ts
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   └── leaderboard/
    │       ├── PodiumPlayer.tsx
    │       └── RankRow.tsx
    ├── hooks/
    │   ├── useMicrophone.ts
    │   └── useLeaderboard.ts
    ├── lib/
    │   ├── supabase.ts
    │   ├── scoreUtils.ts
    │   └── utils.ts
    └── types/
        └── game.ts
```

---

## Module Map (The Chapters)

### App / Pages

| File | Export Utama | Peran |
|---|---|---|
| `src/app/layout.tsx` | `RootLayout` | Root HTML shell, metadata global, font class |
| `src/app/page.tsx` | `Home` | State machine game utama: mengatur `GamePhase` dan merender screen yang aktif |
| `src/app/leaderboard/page.tsx` | `LeaderboardPage`, `LeaderboardContent` | Halaman leaderboard dengan layout adaptif (mobile vs signage/desktop) |

### Components — Game Screens

| File | Export Utama | Peran |
|---|---|---|
| `src/components/RegisterScreen.tsx` | `RegisterScreen` | Form input nama + pilih avatar + pilih level (normal/hard) |
| `src/components/InstructionScreen.tsx` | `InstructionScreen` | Tampilan 3 langkah cara bermain |
| `src/components/CountdownScreen.tsx` | `CountdownScreen` | Countdown animasi 3→2→1→SCREAM! (~4 detik) |
| `src/components/GameplayScreen.tsx` | `GameplayScreen` | Core gameplay: mic → dB tracking → timer → blow duration scoring |
| `src/components/ResultScreen.tsx` | `ResultScreen` | Tampil hasil + auto-submit skor ke Supabase + countdown reset |
| `src/components/PowerMeter.tsx` | `PowerMeter` | Visualisasi kekuatan: lampu fill effect (clip-path fill dari bawah ke atas) + efek progressive glow blur saat score >= 300 |

### Components — Layout

| File | Export Utama | Peran |
|---|---|---|
| `src/components/layout/Header.tsx` | `Header` | Logo MJS + Arch ID di sudut kiri atas (absolute positioned) |
| `src/components/layout/Footer.tsx` | `Footer` | Footer halaman |

### Components — Leaderboard

| File | Export Utama | Peran |
|---|---|---|
| `src/components/leaderboard/PodiumPlayer.tsx` | `PodiumPlayer` | Kartu podium rank 1-3 dengan avatar, nama, durasi |
| `src/components/leaderboard/RankRow.tsx` | `RankRow` | Baris rank 4-10 dengan avatar, nama, durasi, dan ikon tren |

### Hooks

| File | Export Utama | Peran |
|---|---|---|
| `src/hooks/useMicrophone.ts` | `useMicrophone` | Akses mikrofon via Web Audio API, polling dB real-time via `requestAnimationFrame` |
| `src/hooks/useLeaderboard.ts` | `useLeaderboard` | Fetch top-10 dari Supabase, `addScore()`, `isTopScore()` |
| `src/hooks/useLayoutVariant.ts` | `useLayoutVariant` | Deteksi layout `"default"` (mobile) vs `"desktop"` via `matchMedia` |

### Lib / Utils

| File | Export Utama | Peran |
|---|---|---|
| `src/lib/supabase.ts` | `supabase` | Singleton Supabase client (anon key, client-side) |
| `src/lib/scoreUtils.ts` | `LEVELS`, `getConfig`, `dbToDisplayPct`, `getBlowTier`, `formatDuration` | Konfigurasi level, konversi dB → persentase/tier, format durasi |
| `src/lib/utils.ts` | `cn` | Helper clsx + tailwind-merge |

### Constants

| File | Export Utama | Peran |
|---|---|---|
| `src/components/constants/avatars.ts` | `AVATAR_IDS`, `getAvatarSrc` | Daftar 6 avatar ID dan helper path gambar |

### Types

| File | Export Utama | Peran |
|---|---|---|
| `src/types/game.ts` | `GamePhase`, `GameLevel`, `AvatarId`, `Player`, `GameResult`, `LeaderboardEntry` | Semua type/interface inti domain game |

---

## Data & Config

### Environment Variables

| File | Status |
|---|---|
| `.env.local` | Ada di root, **di-gitignore** |

**Variabel yang digunakan:**

| Key | Scope | Nilai (dari .env.local) |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client | `https://lggeemegyjptfhxyrfxq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | `sb_publishable_kpkFd...` |

> ⚠️ Tidak ada `.env.production` atau `.env.example` — konfigurasi deployment bergantung sepenuhnya pada environment variable platform (Vercel).

### Skema Data — Supabase

**Tabel: `leaderboard`**

| Kolom | Type | Keterangan |
|---|---|---|
| `id` | uuid / string | Primary key |
| `player_name` | text | Nama pemain |
| `avatar` | text | ID avatar (`profile-1` s/d `profile-6`) |
| `score` | integer | Total skor teriakan pemain |
| `level` | text | `"normal"` atau `"hard"` |
| `created_at` | timestamp | Waktu insert (auto by Supabase) |

- **Skema Baru**: Menggunakan kolom `score` (Integer) sebagai metrik utama, menggantikan `duration_ms`.
- **RLS**: Tidak terdeteksi dari kode (menggunakan anon key publik).
- **Relasi**: Satu tabel saja, tidak ada relasi.

### Level Config (scoreUtils.ts)

| Level | DB_THRESHOLD | DB_MAX | MAX_BAR_RATE |
|---|---|---|---|
| `normal` | -70 dBFS | -30 dBFS | 20 unit/sec |
| `hard` | -60 dBFS | -10 dBFS | 15 unit/sec |

---

## External Integrations

| Service | Modul Pemanggilnya | Fungsi |
|---|---|---|
| **Supabase** (PostgreSQL) | `src/lib/supabase.ts` → `useLeaderboard.ts` | Simpan & ambil data leaderboard |
| **Spin the Wheel** (`mjs-spin-wheel.vercel.app`) | `ResultScreen.tsx` (hardcoded href) | Link eksternal — pemain menang diarahkan ke wheel prize |
| **Web Audio API** (Browser native) | `useMicrophone.ts` | Akses mikrofon & analisis frekuensi real-time |
| **Google Fonts** (Bebas Neue) | Inline `style` di beberapa komponen | Font display heading (tidak diimport via `next/font`, dipanggil inline sebagai CSS string) |

---

## Risks / Blind Spots

| # | Area | Deskripsi |
|---|---|---|
| 1 | **`useLayoutVariant` hook** | Dipanggil di `leaderboard/page.tsx` tetapi **file tidak ditemukan** di `src/hooks/`. Kemungkinan bug atau file belum dibuat → akan menyebabkan compile error |
| 2 | **`@/constants/gameImages`** | Dipanggil oleh `PodiumPlayer.tsx` dan `RankRow.tsx` (`getAvatarImageSrc`, `formatTimeMs`) tetapi **path tidak ada** di codebase — file `src/constants/gameImages.ts` belum dibuat → runtime error di halaman leaderboard |
| 3 | **`formatTimeMs` di `lib/utils.ts`** | `PodiumPlayer` dan `RankRow` mengimpor dari `@/lib/utils` tetapi fungsi ini **tidak ada** di `lib/utils.ts` (hanya ada `cn`) → compile error |
| 4 | **`entry.time_ms`** | `PodiumPlayer` menggunakan `entry.time_ms` namun skema Supabase dan `LeaderboardEntry` type menggunakan `duration_ms` → field mismatch, akan selalu `undefined` |
| 5 | **RLS Supabase** | Anon key di-expose ke client (`NEXT_PUBLIC_`). Jika RLS tidak dikonfigurasi, siapapun bisa insert/delete data leaderboard langsung via API Supabase |
| 6 | **Bebas Neue font** | Tidak diimport secara resmi (Next.js `next/font` atau link tag). Dipanggil via `fontFamily: "'Bebas Neue', sans-serif"` di inline style — font hanya tampil jika sudah ter-install di browser/system |
| 7 | **`WIN_HOLD_SECONDS` vs `GAME_DURATION_S`** | Konstanta 20 detik di `LEVELS` config tidak konsisten dengan timer 120 detik di GameplayScreen — tidak ada logika yang memakai `WIN_HOLD_SECONDS` secara aktif |
| 8 | **Tidak ada error boundary** | Tidak ada React Error Boundary — error di GameplayScreen (mis. mic denied) hanya tampil sebagai teks inline, tidak ada fallback UI terstruktur |
| 9 | **`.env` tidak ada contoh** | Tidak ada `.env.example` atau dokumentasi variabel — onboarding developer baru berisiko karena config tidak terdokumentasi |
