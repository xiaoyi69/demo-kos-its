# NemuKos — Vercel Ready

Static frontend demo siap deploy ke Vercel.

## Deploy
Upload folder/ZIP ini ke GitHub lalu Import ke Vercel. Tidak perlu build command.

- Framework Preset: Other
- Build Command: kosong
- Output Directory: .

`index.html` sudah berada di root sehingga homepage langsung muncul.

Catatan: versi ini adalah static/demo mode agar langsung berjalan di Vercel tanpa backend Java. Data listing, login/register, dan post listing disimulasikan di browser. Untuk database + Spring Boot production, backend perlu di-host terpisah dan API URL dihubungkan ke frontend.
