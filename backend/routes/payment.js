// backend/routes/payment.js

/**
 * Modul Routes untuk Pembayaran (Payment Gateway Simulation)
 * Menangani: Pembuatan Tagihan (Create Invoice) dan Konfirmasi Pelunasan (Pay).
 */
async function paymentRoutes(fastify, options) {
  // ==================================================
  // 1. Endpoint: Buat Tagihan Baru (Create Payment)
  // Method: POST
  // URL: /payment/create
  // Deskripsi: Merekam data tagihan ke tabel 'payments' dengan status 'menunggu_verifikasi'.
  //            Juga menghubungkan booking & order ke ID pembayaran ini.
  // ==================================================
  fastify.post(
    "/create",
    {
      preHandler: [fastify.authenticate], // Wajib Login
    },
    async (request, reply) => {
      const user_id = request.user.id;
      const { booking_ids, order_ids, payment_method, total_amount } =
        request.body;

      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        await connection.beginTransaction();

        // --- LOGIKA MAPPING METODE BAYAR ---
        // Mengubah string dari frontend (misal 'bca') menjadi format database (misal 'transfer_bca')
        // karena kolom di database tipe datanya VARCHAR(50) atau ENUM tertentu.
        let dbMethod = "other";

        if (payment_method === "qris") {
          dbMethod = "qris";
        } else if (payment_method === "cod") {
          dbMethod = "cod";
        } else {
          // Untuk semua bank (bca, mandiri, seabank, dll), kita tambah prefix 'transfer_'
          dbMethod = `transfer_${payment_method}`;
        }

        // A. Simpan Data Tagihan ke Tabel 'payments'
        const [res] = await connection.query(
          `INSERT INTO payments (user_id, metode_pembayaran, jumlah_bayar, status_pembayaran) 
           VALUES (?, ?, ?, 'menunggu_verifikasi')`,
          [user_id, dbMethod, total_amount],
        );
        const paymentId = res.insertId; // Dapatkan ID Tagihan Baru

        // B. Hubungkan Booking ke Tagihan Ini (Update kolom payment_id)
        if (booking_ids && booking_ids.length > 0) {
          // Syntax 'WHERE id IN (?)' sangat aman & efisien untuk update banyak baris sekaligus
          await connection.query(
            "UPDATE bookings SET payment_id = ? WHERE id IN (?)",
            [paymentId, booking_ids],
          );
        }

        // C. Hubungkan Order Alat ke Tagihan Ini (Update kolom payment_id)
        if (order_ids && order_ids.length > 0) {
          await connection.query(
            "UPDATE orders SET payment_id = ? WHERE id IN (?)",
            [paymentId, order_ids],
          );
        }

        await connection.commit();
        connection.release();

        // Kembalikan payment_id agar frontend bisa redirect ke halaman eksekusi (QR/VA)
        return reply.send({ payment_id: paymentId });
      } catch (err) {
        if (connection) {
          await connection.rollback();
          connection.release();
        }
        reply.status(500).send(err);
      }
    },
  );

  // ==================================================
  // 2. Endpoint: Ambil Detail Tagihan
  // Method: GET
  // URL: /payment/:id
  // Deskripsi: Mengambil info tagihan (jumlah bayar, metode) untuk ditampilkan di halaman eksekusi.
  // ==================================================
  fastify.get(
    "/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const paymentId = request.params.id;
      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        const [rows] = await connection.query(
          "SELECT * FROM payments WHERE id = ?",
          [paymentId],
        );
        connection.release();

        if (rows.length === 0)
          return reply.status(404).send({ message: "Tagihan tidak ditemukan" });

        return rows[0];
      } catch (err) {
        reply.status(500).send(err);
      }
    },
  );

  // ==================================================
  // 3. Endpoint: Konfirmasi Bayar (Simulasi Lunas)
  // Method: POST
  // URL: /payment/:id/pay
  // Deskripsi: Mengubah status pembayaran menjadi 'berhasil' dan semua item terkait menjadi 'paid'.
  // ==================================================
  fastify.post(
    "/:id/pay",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const paymentId = request.params.id;
      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        await connection.beginTransaction();

        // A. Tandai Tagihan Lunas
        await connection.query(
          "UPDATE payments SET status_pembayaran = 'berhasil' WHERE id = ?",
          [paymentId],
        );

        // B. Tandai Booking Lunas (Sesuai Payment ID)
        await connection.query(
          "UPDATE bookings SET status = 'paid' WHERE payment_id = ?",
          [paymentId],
        );

        // C. Tandai Order Alat Lunas (Sesuai Payment ID)
        await connection.query(
          "UPDATE orders SET status = 'paid' WHERE payment_id = ?",
          [paymentId],
        );

        await connection.commit();
        connection.release();

        return reply.send({ message: "Pembayaran Berhasil" });
      } catch (err) {
        if (connection) await connection.rollback();
        reply.status(500).send(err);
      }
    },
  );
}

module.exports = paymentRoutes;
