export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string | null;
  phone?: string;
  address?: string;
  first_name?: string;
  last_name?: string;
}

// PERBAIKAN DI SINI SESUAI DATABASE
export interface Spot {
  id: number;
  nama: string;           // DB: nama (bukan name)
  lokasi: string;         // DB: lokasi (bukan address)
  kota?: string;          // DB: kota
  deskripsi?: string;     // DB: deskripsi
  harga_per_jam: number;  // DB: harga_per_jam (bukan price)
  image_url?: string;     // DB: image_url
  fasilitas?: string;     // DB: fasilitas
  jam_buka?: string;      // DB: jam_buka
  jam_tutup?: string;     // DB: jam_tutup
  rating?: number;        // (Opsional, jika backend melakukan join ke tabel reviews)
}

export interface Booking {
    id: number;
    user_id: number;
    tempat_id: number;
    tanggal_booking: string;
    no_kursi: number;
    start_time: string;
    end_time: string;
    total_harga: number;
    status: string;
    nama_tempat?: string;
    lokasi_tempat?: string;
}

export interface Product {
  id: number;
  nama: string;
  harga_sewa?: number;
  harga_beli?: number;
  image_url: string;
  kategori: string;
}

export interface Tip {
    id: number;
    judul: string;
    konten: string;
}

export interface Event {
    id: number;
    nama: string;
    kota: string;
    tanggal: string;
    total_hadiah: number;
    gambar?: string;
}

export interface Tool {
  id: number;
  nama: string;           // DB: nama
  deskripsi?: string;
  harga_sewa: number;     // DB: harga_sewa
  harga_beli: number;     // DB: harga_beli
  stok: number;
  image_url?: string;     // DB: image_url
  kategori?: string;
}