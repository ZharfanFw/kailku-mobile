// backend/routes/orders.js

async function orderRoutes(fastify, options) {
  // 1. Checkout
  fastify.post(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { items } = request.body;
      const user_id = request.user.id;

      if (!items || items.length === 0)
        return reply.status(400).send({ message: "Keranjang kosong" });

      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        await connection.beginTransaction();

        // Buat Order Header
        const [orderRes] = await connection.query(
          "INSERT INTO orders (user_id, status, total_harga) VALUES (?, ?, 0)",
          [user_id, "pending"],
        );
        const order_id = orderRes.insertId;
        let calculatedTotal = 0;

        for (const item of items) {
          // PERBAIKAN: Select dari tabel 'tempat_alat'
          const [tools] = await connection.query(
            "SELECT * FROM tempat_alat WHERE id = ?",
            [item.id],
          );

          if (tools.length === 0) continue;
          const tool = tools[0];

          let hargaSatuan = 0;
          if (item.tipe === "beli") hargaSatuan = Number(tool.harga_beli);
          else if (item.tipe === "sewa") hargaSatuan = Number(tool.harga_sewa);

          const subtotalItem = hargaSatuan * item.jumlah;
          calculatedTotal += subtotalItem;

          await connection.query(
            "INSERT INTO order_details (order_id, alat_id, tipe, jumlah, harga_saat_transaksi) VALUES (?, ?, ?, ?, ?)",
            [order_id, item.id, item.tipe, item.jumlah, hargaSatuan],
          );
        }

        // Update Total
        await connection.query(
          "UPDATE orders SET total_harga = ? WHERE id = ?",
          [calculatedTotal, order_id],
        );

        await connection.commit();
        connection.release();

        return reply.status(201).send({
          message: "Order berhasil dibuat",
          order_id,
          total: calculatedTotal,
        });
      } catch (err) {
        if (connection) {
          await connection.rollback();
          connection.release();
        }
        reply.status(500).send({ message: "Gagal membuat order" });
      }
    },
  );

  // 2. Get My Orders
  fastify.get(
    "/my",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user_id = request.user.id;
      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        const [rows] = await connection.query(
          "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
          [user_id],
        );
        connection.release();
        return rows;
      } catch (err) {
        if (connection) connection.release();
        reply.status(500).send(err);
      }
    },
  );

  // 3. Detail Order
  fastify.get(
    "/my/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user_id = request.user.id;
      const order_id = request.params.id;
      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        // PERBAIKAN: Join ke tabel 'tempat_alat'
        const [rows] = await connection.query(
          `SELECT ap.nama, od.tipe, od.jumlah, od.harga_saat_transaksi
         FROM order_details AS od
         JOIN tempat_alat AS ap ON od.alat_id = ap.id
         JOIN orders AS o ON od.order_id = o.id
         WHERE od.order_id = ? AND o.user_id = ?`,
          [order_id, user_id],
        );
        connection.release();
        return rows;
      } catch (err) {
        if (connection) connection.release();
        reply.status(500).send(err);
      }
    },
  );
}

module.exports = orderRoutes;
