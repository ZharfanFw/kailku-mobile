// backend/routes/alat.js

/**
 * Modul Routes untuk Alat Pancing (Tabel: tempat_alat)
 * Menangani pengambilan data alat, baik semua maupun per item.
 */
async function alatRoutes(fastify, options) {
  // GET /alat_pancing?tempat_id=1
  fastify.get("/", async (request, reply) => {
    const { tempat_id } = request.query;
    
    let connection;
    try {
      connection = await fastify.mysql.getConnection();
      
      let query = "SELECT * FROM tempat_alat";
      let params = [];

      // Filter jika ada tempat_id
      if (tempat_id) {
        query += " WHERE tempat_id = ?";
        params.push(tempat_id);
      }

      const [rows] = await connection.query(query, params);
      connection.release();
      return rows;
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send({ message: err.message });
    }
  });
}

module.exports = alatRoutes;