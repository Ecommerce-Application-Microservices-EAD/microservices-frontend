"use client"

import { useCart } from '@/lib/CartContext'
import { dummyProducts } from '@/lib/dummyData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } = useCart()

  const cartItems = cart.map(item => ({
    ...item,
    product: dummyProducts.find(p => p.id === item.id)!
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(({ id, quantity, product }) => (
            <Card key={id} className="mb-4">
              <CardContent className="flex items-center p-4">
                <Image src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={() => removeFromCart(id)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-2">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => addToCart(id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold">${getCartTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Button variant="outline" onClick={clearCart}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
              </Button>
              <Button>Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}