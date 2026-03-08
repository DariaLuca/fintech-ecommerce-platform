import { create } from 'zustand';

// Calculate the total cart value
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
};

export const useCart = create((set, get) => ({
    cartItems: [],
    cartTotal: 0,
    activeTab: 'home',
    setActiveTab: (tab) => set({ activeTab: tab }),

    addToCart: (product) => {
        set((state) => {
            const updatedItems = [...state.cartItems, product];
            return {
                cartItems: updatedItems,
                cartTotal: calculateTotal(updatedItems),
            };
        });
    },

    removeFromCart: (productId) => {
        set((state) => {
            const index = state.cartItems.findIndex(item => item.id === productId);
            if (index === -1) return state;

            const newItems = [...state.cartItems];
            newItems.splice(index, 1);

            return {
                cartItems: newItems,
                cartTotal: calculateTotal(newItems),
            };
        });
    },

    clearCart: () => set({ cartItems: [], cartTotal: 0 }),
}));
