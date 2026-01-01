// backend/routes/alat.js

/**
 * Modul Routes untuk Alat Pancing (Tabel: tempat_alat)
 * Menangani pengambilan data alat, baik semua maupun per item.
 */
async function alatRoutes(fastify, options) {
  // ==================================================
  // 1. Endpoint: Ambil Semua Alat (Dengan Filter Opsional)
  // Method: GET
  // URL: http://localhost:3000/alat_pancing
  // URL Filter: http://localhost:3000/alat_pancing?tempat_id=1,2
  // ==================================================
  fastify.get("/", async (request, reply) => {
    const { tempat_id } = request.query;

    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      let sql = "SELECT * FROM tempat_alat";
      let params = [];

      // --- LOGIKA FILTERING ---
      // Mengecek apakah user mengirim parameter 'tempat_id'
      if (tempat_id) {
        // 1. Pastikan input jadi string agar aman saat di-split
        const idString = String(tempat_id);

        // 2. Parsing String: "1, 2, a" -> Menjadi Array [1, 2]
        // - split(','): Memecah string berdasarkan koma
        // - map(parseInt): Mengubah teks jadi angka
        // - filter(!isNaN): Membuang data sampah yang bukan angka
        const ids = idString
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));

        // 3. Susun Query SQL Dinamis
        if (ids.length > 0) {
          // Membuat tanda tanya sebanyak jumlah ID (misal: "?, ?, ?")
          const placeholders = ids.map(() => "?").join(", ");

          // Gabungkan ke query utama: SELECT * ... WHERE tempat_id IN (1, 2)
          sql += ` WHERE tempat_id IN (${placeholders})`;
          params = ids;
        }
      }

      // Eksekusi Query ke Database
      const [rows] = await connection.query(sql, params);
      connection.release();

      return rows;
    } catch (err) {
      // Error Handling: Lepas koneksi & log error jika terjadi masalah
      if (connection) connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Terjadi kesalahan pada server" });
    }
  });

  // ==================================================
  // 2. Endpoint: Ambil Satu Alat (Detail)
  // Method: GET
  // URL: http://localhost:3000/alat_pancing/:id
  // ==================================================
  fastify.get("/:id", async (request, reply) => {
    const id = request.params.id;
    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Query spesifik berdasarkan ID alat
      const [rows] = await connection.query(
        "SELECT * FROM tempat_alat WHERE id = ?",
        [id],
      );
      connection.release();

      // Cek apakah data ditemukan
      if (rows.length === 0)
        return reply.status(404).send({ message: "Alat tidak ditemukan" });

      // Kembalikan objek pertama (karena ID pasti unik/satu)
      return rows[0];
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send({ message: "Server Error" });
    }
  });
}

module.exports = alatRoutes;
