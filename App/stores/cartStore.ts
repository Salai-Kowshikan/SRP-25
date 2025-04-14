import { create } from 'zustand';

interface CartStore {
  cart: string[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (productId) =>
    set((state) => ({ cart: [...state.cart, productId] })),
  removeFromCart: (productId) =>
    set((state) => ({ cart: state.cart.filter((id) => id !== productId) })),
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;

