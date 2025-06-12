// Usamos un store de Zustand para manejar el estado del carrito de compras

import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalItems: () => number;

  getSummaryInformation: () => {
    itemsInCart: number;
    subTotal: number;
    tax: number;
    total: number;
  };

  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;

  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // Methods
      getTotalItems: () => {
        const { cart } = get();
        // 1. Sumar la cantidad de todos los productos en el carrito
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      getSummaryInformation: () => {
        // destructuramos el carrito
        const { cart } = get();

        // 1. Calcular el total de items y el subtotal
        const subTotal = cart.reduce(
          (subTotal, product) => subTotal + product.price * product.quantity,
          0
        );
        const itemsInCart = cart.reduce(
          (totalItems, item) => totalItems + item.quantity,
          0
        );
        // 2. Calcular los impuestos (15% del subtotal)
        const tax = subTotal * 0.15;
        // 3. Calcular el total
        const total = subTotal + tax;

        return {
          itemsInCart,
          subTotal,
          tax,
          total,
        };
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();
        // 1. Revisar si el producto ya existe en el carrito con la talla seleccionada
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );
        if (!productInCart) {
          // Si no existe, agregar el producto al carrito lo insertamos
          set({ cart: [...cart, product] });
        } else {
          // 2. Si ya existe, actualizar la cantidad del producto
          const updatedCartProduct = cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
              return {
                ...item,
                quantity: item.quantity + product.quantity,
              };
            }
            return item;
          });
          set({ cart: updatedCartProduct });
        }
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        // 1. Actualizar la cantidad del producto en el carrito
        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }
          return item;
        });
        set({ cart: updatedCart });
      },

      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        // 1. Filtrar el producto a eliminar del carrito
        const updatedCart = cart.filter(
          (item) => !(item.id === product.id && item.size === product.size)
        );
        set({ cart: updatedCart });
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
