// mobile/src/types/index.tsx

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

export interface Spot {
  id: number;
  nama: string;
  lokasi: string;
  kota?: string;
  harga_per_jam: number;
  image_url?: string;
  rating?: number;
  deskripsi?: string;
  fasilitas?: string;
}

export interface Lomba {
  id: number;
  nama_lomba: string;
  lokasi: string;
  tanggal_pelaksanaan: string;
  biaya_pendaftaran: number;
  hadiah_utama: string;
  image_url?: string;
  deskripsi?: string;
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

// Gunakan satu interface ini untuk Alat Pancing (Sewa/Beli)
// Menggabungkan Product dan Tool yang sebelumnya terpisah
export interface Tool {
  id: number;
  nama: string;
  deskripsi?: string;
  harga_sewa: number;  // Bisa null di DB, tapi di UI kita handle sbg number (0 jika null)
  harga_beli: number;
  stok: number;
  image_url?: string;
  kategori?: string;
  // Properti tambahan untuk keranjang belanja (Frontend only)
  transaksi_price?: number; 
  type?: "sewa" | "beli";
}

// Hapus interface Product yang duplikat agar tidak bingung
// export interface Product { ... } <--- HAPUS INI

export interface Tip {
  id: number;
  judul: string;
  konten: string;
}