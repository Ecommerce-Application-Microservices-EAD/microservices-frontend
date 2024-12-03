import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { searchProducts } from "../services/productService";
import { Product } from "@/app/types/Product";

interface SearchBarProps {
  onSearchResults: (results: Product[] | null) => void;
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const results = await searchProducts(searchTerm);
      onSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Failed to fetch search results. Please try again.");
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      onSearchResults(null);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="search"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-64 border rounded-md px-3 py-2"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
