// backend/routes/content.js

/**
 * Modul Routes untuk Konten Statis (Tips & Lomba)
 * Menangani pengambilan data informasi tambahan untuk ditampilkan di Homepage.
 */
async function contentRoutes(fastify, options) {
  // ==================================================
  // 1. Endpoint: Ambil Daftar Tips & Trik
  // Method: GET
  // URL: http://localhost:3000/content/tips
  // Deskripsi: Mengambil 6 tips pertama untuk ditampilkan di Carousel.
  // ==================================================
  fastify.get("/tips", async (request, reply) => {
    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Query: Ambil semua kolom dari tabel tips, urutkan dari ID awal, batasi 6 item
      const [rows] = await connection.query(
        "SELECT * FROM tips ORDER BY id ASC LIMIT 6",
      );

      connection.release();
      return rows;
    } catch (err) {
      if (connection) connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Gagal mengambil data tips" });
    }
  });

  // ==================================================
  // 2. Endpoint: Ambil Daftar Lomba Mendatang
  // Method: GET
  // URL: http://localhost:3000/content/lomba
  // Deskripsi: Mengambil 3 lomba terdekat yang belum lewat tanggalnya.
  // ==================================================
  fastify.get("/lomba", async (request, reply) => {
    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Query Pintar:
      // WHERE tanggal_pelaksanaan > NOW() -> Hanya ambil lomba di masa depan
      // ORDER BY tanggal_pelaksanaan ASC  -> Urutkan dari yang paling dekat tanggalnya
      // LIMIT 3                           -> Cukup tampilkan 3 lomba teratas
      const [rows] = await connection.query(
        "SELECT * FROM lomba WHERE tanggal_pelaksanaan > NOW() ORDER BY tanggal_pelaksanaan ASC LIMIT 3",
      );

      connection.release();
      return rows;
    } catch (err) {
      if (connection) connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Gagal mengambil data lomba" });
    }
  });
}

module.exports = contentRoutes;
