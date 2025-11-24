import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";

interface UseSearchOptions {
  onSearch: (term: string) => void;
  debounceMs?: number;
  minLength?: number;
}

export const useSearch = ({
  onSearch,
  debounceMs = 300,
  minLength = 0,
}: UseSearchOptions) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  useEffect(() => {
    if (debouncedSearchTerm.length >= minLength) {
      onSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      onSearch("");
    }
  }, [debouncedSearchTerm, onSearch, minLength]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    clearSearch,
    debouncedSearchTerm,
  };
};
