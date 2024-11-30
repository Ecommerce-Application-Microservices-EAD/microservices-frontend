import React, { useState } from "react";
import axios from "axios";

// Dummy products data
const products = [
  {
    id: 1,
    name: "Product 1",
    price: "$10.00",
    image: "https://via.placeholder.com/150",
    description: "This is a great product.",
  },
  {
    id: 2,
    name: "Product 2",
    price: "$20.00",
    image: "https://via.placeholder.com/150",
    description: "This is another great product.",
  },
  {
    id: 3,
    name: "Product 3",
    price: "$30.00",
    image: "https://via.placeholder.com/150",
    description: "This is yet another great product.",
  },
];

// Product component
const Product = ({ product, onAddToCart }) => (
  <div className="border p-4 text-center">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-auto mb-4"
    />
    <h2 className="text-lg font-bold mb-2">{product.name}</h2>
    <p className="text-gray-700 mb-2">{product.description}</p>
    <p className="text-green-500 font-semibold mb-4">{product.price}</p>
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded"
      onClick={() => onAddToCart(product)}
    >
      Add to Cart
    </button>
  </div>
);

// Modal component
const Modal = ({ product, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg text-black font-bold mb-4">Add {product.name} to Cart</h2>
        <div className="mb-4">
          <label className="block mb-2 text-black">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 w-full"
            min="1"
          />
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded mr-2"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ProductsGrid component
const ProductsGrid = ({userId}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const handleAddToCart = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAdd = async (product, quantity) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8085/api/v1/cart/add",
        {
          productId: product.id,
          name: product.name,
          quantity,
          price: parseFloat(product.price.replace("$", "")),
          userId,
        }
      );
      console.log(
        `Added ${quantity} of ${product.name} to cart.`,
        response.data
      );
    } catch (error) {
      console.error("There was a problem with the API call:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default ProductsGrid;
