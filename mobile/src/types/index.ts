export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
}

export interface Spot {
    id: string;
    nama: string;
    lokasi: string;
    harga_per_jam: number;
    image_url?: string;
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
    id: string;
    nama: string;
    harga_beli: number;
    harga_sewa: number;
    diskon?: number;
    image_url?: string;
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
