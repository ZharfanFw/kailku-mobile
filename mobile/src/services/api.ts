import { apiClient } from "../config/api";
import { Spot, Product } from "../types";

export const api = {
    get: async <T>(endpoint: string, params?: object): Promise<T> => {
        const response = await apiClient.get<T>(endpoint, { params });
        return response.data;
    },

    post: async <T>(endpoint: string, data: object): Promise<T> => {
        const response = await apiClient.post<T>(endpoint, data);
        return response.data;
    },

    detele: async <T>(endpoint: string): Promise<T> => {
        const response = await apiClient.delete<T>(endpoint);
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
    },

    spots: {
        getAll: async (): Promise<Spot[]> => {
            return await api.get<Spot[]>("/tempat_mancing");
        },

        getById: async (id: string): Promise<Spot> => {
            return await api.get<Spot>(`/tempat_mancing/${id}`);
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
        create: async (data: {
            tempat_id: string;
            tanggal_booking: string;
            no_kursi: number;
            start_time: string;
            duration: number;
        }) => {
            return await api.post("/bookings", data);
        },

        myBookings: async () => {
            return await api.get<any[]>("/bookings/my");
        },

        checkSeats: async (tempat_id: string, tanggal: string) => {
            return await api.get<{ bookedSeats: number[] }>(
                "/bookings/check-seats",
                { tempat_id, tanggal },
            );
        },
    },

    products: {
        getAll: async (tempat_id?: string) => {
            return await api.get<any[]>("/alat_pancing", { tempat_id });
        },
    },
};
