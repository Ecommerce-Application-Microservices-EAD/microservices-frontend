import { useState, useEffect } from 'react';
import { fetchCartItems } from '@/services/cartService';

const useCartItems = (userId, onCartItemsChange) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const items = await fetchCartItems(userId);
      setCartItems(items);
      onCartItemsChange(items);
    } catch (error) {
      setCartItems([]);
      onCartItemsChange([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    const intervalId = setInterval(fetchItems, 5000);

    return () => clearInterval(intervalId);
  }, [userId]);

  return { cartItems, loading, fetchItems };
};

export default useCartItems;
