"use client";

import React, { useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import MenuList from "@/components/MenuList";
import OrderDrawer from "@/components/OrderDrawer";
import OrderControls from "@/components/OrderControls";
import { menuData } from "@/data/menu";
import { Button } from "@/components/ui/button";

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
      .sort((a, b) => a.localeCompare(b))
      .join(";");
    key += `-${addonString}`;
  }
  return key;
}

function calculateOrderTotals(items, orderType, includeGST) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const tax = includeGST && orderType === "dine_in" ? subtotal * GST_RATE : 0;
  const deliveryFee = orderType === "delivery" ? DELIVERY_CHARGE : 0;

  const grandTotal = subtotal + tax + deliveryFee;

  return { subtotal, tax, deliveryFee, grandTotal };
}

export default function HomePage() {
  const [orderItems, setOrderItems] = useState([]);
  const [orderType, setOrderType] = useState("take_away");
  const [includeGST, setIncludeGST] = useState(false);

  const [activeCategory, setActiveCategory] = useState(menuData[0].category);

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

  const activeCategoryData = useMemo(() => {
    return (
      menuData.find((cat) => cat.category === activeCategory) || menuData[0]
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen h-screen flex flex-col">
      {" "}
      {/* Use h-screen and flex-col */}
      <header className="p-4 border-b">
        <h1 className="text-2xl font-extrabold text-primary">
          Tatli POS System
        </h1>
      </header>
      <div className="flex flex-1 h-auto">
        {/* Left Pane (Controls & Menu) - Scrolls vertically */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-full lg:max-w-6xl mx-auto ">
          {" "}
          {/* Responsive width and scrolling */}
          <div className="space-y-6">
            {/* Category Navigation */}
            <div className="flex flex-wrap gap-2 p-1 border-b pb-4">
              {menuData.map((category) => (
                <Button
                  key={category.category}
                  variant={
                    activeCategory === category.category ? "default" : "outline"
                  }
                  onClick={() => setActiveCategory(category.category)}
                  className="h-24 w-36 flex-col justify-center items-center p-2 text-center"
                  // className="h-14 w-28 flex-col justify-center items-center p-2 text-center"
                >
                  <span className="text-3xl">{category.icon}</span>
                  <span className="text-xs font-semibold leading-tight">
                    {category.category}
                  </span>
                </Button>
              ))}
            </div>

            {/* MenuList */}
            <MenuList
              activeCategoryData={activeCategoryData}
              onAddItem={onAddItem}
            />

            {/* Controls Panel */}
            <OrderControls
              orderType={orderType}
              setOrderType={setOrderType}
              includeGST={includeGST}
              setIncludeGST={setIncludeGST}
            />
          </div>
        </main>
      </div>
      {/* Order Drawer (Cart) component, fixed at bottom right */}
      <OrderDrawer
        order={orderData}
        onUpdateQuantity={onUpdateQuantity}
        onClearOrder={onClearOrder}
      />
    </div>
  );
}
