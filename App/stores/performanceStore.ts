import { create } from "zustand";
import api from "@/api/api";

interface PerformanceState {
  selectedMonth: string;
  selectedYear: string;
  revenue: number;
  capital: number;
  expenditures: number;
  profit: number;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  fetchPerformanceData: () => Promise<void>;
}

const currentYear = new Date().getFullYear();

export const usePerformanceStore = create<PerformanceState>((set, get) => ({
  selectedMonth: "",
  selectedYear: currentYear.toString(),
  revenue: 0,
  capital: 0,
  expenditures: 0,
  profit: 0,

  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),

  fetchPerformanceData: async () => {
    const { selectedMonth, selectedYear } = get();
    if (!selectedMonth || !selectedYear) return;

    try {
      const res = await api.get("/analysis", {
        params: {
          month: parseInt(selectedMonth),
          year: parseInt(selectedYear),
        },
      });

      const data = res.data.summary;
      set({
        revenue: data.total_revenue,
        capital: data.total_funds_received,
        expenditures: data.total_expenditure,
        profit: data.net_profit,
      });
    } catch (err) {
      console.error("Failed to fetch performance data:", err);
    }
  },
}));
