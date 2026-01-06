// backend/routes/bookings.js

/**
 * Modul Routes untuk Booking (Reservasi Tempat Mancing)
 * Menangani: Pembuatan Booking, Cek Ketersediaan Kursi, Riwayat Booking, dan Pembatalan.
 */
async function bookingRoutes(fastify, options) {
  // Middleware Authenticate
  fastify.addHook("preHandler", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // POST /bookings (Simpan Booking & Order Alat)
  fastify.post("/", async (request, reply) => {
    const user_id = request.user.id; // Dari Token JWT
    const { 
      tempat_id, 
      tanggal_booking, 
      start_time, 
      duration, 
      no_kursi_list, // Array kursi: [1, 2]
      total_harga_spot, 
      cart_items // Array alat: [{id, type, price, ...}]
    } = request.body;

    // Hitung end_time
    const [startHour] = start_time.split(':').map(Number);
    const endHour = startHour + duration;
    const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;

    let connection;
    try {
      connection = await fastify.mysql.getConnection();
      await connection.beginTransaction(); // Mulai Transaksi Database

      // 1. Simpan Data Booking (Satu row per kursi atau satu group? 
      // Sesuai DB Anda 'no_kursi' itu INT, bukan string/array. 
      // Jadi kita buat loop insert untuk setiap kursi yang dipesan)
      
      const bookingIds = [];
      
      // Kita asumsikan 1 booking ID mewakili 1 transaksi utama, 
      // tapi karena struktur DB mengharuskan no_kursi per row, kita insert per kursi.
      // ATAU untuk simplifikasi aplikasi ini, kita ambil kursi pertama sebagai perwakilan row utama,
      // lalu kursi sisanya bisa diurus nanti. Tapi mari kita buat insert loop agar data kursi akurat.
      
      for (const kursi of no_kursi_list) {
          const [result] = await connection.query(
            `INSERT INTO bookings (user_id, tempat_id, no_kursi, tanggal_booking, start_time, end_time, total_harga, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'paid')`, // Langsung paid karena asumsi lewat payment gateway sukses
            [user_id, tempat_id, kursi, tanggal_booking, start_time, end_time, (total_harga_spot / no_kursi_list.length)]
          );
          bookingIds.push(result.insertId);
      }

      // 2. Simpan Data Order Alat (Jika ada)
      if (cart_items && cart_items.length > 0) {
        // Buat 1 row di tabel 'orders' sebagai header transaksi alat
        const total_harga_alat = cart_items.reduce((sum, item) => sum + item.transaksi_price, 0);
        
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, tempat_id, status, total_harga) VALUES (?, ?, 'paid', ?)`,
            [user_id, tempat_id, total_harga_alat]
        );
        const orderId = orderResult.insertId;

        // Insert detail alat ke 'order_details'
        for (const item of cart_items) {
            await connection.query(
                `INSERT INTO order_details (order_id, alat_id, tipe, jumlah, harga_saat_transaksi)
                 VALUES (?, ?, ?, 1, ?)`,
                [orderId, item.id, item.type, item.transaksi_price]
            );
        }
      }

      await connection.commit(); // Simpan permanen
      connection.release();
      return reply.send({ message: "Booking berhasil disimpan!", bookingIds });

    } catch (err) {
      if (connection) await connection.rollback(); // Batalkan jika error
      connection.release();
      fastify.log.error(err);
      reply.status(500).send({ message: "Gagal menyimpan booking" });
    }
  });
  
  // Endpoint Cek Kursi (Sudah ada sebelumnya, pastikan tetap ada)
  fastify.get("/check-seats", async (request, reply) => {
      const { tempat_id, tanggal } = request.query;
      const connection = await fastify.mysql.getConnection();
      const [rows] = await connection.query(
          "SELECT no_kursi FROM bookings WHERE tempat_id = ? AND tanggal_booking = ? AND status != 'cancelled'",
          [tempat_id, tanggal]
      );
      connection.release();
      return { bookedSeats: rows.map(r => r.no_kursi) };
  });
  
  // Endpoint Riwayat Booking (My Bookings)
  fastify.get("/my", async (request, reply) => {
      const user_id = request.user.id;
      const connection = await fastify.mysql.getConnection();
      // Join dengan tabel tempat_mancing untuk dapat nama tempat
      const [rows] = await connection.query(
          `SELECT b.*, t.nama as tempat_nama, t.lokasi as tempat_lokasi 
           FROM bookings b
           JOIN tempat_mancing t ON b.tempat_id = t.id
           WHERE b.user_id = ?
           ORDER BY b.created_at DESC`,
          [user_id]
      );
      connection.release();
      return rows;
  });
}

module.exports = bookingRoutes;