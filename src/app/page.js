"use client";

import React, { useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import MenuList from "@/components/MenuList";
import OrderDrawer from "@/components/OrderDrawer";
import OrderControls from "@/components/OrderControls"; // NEW IMPORT

// ENV variables are strings, convert them to numbers
const GST_RATE = parseFloat(process.env.NEXT_PUBLIC_GST_RATE || 0);
const DELIVERY_CHARGE = parseFloat(
  process.env.NEXT_PUBLIC_DELIVERY_CHARGE || 0
);

// Utility to create a stable key for grouping identical customized items.
function createItemKey(item) {
  let key = `${item.id}-${item.rate}`;

  if (item.addons && item.addons.length > 0) {
    const addonString = item.addons
      .map((a) => `${a.id}:${a.quantity}`)
      .sort((a, b) => a.localeCompare(b)) // Sort for consistent key generation
      .join(";");
    key += `-${addonString}`;
  }
  return key;
}

function calculateOrderTotals(items, orderType, includeGST) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  // GST Logic: Only applies if includeGST is true AND orderType is 'dine_in'
  const tax = includeGST && orderType === "dine_in" ? subtotal * GST_RATE : 0;

  // Delivery Logic: Only applies if orderType is 'delivery'
  const deliveryFee = orderType === "delivery" ? DELIVERY_CHARGE : 0;

  const grandTotal = subtotal + tax + deliveryFee;

  return { subtotal, tax, deliveryFee, grandTotal };
}

export default function HomePage() {
  const [orderItems, setOrderItems] = useState([]);
  const [orderType, setOrderType] = useState("take_away"); // Default to Take Away
  const [includeGST, setIncludeGST] = useState(false);

  const onAddItem = useCallback((newItem) => {
    const groupingKey = createItemKey(newItem);

    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.groupingKey === groupingKey
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: existingItem.rate * newQuantity,
        };
        return updatedItems;
      } else {
        const itemWithKeys = {
          ...newItem,
          key: nanoid(),
          groupingKey: groupingKey,
          quantity: 1,
          total: newItem.rate * 1,
        };
        return [...prevItems, itemWithKeys];
      }
    });
  }, []);

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
            total: newQuantity * item.rate,
          };
        }
        return item;
      });

      return updatedItems;
    });
  }, []);

  const onClearOrder = useCallback(() => {
    setOrderItems([]);
    setOrderType("take_away");
    setIncludeGST(false);
  }, []);

  const orderTotals = useMemo(
    () => calculateOrderTotals(orderItems, orderType, includeGST),
    [orderItems, orderType, includeGST]
  );

  const orderData = {
    items: orderItems,
    orderType,
    includeGST,
    ...orderTotals,
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-primary">
          Tatli Order System
        </h1>
        <div className="max-w-4xl space-y-8">
          {/* Controls Panel */}
          <OrderControls
            orderType={orderType}
            setOrderType={setOrderType}
            includeGST={includeGST}
            setIncludeGST={setIncludeGST}
          />

          {/* Menu */}
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
