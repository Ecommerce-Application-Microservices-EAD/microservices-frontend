import { useCart } from '@/lib/CartContext'
import { dummyProducts } from '@/lib/dummyData'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'

export function generateStaticParams() {
  return dummyProducts.map((product) => ({
    id: product.id.toString(),
  }))
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart()
  const product = dummyProducts.find(p => p.id === parseInt(params.id))

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">${product.price}</p>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <Button className="w-full md:w-auto" onClick={() => addToCart(product.id)}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}