"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

const initialProducts = [
  { id: 1, name: 'Smartphone X', price: 799, stock: 50 },
  { id: 2, name: 'Laptop Pro', price: 1299, stock: 30 },
  { id: 3, name: 'Wireless Earbuds', price: 149, stock: 100 },
  { id: 4, name: 'Smart Watch', price: 249, stock: 75 },
  { id: 5, name: 'Digital Camera', price: 699, stock: 25 },
  { id: 6, name: 'Gaming Console', price: 499, stock: 40 },
]

export default function AdminPage() {
  const [products, setProducts] = useState(initialProducts)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })

  const handleAddProduct = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
    }
    setProducts([...products, product])
    setNewProduct({ name: '', price: '', stock: '' })
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <Input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
              />
              <Button type="submit">Add Product</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}