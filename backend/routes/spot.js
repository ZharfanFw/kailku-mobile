// backend/routes/tempat.js

/**
 * Modul Routes untuk Tempat Pemancingan (Venues).
 * Menangani: Pengambilan daftar tempat dan detail informasi tempat mancing.
 */
async function tempatRoutes(fastify, options) {
  // ==================================================
  // 1. Endpoint: Ambil Seluruh Tempat Mancing
  // Method: GET
  // URL Akses: http://localhost:3000/tempat_mancing/
  // Deskripsi: Mengambil daftar semua tempat pemancingan yang tersedia di database.
  // ==================================================
  fastify.get("/", async (request, reply) => {
    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Eksekusi query untuk mengambil semua data dari tabel 'tempat_mancing'
      const [rows, fields] = await connection.query(
        "SELECT * FROM tempat_mancing",
      );

      connection.release();

      // Mengembalikan array data ke frontend
      return rows;
    } catch (err) {
      if (connection) connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Terjadi kesalahan pada server" });
    }
  });

  // ==================================================
  // 2. Endpoint: Ambil Detail Tempat Spesifik
  // Method: GET
  // URL Akses: http://localhost:3000/tempat_mancing/:id
  // Deskripsi: Mengambil detail lengkap satu tempat pemancingan berdasarkan ID.
  // ==================================================
  fastify.get("/:id", async (request, reply) => {
    const id = request.params.id; // Ambil ID dari URL

    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Query dengan parameter ID (menggunakan '?' untuk mencegah SQL Injection)
      const [rows, fields] = await connection.query(
        "SELECT * FROM tempat_mancing WHERE id = ?",
        [id],
      );

      connection.release();

      // Validasi: Jika data tidak ditemukan (array kosong)
      if (rows.length === 0) {
        return reply
          .status(404)
          .send({ message: "Tempat mancing tidak ditemukan" });
      }

      // Mengembalikan objek data pertama (karena ID unik)
      return rows[0];
    } catch (err) {
      if (connection) connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Terjadi kesalahan pada server" });
    }
  });
}

module.exports = tempatRoutes;
