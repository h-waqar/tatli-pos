"use client";

import React, { useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid"; // Used for unique keys for order items
import MenuList from "@/components/MenuList";
import OrderDrawer from "@/components/OrderDrawer";

// Calculate totals including a fixed tax rate
const TAX_RATE = 0.05; // 5%

function calculateOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;
  return { subtotal, tax, grandTotal };
}

export default function HomePage() {
  // orderItems state structure:
  // [{ key: 'unique-id', id: 1, name: 'Zinger Burger', rate: 350, quantity: 2, total: 700 }]
  const [orderItems, setOrderItems] = useState([]);

  // Memoized function for calculating totals
  const orderTotals = useMemo(
    () => calculateOrderTotals(orderItems),
    [orderItems]
  );

  // Handler for adding a new item or increasing quantity
  const onAddItem = useCallback((newItem) => {
    setOrderItems((prevItems) => {
      // Look for an existing item with the same ID and rate.
      // This is crucial for grouping identical items in the cart.
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.rate === newItem.rate
      );

      if (existingItemIndex > -1) {
        // Case 1: Item found, increase quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: newQuantity * existingItem.rate,
        };
        return updatedItems;
      } else {
        // Case 2: New item, add it with quantity 1
        const itemWithTotal = {
          ...newItem,
          key: nanoid(), // Unique key for list rendering and manipulation
          quantity: 1,
          total: newItem.rate * 1,
        };
        return [...prevItems, itemWithTotal];
      }
    });
  }, []);

  // Handler for updating quantity or removing items
  const onUpdateQuantity = useCallback((key, newQuantity) => {
    setOrderItems((prevItems) => {
      if (newQuantity <= 0) {
        // Remove item if the user sets quantity to 0 or less
        return prevItems.filter((item) => item.key !== key);
      }

      const updatedItems = prevItems.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.rate,
          };
        }
        return item;
      });

      return updatedItems;
    });
  }, []);

  // Handler for clearing the entire order
  const onClearOrder = useCallback(() => {
    setOrderItems([]);
  }, []);

  const orderData = {
    items: orderItems,
    ...orderTotals,
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-primary">
          Tatli Order System (MVP)
        </h1>
        <div className="max-w-4xl">
          <MenuList onAddItem={onAddItem} />
        </div>
      </main>

      {/* Order Drawer (Cart) component, fixed at bottom right */}
      <OrderDrawer
        order={orderData}
        onUpdateQuantity={onUpdateQuantity}
        onClearOrder={onClearOrder}
      />
    </div>
  );
}
