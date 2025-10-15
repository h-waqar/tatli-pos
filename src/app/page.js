"use client";

import React, { useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import MenuList from "@/components/MenuList";
import OrderDrawer from "@/components/OrderDrawer";

// Utility to create a stable key for grouping identical customized items.
// This is essential for preventing two identical customizations from becoming unique line items.
function createItemKey(item) {
  let key = `${item.id}-${item.rate}`;

  // Sort addons by ID to ensure order doesn't affect the key
  if (item.addons && item.addons.length > 0) {
    const addonString = item.addons
      .map((a) => `${a.id}:${a.quantity}`)
      .sort()
      .join(";");
    key += `-${addonString}`;
  }
  return key;
}

// Calculate totals including a fixed tax rate
const TAX_RATE = 0.05; // 5%

function calculateOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;
  return { subtotal, tax, grandTotal };
}

export default function HomePage() {
  const [orderItems, setOrderItems] = useState([]);

  // Handler for adding a new item or increasing quantity (used for both menu items and addons)
  const onAddItem = useCallback((newItem) => {
    // 1. Generate a unique key that represents the base item + ALL its customizations
    const groupingKey = createItemKey(newItem);

    setOrderItems((prevItems) => {
      // 2. Look for an existing item with the exact same grouping key
      const existingItemIndex = prevItems.findIndex(
        (item) => item.groupingKey === groupingKey
      );

      if (existingItemIndex > -1) {
        // Case 1: Item with this exact customization found, increase quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          // The item rate already includes addon costs, so total = rate * newQuantity
          total: existingItem.rate * newQuantity,
        };
        return updatedItems;
      } else {
        // Case 2: New unique item (new base item or new customization), add it
        const itemWithKeys = {
          ...newItem,
          key: nanoid(), // Unique key for array iteration (always unique)
          groupingKey: groupingKey, // Key for grouping identical custom orders
          quantity: 1,
          total: newItem.rate * 1,
        };
        return [...prevItems, itemWithKeys];
      }
    });
  }, []);

  // Handler for updating quantity or removing items (remains the same)
  const onUpdateQuantity = useCallback((key, newQuantity) => {
    setOrderItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.key !== key);
      }

      const updatedItems = prevItems.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.rate, // Recalculate total based on item's rate (which includes addons)
          };
        }
        return item;
      });

      return updatedItems;
    });
  }, []);

  const onClearOrder = useCallback(() => {
    setOrderItems([]);
  }, []);

  const orderTotals = useMemo(
    () => calculateOrderTotals(orderItems),
    [orderItems]
  );

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
        <div className="max-w-4xl space-y-8">
          <MenuList onAddItem={onAddItem} />
        </div>
      </main>

      <OrderDrawer
        order={orderData}
        onUpdateQuantity={onUpdateQuantity}
        onClearOrder={onClearOrder}
      />
    </div>
  );
}
