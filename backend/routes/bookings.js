// backend/routes/bookings.js

/**
 * Modul Routes untuk Booking (Reservasi Tempat Mancing)
 * Menangani: Pembuatan Booking, Cek Ketersediaan Kursi, Riwayat Booking, dan Pembatalan.
 */
async function bookingRoutes(fastify, options) {
  // --- Helper: Hitung Jam Selesai ---
  // Fungsi kecil untuk menjumlahkan Jam Mulai + Durasi
  // Contoh: "10:00" + 2 jam = "12:00"
  function calculateEndTime(startTime, duration) {
    if (!startTime || !duration) return "00:00:00";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + Number(duration);
    // Format output HH:MM (pad dengan 0 jika satu digit)
    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  // ==================================================
  // 1. Endpoint: Buat Booking Baru (LENGKAP)
  // Method: POST
  // URL: http://localhost:3000/bookings/
  // ==================================================
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate], // Wajib Login
    },
    async (request, reply) => {
      // Ambil data dari Frontend
      const { tempat_id, tanggal_booking, no_kursi, start_time, duration } =
        request.body;
      const user_id = request.user.id;

      // Validasi Kelengkapan Data
      if (
        !tempat_id ||
        !tanggal_booking ||
        !no_kursi ||
        !start_time ||
        !duration
      ) {
        return reply
          .status(400)
          .send({ message: "Data booking tidak lengkap (Jam/Durasi/Kursi)" });
      }

      // Hitung jam selesai secara otomatis di backend
      const end_time = calculateEndTime(start_time, duration);

      let connection;
      try {
        connection = await fastify.mysql.getConnection();

        // LANGKAH 1: AMBIL HARGA TEMPAT DULU
        // Kita tidak percaya harga dari frontend, ambil langsung dari database master.
        const [tempatRows] = await connection.query(
          "SELECT harga_per_jam FROM tempat_mancing WHERE id = ?",
          [tempat_id],
        );

        if (tempatRows.length === 0) {
          connection.release();
          return reply.status(404).send({ message: "Tempat tidak ditemukan" });
        }

        // Hitung Total Harga (Harga per Jam x Durasi)
        const hargaPerJam = Number(tempatRows[0].harga_per_jam);
        const totalHarga = hargaPerJam * duration;

        // LANGKAH 2: CEK BENTROK (Safety Net)
        // Pastikan tidak ada booking lain di kursi yang sama pada jam yang beririsan.
        // Logika Bentrok: (Jam Mulai Baru < Jam Selesai Lama) DAN (Jam Selesai Baru > Jam Mulai Lama)
        const [existing] = await connection.query(
          `SELECT id FROM bookings 
             WHERE tempat_id = ? AND no_kursi = ? AND tanggal_booking = ?
             AND (start_time < ? AND end_time > ?)`,
          [tempat_id, no_kursi, tanggal_booking, end_time, start_time],
        );

        if (existing.length > 0) {
          connection.release();
          return reply.status(409).send({
            message: `Kursi ${no_kursi} sudah terisi di jam tersebut.`,
          });
        }

        // LANGKAH 3: INSERT DATA (Status awal 'pending')
        const [result] = await connection.query(
          "INSERT INTO bookings (user_id, tempat_id, no_kursi, tanggal_booking, start_time, end_time, total_harga, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')",
          [
            user_id,
            tempat_id,
            no_kursi,
            tanggal_booking,
            start_time,
            end_time,
            totalHarga,
          ],
        );

        connection.release();

        return reply.status(201).send({
          id: result.insertId,
          user_id,
          tempat_id,
          no_kursi,
          tanggal_booking,
          totalHarga,
        });
      } catch (err) {
        if (connection) connection.release();
        fastify.log.error(err);
        reply.status(500).send({ message: "Gagal menyimpan booking" });
      }
    },
  );

  // ==================================================
  // 2. Endpoint: Riwayat Booking Saya
  // Method: GET
  // URL: http://localhost:3000/bookings/my
  // ==================================================
  fastify.get(
    "/my",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const user_id = request.user.id;
      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        // Menggunakan JOIN untuk mengambil Nama Tempat dan Lokasi sekaligus
        const [rows] = await connection.query(
          `SELECT
            b.*,
            t.nama AS nama_tempat,
            t.lokasi AS lokasi_tempat
           FROM bookings AS b
           JOIN tempat_mancing AS t ON b.tempat_id = t.id
           WHERE b.user_id = ? 
           ORDER BY b.id DESC`, // Urutkan dari yang terbaru
          [user_id],
        );
        connection.release();
        return rows;
      } catch (err) {
        if (connection) connection.release();
        fastify.log.error(err);
        reply.status(500).send({ message: "Terjadi kesalahan pada server" });
      }
    },
  );

  // ==================================================
  // 3. Endpoint: Batalkan Booking
  // Method: DELETE
  // URL: http://localhost:3000/bookings/my/:id
  // ==================================================
  fastify.delete(
    "/my/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const user_id = request.user.id;
      const booking_id = request.params.id;
      let connection;
      try {
        connection = await fastify.mysql.getConnection();
        // Menghapus hanya jika ID Booking cocok DAN User ID cocok (Security)
        const [results] = await connection.query(
          "DELETE FROM bookings WHERE id = ? AND user_id = ?",
          [booking_id, user_id],
        );
        connection.release();

        if (results.affectedRows === 0) {
          return reply.status(404).send({
            message: "Booking tidak ditemukan atau Anda tidak memiliki izin",
          });
        }
        return reply.status(204).send();
      } catch (err) {
        if (connection) connection.release();
        fastify.log.error(err);
        reply.status(500).send({ message: "Terjadi kesalahan pada server" });
      }
    },
  );

  // ==================================================
  // 4. Endpoint: Cek Kursi Sibuk (Global Filter / Peta Warna Merah)
  // Method: GET
  // URL: /bookings/check-seats?tempat_id=1&tanggal=...&start=...&durasi=...
  // ==================================================
  fastify.get("/check-seats", async (request, reply) => {
    // Frontend mengirim parameter lewat Query String
    const { tempat_id, tanggal, start, durasi } = request.query;

    if (!tempat_id || !tanggal) return { bookedSeats: [] };

    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Query Dasar: Ambil semua kursi yang dibooking di tanggal tersebut
      let query =
        "SELECT no_kursi FROM bookings WHERE tempat_id = ? AND tanggal_booking = ?";
      const params = [tempat_id, tanggal];

      // Jika User sudah memilih Jam (Filter Lebih Spesifik):
      // Cek hanya kursi yang BENTROK jamnya dengan pilihan user.
      if (start && durasi) {
        const [h, m] = start.split(":").map(Number);
        const endH = h + Number(durasi);
        const reqStart = start;
        const reqEnd = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

        // Logika Bentrok: (StartDB < RequestEnd) AND (EndDB > RequestStart)
        query += " AND (start_time < ? AND end_time > ?)";
        params.push(reqEnd, reqStart);
      }

      const [rows] = await connection.query(query, params);
      connection.release();

      // Kembalikan Array nomor kursi yang sibuk [1, 5, 12]
      return { bookedSeats: rows.map((r) => r.no_kursi) };
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send(err);
    }
  });

  // ==================================================
  // 5. Endpoint: Ambil Jadwal Spesifik (Smart Dropdown)
  // Method: GET
  // URL: /bookings/schedule?tempat_id=1&no_kursi=10&tanggal=...
  // Deskripsi: Mengambil daftar jam yang SUDAH TERISI di kursi tertentu.
  // ==================================================
  fastify.get("/schedule", async (request, reply) => {
    const { tempat_id, no_kursi, tanggal } = request.query;

    let connection;
    try {
      connection = await fastify.mysql.getConnection();

      // Ambil jam mulai & selesai dari kursi yang sedang dicek
      const [rows] = await connection.query(
        "SELECT start_time, end_time FROM bookings WHERE tempat_id = ? AND no_kursi = ? AND tanggal_booking = ?",
        [tempat_id, no_kursi, tanggal],
      );

      connection.release();

      // Balikin array jadwal: [{start_time: '10:00', end_time: '12:00'}, ...]
      // Frontend akan menggunakan ini untuk mendisable jam di dropdown.
      return rows;
    } catch (err) {
      if (connection) connection.release();
      reply.status(500).send(err);
    }
  });
}

module.exports = bookingRoutes;
