"use client";
import { useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "@/components/searchBar";
import { Product } from "@/app/types/Product";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to NextShop</h1>
      <div className="flex justify-between items-center mb-8">
        <SearchBar onSearchResults={setSearchResults} />
        <Button asChild>
          <a href="/cart">View Cart</a>
        </Button>
      </div>
      <h2 className="text-2xl font-semibold mb-4">
        {searchResults ? "Search Results" : "Featured Products"}
      </h2>
      <ProductGrid products={searchResults} />
      <ToastContainer />
    </div>
  );
}
