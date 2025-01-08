import {create} from "zustand";

const useSearchStore = create((set) => ({
  searchQuery: "",  // Przechowujemy zapytanie wyszukiwania
  setSearchQuery: (query) => set({ searchQuery: query }),  // Funkcja do ustawiania zapytania
}));

export default useSearchStore;
