"use client";
import {createContext, useContext, useState,ReactNode} from "react";

interface SearchContextType {
  search: string;
  setSearch: (search: string) => void;
  category: string;
  setCategory: (category: string) => void;
}
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({children}: {children: ReactNode}) {
    const [search, setSearch] = useState<string>("");
    const [category, setCategory] = useState<string>("All");
    return (
        <SearchContext.Provider value={{search, setSearch, category, setCategory}}>
            {children}
        </SearchContext.Provider>
    );
}
export function useSearchContext(){
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearchContext must be used within a SearchProvider");
    }
    return context;
}