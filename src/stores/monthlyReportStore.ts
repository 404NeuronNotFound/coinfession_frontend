// ═══════════════════════════════════════════════════════════════
// MONTHLY REPORT STORE
// ═══════════════════════════════════════════════════════════════

import { create } from "zustand";
import type {
  AvailableMonth,
  MonthlyReportDetail,
} from "@/types/monthlyReportTypes";
import {
  fetchMonthlyReportList,
  fetchMonthlyReportDetail,
} from "@/api/monthlyReportApi";

interface MonthlyReportState {
  // State
  availableMonths: AvailableMonth[];
  selectedYear: number | null;
  selectedMonth: number | null;
  detail: MonthlyReportDetail | null;
  loadingList: boolean;
  loadingDetail: boolean;
  error: string | null;
  
  // Actions
  loadReportList: () => Promise<void>;
  loadReportDetail: (year: number, month: number) => Promise<void>;
  selectMonth: (year: number, month: number) => void;
}

export const useMonthlyReportStore = create<MonthlyReportState>((set, get) => ({
  // Initial state
  availableMonths: [],
  selectedYear: null,
  selectedMonth: null,
  detail: null,
  loadingList: false,
  loadingDetail: false,
  error: null,
  
  // Load report list (called on mount)
  loadReportList: async () => {
    set({ loadingList: true, error: null });
    
    try {
      const response = await fetchMonthlyReportList();
      
      set({ availableMonths: response.available_months });
      
      // Auto-select the first month (newest) if available
      if (response.available_months.length > 0) {
        const firstMonth = response.available_months[0];
        await get().loadReportDetail(firstMonth.year, firstMonth.month);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load report list";
      set({ error: errorMessage });
      console.error("Failed to load monthly report list:", error);
    } finally {
      set({ loadingList: false });
    }
  },
  
  // Load report detail for a specific month
  loadReportDetail: async (year: number, month: number) => {
    set({ 
      loadingDetail: true, 
      error: null,
      selectedYear: year,
      selectedMonth: month,
    });
    
    try {
      const response = await fetchMonthlyReportDetail(year, month);
      
      set({ 
        detail: response,
        // Update availableMonths from the detail response to keep in sync
        availableMonths: response.available_months,
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load report detail";
      set({ error: errorMessage });
      console.error("Failed to load monthly report detail:", error);
    } finally {
      set({ loadingDetail: false });
    }
  },
  
  // Select a month (called when user clicks a month tab or history row)
  selectMonth: (year: number, month: number) => {
    const { selectedYear, selectedMonth } = get();
    
    // Don't reload if already selected
    if (year === selectedYear && month === selectedMonth) {
      return;
    }
    
    get().loadReportDetail(year, month);
  },
}));
