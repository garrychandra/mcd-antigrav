import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const mergeTotal = (state: CartState) => {
  state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'id'>>) => {
      const existing = state.items.find(item => item.product_id === action.payload.product_id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        const newId = Date.now();
        state.items.push({ ...action.payload, id: newId });
      }
      mergeTotal(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity = action.payload.quantity;
      }
      mergeTotal(state);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      mergeTotal(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  },
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
