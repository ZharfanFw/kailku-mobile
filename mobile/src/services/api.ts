import { apiClient } from "../config/api";
import { Spot, Tool } from "../types"; // Ubah Product jadi Tool

export const api = {

    
    get: async <T>(endpoint: string, params?: object): Promise<T> => {
        const response = await apiClient.get<T>(endpoint, { params });
        return response.data;
    },

    post: async <T>(endpoint: string, data: object): Promise<T> => {
        const response = await apiClient.post<T>(endpoint, data);
        return response.data;
    },

    // UBAH INI:
    delete: async <T>(endpoint: string): Promise<T> => { // Sebelumnya 'detele'
        const response = await apiClient.delete<T>(endpoint);
        return response.data;
    },
    patch: async <T>(endpoint: string, data: object): Promise<T> => {
        const response = await apiClient.patch<T>(endpoint, data);
        return response.data;
    },

    auth: {
        login: async (email: string, password: string) => {
            return await api.post<{ token: string; user: any }>("/auth/login", {
                email,
                password,
            });
        },

        signup: async (data: {
            username: string;
            email: string;
            password: string;
            first_name: string;
            last_name: string;
        }) => {
            return await api.post<{ user: any }>("/auth/signup", data);
        },

        logout: async () => {
            return await api.post("/auth/logout", {});
        },

        updateProfile: async (data: {
            username?: string;
            first_name?: string;
            last_name?: string;
            phone?: string;
            address?: string;
        }) => {
            return await api.patch("/auth/my-profile", data);
        },
    },

    spots: {
    getAll: async () => {
      const response = await apiClient.get("/spots");
      return response.data;
    },
    getById: async (id: string | number) => {
      const response = await apiClient.get(`/spots/${id}`);
      return response.data;
    },
  },

    content: {
        getTips: async () => {
            return await api.get<any[]>("/content/tips");
        },

        getEvents: async () => {
            return await api.get<any[]>("/content/lomba");
        },
    },

    bookings: {
    create: async (data: any) => {
      const response = await apiClient.post("/bookings", data);
      return response.data;
    },
    // UPDATE FUNGSI INI:
    checkSeats: async (tempat_id: string, tanggal: string, start_time: string, duration: number) => {
      const response = await apiClient.get("/bookings/check-seats", {
        params: { tempat_id, tanggal, start_time, duration },
      });
      return response.data;
    },
    myBookings: async () => {
      const response = await apiClient.get("/bookings/my");
      return response.data;
    },
  },
  

    products: {
    getAll: async (tempat_id?: string) => {
        const response = await apiClient.get("/alat_pancing", { params: { tempat_id } });
        return response.data;
    },
  },

    // TAMBAHKAN endpoint events/lomba (Pastikan backend punya route GET /lomba)
  // Jika backend belum punya route '/lomba', Anda perlu membuatnya dulu di backend.
  // Asumsi: Anda sudah membuat GET /lomba di backend yang me-return SELECT * FROM lomba
  events: {
    getAll: async () => {
      // Ganti URL ini jika endpoint backend Anda berbeda (misal: /events)
      // Kita asumsikan endpoint backendnya adalah /spots/lomba atau buat route baru /lomba
      // Untuk solusi cepat, saya akan mock data di UI jika fetch gagal, 
      // tapi idealnya panggil: return (await apiClient.get("/lomba")).data;
      try {
          const response = await apiClient.get("/lomba");
          return response.data;
      } catch (e) {
          console.warn("Endpoint /lomba belum ada, return empty array");
          return [];
      }
    }
  }
};