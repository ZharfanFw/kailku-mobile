// backend/routes/bookings.js

async function bookingRoutes(fastify, options) {
  
  // ==========================================
  // 1. ENDPOINT PUBLIK (Bisa Diakses Guest)
  // ==========================================

  // GET /bookings/check-seats
  // Parameter: tempat_id, tanggal, start_time, duration
  fastify.get("/check-seats", async (request, reply) => {
    const { tempat_id, tanggal, start_time, duration } = request.query;

    if (!tempat_id || !tanggal || !start_time || !duration) {
      return reply.status(400).send({ message: "Data tidak lengkap (Butuh: tempat_id, tanggal, waktu, durasi)" });
    }

    // 1. Hitung Waktu Request (User B mau booking jam berapa sampai jam berapa)
    // Format start_time "12:00" -> ambil jamnya saja
    const startHourRequest = parseInt(start_time.split(':')[0]);
    const endHourRequest = startHourRequest + parseInt(duration);
    
    // Konversi ke format Time SQL (HH:MM:SS)
    const reqStart = `${startHourRequest.toString().padStart(2, '0')}:00:00`;
    const reqEnd = `${endHourRequest.toString().padStart(2, '0')}:00:00`;

    let connection;
    try {
      connection = await fastify.mysql.getConnection();
      
      // 2. QUERY LOGIKA BENTROK (OVERLAP)
      // Kita cari kursi yang SUDAH DIBOOKING pada jam yang BERSINGGUNGAN
      // Rumus Overlap: (StartA < EndB) AND (EndA > StartB)
      
      const [rows] = await connection.query(
        `SELECT no_kursi FROM bookings 
         WHERE tempat_id = ? 
         AND tanggal_booking = ? 
         AND status != 'cancelled'
         AND (
            (start_time < ? AND end_time > ?)
         )`,
        [tempat_id, tanggal, reqEnd, reqStart]
      );

      connection.release();

      // Format output menjadi array simple: [1, 2, 5]
      const bookedSeats = rows.map((row) => row.no_kursi);
      return reply.send({ bookedSeats });

    } catch (err) {
      if (connection) connection.release();
      fastify.log.error(err);
      return reply.status(500).send({ message: "Gagal cek kursi: " + err.message });
    }
  });


  // ==========================================
  // 2. ENDPOINT PRIVAT (Wajib Login)
  // ==========================================
  
  // Semua route di bawah ini akan melewati middleware cek token
  fastify.register(async function (privateRoutes) {
    
    privateRoutes.addHook("preHandler", async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    });

    // POST /bookings (Simpan Booking Tempat & Sewa Alat)
    privateRoutes.post("/", async (request, reply) => {
      const user_id = request.user.id; 
      const { 
        tempat_id, 
        tanggal_booking, // <--- Pastikan ini tidak null
        start_time, 
        duration, 
        no_kursi_list, 
        total_harga_spot, 
        cart_items 
      } = request.body;

      // VALIDASI TANGGAL
      if (!tanggal_booking) {
          return reply.status(400).send({ message: "Tanggal Booking Wajib Diisi!" });
      }

      // Hitung waktu selesai (end_time)
      // Format start_time misal "07:00"
      const [startHour] = start_time.split(':').map(Number);
      const endHour = startHour + duration;
      const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;

      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        await connection.beginTransaction(); // Mulai Transaksi Database

        // --- A. SIMPAN BOOKING TEMPAT (Loop per Kursi) ---
        // Kita simpan status 'pending' atau 'paid'. Di sini kita asumsi 'paid' 
        // jika dipanggil setelah pembayaran sukses di Mobile.
        
        // Harga per kursi = Total Harga Spot / Jumlah Kursi
        const hargaPerKursi = total_harga_spot / no_kursi_list.length;

        for (const kursi of no_kursi_list) {
            await connection.query(
              `INSERT INTO bookings (user_id, tempat_id, no_kursi, tanggal_booking, start_time, end_time, total_harga, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'paid')`, // Pastikan tanda tanya (?) ada 7 buah
              // Hapus variabel 'duration' dari array data
              [user_id, tempat_id, kursi, tanggal_booking, start_time, end_time, hargaPerKursi]
);
        }

        // --- B. SIMPAN ORDER ALAT (Jika Ada) ---
        if (cart_items && cart_items.length > 0) {
          // 1. Buat Header Order
          const total_harga_alat = cart_items.reduce((sum, item) => sum + Number(item.transaksi_price), 0);
          
          const [orderResult] = await connection.query(
              `INSERT INTO orders (user_id, tempat_id, status, total_harga) VALUES (?, ?, 'paid', ?)`,
              [user_id, tempat_id, total_harga_alat]
          );
          const orderId = orderResult.insertId;

          // 2. Buat Detail Order (Loop per item alat)
          for (const item of cart_items) {
              await connection.query(
                  `INSERT INTO order_details (order_id, alat_id, tipe, jumlah, harga_saat_transaksi)
                   VALUES (?, ?, ?, 1, ?)`,
                  [orderId, item.id, item.type, item.transaksi_price]
              );
          }
        }

        await connection.commit(); // Simpan permanen jika sukses semua
        connection.release();
        
        return reply.send({ message: "Booking dan Order berhasil disimpan!" });

      } catch (err) {
        if (connection) await connection.rollback(); // Batalkan semua jika ada 1 error
        connection.release();
        fastify.log.error(err);
        return reply.status(500).send({ message: "Gagal menyimpan transaksi: " + err.message });
      }
    });

    // GET /bookings/my (Riwayat Booking User)
    privateRoutes.get("/my", async (request, reply) => {
      const user_id = request.user.id;
      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        
        // Join ke tabel tempat_mancing untuk dapat nama tempat
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
      } catch (err) {
        if (connection) connection.release();
        return reply.status(500).send({ message: err.message });
      }
    });

  });
}

module.exports = bookingRoutes;