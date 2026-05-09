import { create } from "zustand";
import { Problem, Topic, ProgressStatus } from "@/types";

interface ProblemFilters {
  difficulty: string | null;
  topic: string | null;
  search: string;
}

interface ProblemStore {
  filters: ProblemFilters;
  setFilters: (filters: Partial<ProblemFilters>) => void;
  resetFilters: () => void;
  currentProblem: Problem | null;
  setCurrentProblem: (problem: Problem | null) => void;
  userCode: string;
  setUserCode: (code: string) => void;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  filters: {
    difficulty: null,
    topic: null,
    search: "",
  },
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () =>
    set({
      filters: { difficulty: null, topic: null, search: "" },
    }),
  currentProblem: null,
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  userCode: "",
  setUserCode: (code) => set({ userCode: code }),
}));

interface UIStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));