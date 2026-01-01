// backend/routes/reviews.js

/**
 * Modul Routes untuk Ulasan (Reviews)
 * Menangani: Menampilkan daftar ulasan per tempat dan mengirim ulasan baru.
 */
async function reviewRoutes(fastify, options) {
  // ==================================================
  // 1. Endpoint: Ambil Daftar Review per Tempat
  // Method: GET
  // URL: /reviews?tempat_id=1
  // Deskripsi: Mengambil ulasan beserta data user yang menulisnya (Nama & Avatar).
  // ==================================================
  fastify.get("/", async (request, reply) => {
    const { tempat_id } = request.query;

    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Query JOIN: Mengambil data review (r.*) DAN data user (u.full_name, dll)
      // Ini penting agar di frontend bisa tampil "Budi Santoso" bukan cuma "User ID 5"
      const [rows] = await connection.query(
        `SELECT r.*, u.username, u.full_name, u.avatar_url 
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.tempat_id = ?
         ORDER BY r.created_at DESC`, // Urutkan dari yang terbaru
        [tempat_id],
      );

      connection.release();

      return rows;
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send(err);
    }
  });

  // ==================================================
  // 2. Endpoint: Kirim Review Baru
  // Method: POST
  // URL: /reviews/
  // Syarat: Wajib Login (Butuh Token)
  // ==================================================
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate], // Middleware cek login
    },
    async (request, reply) => {
      const { tempat_id, rating, komentar } = request.body;
      const user_id = request.user.id; // Ambil ID dari token

      let connection;
      try {
        connection = await fastify.mysql.getConnection();

        // Simpan ulasan ke database
        const [result] = await connection.query(
          "INSERT INTO reviews (user_id, tempat_id, rating, komentar) VALUES (?, ?, ?, ?)",
          [user_id, tempat_id, rating, komentar],
        );

        connection.release();

        return reply.status(201).send({ message: "Review berhasil dikirim" });
      } catch (err) {
        if (connection) connection.release();
        reply.status(500).send(err);
      }
    },
  );
}

module.exports = reviewRoutes;
