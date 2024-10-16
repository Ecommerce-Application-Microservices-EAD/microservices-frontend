import ProductGrid from '@/components/ProductGrid'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to NextShop</h1>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Featured Products</h2>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
        </Button>
      </div>
      <ProductGrid />
    </div>
  )
}