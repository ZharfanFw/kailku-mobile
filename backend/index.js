// backend/index.js

// 1. LOAD ENVIRONMENT VARIABLES
// Memuat variabel rahasia dari file .env ke dalam process.env
// Wajib paling atas agar konfigurasi terbaca sebelum kode lain jalan.
require("dotenv").config();

// 2. INISIALISASI FRAMEWORK
// Membuat instance aplikasi Fastify dengan logger aktif.
const fastify = require("fastify")({ logger: true });
const jwt = require("@fastify/jwt");

// ==================================================
// 3. REGISTER PLUGIN (ALAT-ALAT UTAMA)
// ==================================================

// A. CORS (Cross-Origin Resource Sharing)
// Mengizinkan Frontend (Vue.js) mengakses Backend ini.
fastify.register(require("@fastify/cors"), {
    // origin: ["http://localhost:3000", "http://10.0.2.2:3000"], // Izinkan semua origin (untuk development)
    origin: true, // Izinkan semua origin (untuk development)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
});

// B. DATABASE (MySQL)
// Mengatur koneksi ke database menggunakan kredensial dari .env
fastify.register(require("@fastify/mysql"), {
    promise: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// C. JWT (JSON Web Token)
// Mengatur kunci rahasia untuk token login.
fastify.register(jwt, { secret: process.env.JWT_SECRET });

// ==================================================
// 4. DECORATOR (MIDDLEWARE GLOBAL)
// ==================================================

// Fungsi 'authenticate' sebagai "Satpam" rute.
// Bisa dipanggil di rute manapun dengan { preHandler: [fastify.authenticate] }
fastify.decorate("authenticate", async function (request, reply) {
    try {
        // Verifikasi token di header Authorization: Bearer <token>
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// ==================================================
// 5. REGISTER ROUTES (DAFTAR DEPARTEMEN)
// ==================================================
// Mendaftarkan file-file rute modular dari folder 'routes'.

// Auth: Login, Register, Profil -> /auth/...
fastify.register(require("./routes/auth"), { prefix: "/auth" });

// Tempat: Data Lokasi Mancing -> /tempat_mancing/...
fastify.register(require("./routes/spot"), { prefix: "/tempat_mancing" });

// Alat: Katalog Alat Pancing -> /alat_pancing/...
fastify.register(require("./routes/alat"), { prefix: "/alat_pancing" });

// Booking: Sewa Tempat -> /bookings/...
fastify.register(require("./routes/bookings"), { prefix: "/bookings" });

// Order: Sewa/Beli Alat -> /orders/...
fastify.register(require("./routes/orders"), { prefix: "/orders" });

// Review: Ulasan Tempat -> /reviews/...
fastify.register(require("./routes/reviews"), { prefix: "/reviews" });

// Payment: Transaksi Pembayaran -> /payment/...
fastify.register(require("./routes/payment"), { prefix: "/payment" });

// Content: Konten Statis (Tips, Lomba) -> /content/...
fastify.register(require("./routes/content"), { prefix: "/content" });

// ==================================================
// 6. JALANKAN SERVER
// ==================================================
const start = async () => {
    try {
        // Gunakan process.env.PORT jika ada (untuk deploy), default 3000
        // Host '0.0.0.0' penting agar bisa diakses dari network lain (Docker/LAN)
        const port = process.env.PORT || 3000;
        await fastify.listen({ port: port, host: "0.0.0.0" });

        console.log(`Server backend berjalan di http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};



start();
