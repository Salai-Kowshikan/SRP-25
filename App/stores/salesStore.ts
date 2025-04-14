import { create } from 'zustand';
import api from "@/api/api";

interface TransactionDetails {
  amount: number;
  id: string;
  other_account: {
    customer_name: string;
    payment_mode: string;
    reference_id: string;
  };
  t_timestamp: string;
  type: string;
}

interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  total: number;
  transaction_details: TransactionDetails;
  transaction_id: string;
}

interface MonthlySales {
  month: string;
  year: string;
  quantity_sold: number;
  price_sold: number;
}

interface SalesState {
  sales: Sale[];
  monthlySales: MonthlySales[];
  fetchSales: (productId: string, year: string) => Promise<void>;
  resetSales: () => void;
  updateSales: (sales: Sale[]) => void;
  updateMonthlySales: (monthlySales: MonthlySales[]) => void;
}

export const useSalesStore = create<SalesState>((set) => ({
  sales: [],
  monthlySales: [],
  fetchSales: async (productId, year) => {
    try {
      const response = await api.get(`/salesAnalytics?product_id=${productId}&year=${year}`);
      const { data } = response.data;
      
      set(() => ({
        sales: data.sales,
        monthlySales: data.monthly_sales,
      }));
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
    }
  },

  resetSales: () => set(() => ({
    sales: [],
    monthlySales: [],
  })),

  updateSales: (sales) => set(() => ({ sales })),

  updateMonthlySales: (monthlySales) => set(() => ({ monthlySales })),
}));
