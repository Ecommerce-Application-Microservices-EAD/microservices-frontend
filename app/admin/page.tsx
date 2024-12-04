"use client";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/ProductTable";
import { AddProductForm } from "@/components/Forms/addProductForm";
import { UpdateProductForm } from "@/components/Forms/updateProductForm";
import { Modal } from "@/components/modal";
import SearchBar from "@/components/searchBar";
import { toast } from "@/components/Toast";
import { Product } from "../types/Product";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    searchResults,
    handleSearchResults,
  } = useProducts();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const displayedProducts = searchResults || products;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Admin Dashboard
      </h1>

      <Button
        onClick={() => setShowAddForm(true)}
        className="mb-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Add New Product
      </Button>

      <SearchBar onSearchResults={handleSearchResults} />

      <ProductTable
        products={displayedProducts}
        onUpdate={(product: Product) => {
          setProductToUpdate(product);
          setShowUpdateForm(true);
        }}
        onDelete={(product: Product) => {
          setProductToDelete(product);
          setShowDeleteModal(true);
        }}
      />

      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
        >
          <AddProductForm
            onSubmit={async (formData: Product) => {
              await addProduct(formData);
              setShowAddForm(false);
              toast("Product added successfully!", "success");
            }}
            onClose={() => setShowAddForm(false)}
          />
        </Modal>
      )}

      {showUpdateForm && productToUpdate && (
        <Modal
          isOpen={showUpdateForm}
          onClose={() => {
            setProductToUpdate(null);
            setShowUpdateForm(false);
          }}
        >
          <UpdateProductForm
            product={productToUpdate}
            onSubmit={async (updatedProduct: Product) => {
              await updateProduct(updatedProduct);
              setShowUpdateForm(false);
              toast("Product updated successfully!", "success");
            }}
            onClose={() => {
              setProductToUpdate(null);
              setShowUpdateForm(false);
            }} 
          />
        </Modal>
      )}

      {showDeleteModal && productToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete "{productToDelete.name}"?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteProduct(productToDelete.id);
                  setShowDeleteModal(false);
                  toast("Product deleted successfully!", "success");
                }}
              >
                Confirm
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
    </ProtectedRoute>
  );
}
