import { Product } from "@/app/types/Product";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UpdateProductFormProps {
  product: Product;
  onSubmit: (updatedProduct: Product) => Promise<void>;
  onClose: () => void;
}

export function UpdateProductForm({ product, onSubmit, onClose }: UpdateProductFormProps) {
  const [formData, setFormData] = useState(product);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="file" name="image" accept="image/*" onChange={handleChange} />
      <Input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md h-24 resize-y"
      />
      <Input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <Input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
      <Input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <div className="flex justify-end space-x-2">
        <Button type="submit">Update Product</Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
