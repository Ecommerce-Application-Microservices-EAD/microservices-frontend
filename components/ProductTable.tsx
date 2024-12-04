import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/app/types/Product";

interface ProductTableProps {
  products: Product[];
  onUpdate: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable = ({ products, onUpdate, onDelete }: ProductTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 mt-6">
      <table className="min-w-full table-auto text-sm text-gray-700 dark:text-gray-300">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <th className="px-6 py-3 text-left font-semibold">Image</th>
            <th className="px-6 py-3 text-left font-semibold">Name</th>
            <th className="px-6 py-3 text-left font-semibold">Description</th>
            <th className="px-6 py-3 text-left font-semibold">Price</th>
            <th className="px-6 py-3 text-left font-semibold">Stock</th>
            <th className="px-6 py-3 text-left font-semibold">Category</th>
            <th className="px-6 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">
                  {product.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${product.imageData}`}
                      alt={product.name}
                      className="w-15 h-15 object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">${product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4 capitalize">{product.category}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdate(product)}
                    className="text-gray-900 dark:text-gray-100 border-gray-300 hover:border-gray-500"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product)}
                    className="text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-600 dark:text-gray-300">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
