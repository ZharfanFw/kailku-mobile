// backend/routes/lomba.js

async function lombaRoutes(fastify, options) {
  // GET /lomba (Ambil semua data lomba)
  fastify.get('/', async (request, reply) => {
    let connection;
    try {
      connection = await fastify.mysql.getConnection();
      
      // Ambil data dari tabel 'lomba' diurutkan tanggal terbaru
      const [rows] = await connection.query(
        'SELECT * FROM lomba ORDER BY tanggal_pelaksanaan ASC'
      );
      
      connection.release();
      return rows;
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send({ message: err.message });
    }
  });

  // GET /lomba/:id (Detail lomba - opsional jika nanti butuh)
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    let connection;
    try {
      connection = await fastify.mysql.getConnection();
      const [rows] = await connection.query('SELECT * FROM lomba WHERE id = ?', [id]);
      connection.release();
      return rows[0];
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send({ message: err.message });
    }
  });
}

module.exports = lombaRoutes;