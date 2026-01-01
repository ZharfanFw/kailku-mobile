// backend/routes/auth.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");

/**
 * Modul Routes untuk Autentikasi & User Management
 * Menangani: Register, Login, Profil, dan Reset Password.
 */
async function authRoutes(fastify, options) {
  // ==================================================
  // DECORATOR: Middleware "Satpam" (Authenticate)
  // Deskripsi: Fungsi ini dipasang di 'preHandler' pada route yang butuh login.
  // Tugasnya memverifikasi apakah token JWT yang dikirim user valid/tidak.
  // ==================================================
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send(err);
    }
  });

  // ==================================================
  // 1. Endpoint: Pendaftaran User Baru (Sign Up)
  // Method: POST /auth/signup
  // Alur: Validasi Input -> Hash Password -> Simpan ke DB
  // ==================================================
  fastify.post("/signup", async (request, reply) => {
    const { username, first_name, last_name, email, password } = request.body;

    // Validasi: Pastikan data wajib terisi
    if (!first_name || !last_name || !email || !password) {
      return reply.status(400).send({
        message: "Nama depan, nama belakang, email, dan password wajib diisi",
      });
    }

    let connection;
    try {
      // Keamanan: Acak password menggunakan bcrypt sebelum disimpan
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Otomatis gabungkan nama depan & belakang untuk kolom full_name
      const full_name = `${first_name} ${last_name}`;

      connection = await fastify.mysql.getConnection();

      // Simpan data user ke database
      const [result] = await connection.query(
        "INSERT INTO users (username, first_name, last_name, full_name, email, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
        [
          username || first_name.toLowerCase(),
          first_name,
          last_name,
          full_name,
          email,
          password_hash,
        ],
      );

      connection.release();

      return reply.status(201).send({
        id: result.insertId,
        username: username,
        email: email,
        first_name: first_name,
        last_name: last_name,
      });
    } catch (err) {
      if (connection) connection.release();
      // Cek jika username/email sudah terdaftar (Error Duplicate)
      if (err.code === "ER_DUP_ENTRY") {
        return reply
          .status(409)
          .send({ message: "Username atau email sudah terdaftar" });
      }
      fastify.log.error(err);
      reply.status(500).send({ message: "Terjadi error pada server" });
    }
  });

  // ==================================================
  // 2. Endpoint: Login User
  // Method: POST /auth/login
  // Alur: Cek Email -> Cek Password (Bcrypt) -> Buat Token (JWT)
  // ==================================================
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply
        .status(400)
        .send({ message: "Email dan password wajib diisi" });
    }

    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Cari user berdasarkan email
      const [rows] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );
      connection.release();

      if (rows.length === 0) {
        return reply.status(401).send({ message: "Email atau Password salah" });
      }

      const user = rows[0];

      // Bandingkan password yang dikirim dengan hash di database
      const passwordCocok = await bcrypt.compare(password, user.password_hash);

      if (!passwordCocok) {
        return reply.status(401).send({ message: "Email atau Password salah" });
      }

      // Buat "Tiket" (Token JWT) yang berlaku 1 jam
      const token = fastify.jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        { expiresIn: "1h" },
      );

      return reply.send({ token: token });
    } catch (err) {
      if (connection) connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Terjadi error pada server" });
    }
  });

  // ==================================================
  // 3. Endpoint: Lihat Profil Sendiri (Protected)
  // Method: GET /auth/profile
  // Alur: Ambil ID dari Token -> Ambil data lengkap dari DB
  // ==================================================
  fastify.get(
    "/profile",
    {
      preHandler: [fastify.authenticate], // Wajib Login
    },
    async (request, reply) => {
      const user_id = request.user.id;

      let connection;
      try {
        connection = await fastify.mysql.getConnection();

        // Mengambil kolom spesifik (termasuk first_name & last_name)
        const [rows] = await connection.query(
          "SELECT id, username, first_name, last_name, full_name, email, phone, address, avatar_url FROM users WHERE id = ?",
          [user_id],
        );

        connection.release();

        if (rows.length === 0) {
          return reply.status(404).send({ message: "User tidak ditemukan" });
        }

        return rows[0];
      } catch (err) {
        if (connection) connection.release();
        fastify.log.error(err);
        reply.status(500).send(err);
      }
    },
  );

  // ==================================================
  // 4. Endpoint: Update Profil Sendiri (Protected)
  // Method: PATCH /auth/my-profile
  // Alur: Terima Data -> Susun Query Dinamis -> Update DB
  // ==================================================
  fastify.patch(
    "/my-profile",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const user_id = request.user.id;
      const { username, first_name, last_name, email, phone, address } =
        request.body;

      if (
        !username &&
        !first_name &&
        !last_name &&
        !email &&
        !phone &&
        !address
      ) {
        return reply.status(400).send({ message: "Minimal kirim satu data" });
      }

      // Teknik Dynamic Query: Hanya update kolom yang dikirim oleh frontend
      let query = "UPDATE users SET ";
      const fieldsToUpdate = [];
      const values = [];

      if (username) {
        fieldsToUpdate.push("username = ?");
        values.push(username);
      }
      if (first_name) {
        fieldsToUpdate.push("first_name = ?");
        values.push(first_name);
      }
      if (last_name) {
        fieldsToUpdate.push("last_name = ?");
        values.push(last_name);
      }
      if (email) {
        fieldsToUpdate.push("email = ?");
        values.push(email);
      }
      if (phone) {
        fieldsToUpdate.push("phone = ?");
        values.push(phone);
      }
      if (address) {
        fieldsToUpdate.push("address = ?");
        values.push(address);
      }

      // Gabungkan bagian query
      query += fieldsToUpdate.join(", ");
      query += " WHERE id = ?";
      values.push(user_id);

      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        const [result] = await connection.query(query, values);
        connection.release();

        if (result.affectedRows === 0) {
          return reply.status(400).send({ message: "User tidak ditemukan" });
        }
        return reply.send({ message: "Profil berhasil diupdate" });
      } catch (err) {
        if (connection) connection.release();
        if (err.code === "ER_DUP_ENTRY") {
          return reply
            .status(409)
            .send({ message: "Username atau email sudah terpakai" });
        }
        fastify.log.error(err);
        reply.status(500).send({ message: "Terjadi error pada server" });
      }
    },
  );

  // ==================================================
  // 5. Endpoint: Lupa Password (Request Token)
  // Method: POST /auth/forgot-password
  // Alur: Cek Email -> Generate Token Acak -> Simpan Token di DB -> Simulasi Kirim Email
  // ==================================================
  fastify.post("/forgot-password", async (request, reply) => {
    const { email } = request.body;
    let connection;
    try {
      connection = await fastify.mysql.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );

      if (rows.length === 0) {
        connection.release();
        return reply.status(404).send({ message: "Email tidak terdaftar" });
      }

      // Generate token acak
      const token = crypto.randomBytes(20).toString("hex");

      // Simpan token & set expired 1 jam dari sekarang (menggunakan waktu server DB)
      await connection.query(
        "UPDATE users SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
        [token, email],
      );

      connection.release();

      // Simulasi pengiriman email (Log ke console)
      console.log(
        `Link Reset: http://localhost:5173/reset-password?token=${token}`,
      );

      return reply.send({
        message: "Link reset password telah dikirim ke console backend!",
      });
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send({ message: "Gagal memproses permintaan" });
    }
  });

  // ==================================================
  // 6. Endpoint: Reset Password (Gunakan Token)
  // Method: POST /auth/reset-password
  // Alur: Cek Validitas Token -> Hash Password Baru -> Update DB -> Hapus Token
  // ==================================================
  fastify.post("/reset-password", async (request, reply) => {
    const { token, newPassword } = request.body;
    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Cek apakah token cocok DAN belum kadaluarsa
      const [rows] = await connection.query(
        "SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()",
        [token],
      );

      if (rows.length === 0) {
        connection.release();
        return reply
          .status(404)
          .send({ message: "Token tidak valid atau sudah kadaluarsa" });
      }

      // Hash password baru
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(newPassword, salt);

      // Update password & bersihkan token
      await connection.query(
        "UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
        [password_hash, rows[0].id],
      );

      connection.release();
      return reply.send({
        message: "Password berhasil diubah! Silahkan login.",
      });
    } catch (err) {
      if (connection) connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Gagal mereset password" });
    }
  });
}

module.exports = authRoutes;
