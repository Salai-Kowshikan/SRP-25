import { create } from 'zustand';
import api from "@/api/api";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  on_sale: boolean;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  resetProducts: () => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>()((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  resetProducts: () => set(() => ({ products: [] })),
  fetchProducts: async () => {
    try {
      const response = await api.get("/api/products/shg_001");
      if (response.data.success) {
        set(() => ({ products: response.data.products }));
      } else {
        console.error("Error fetching products:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },
}));
