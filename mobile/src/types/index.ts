export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
}

export interface Spot {
  id: number;
  nama: string;           // Di DB: nama (bukan name)
  lokasi: string;         // Di DB: lokasi (bukan address)
  kota: string;
  deskripsi: string;
  harga_per_jam: number;  // Di DB: harga_per_jam (bukan price)
  image_url: string;
  fasilitas: string;
  jam_buka: string;
  jam_tutup: string;
  jumlah_lapak: number;
  
  // Rating tidak ada di tabel tempat_mancing (harus di-join dari tabel reviews)
  // Jadi kita kasih tanda tanya (?) agar tidak error jika kosong
  rating?: number; 
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
