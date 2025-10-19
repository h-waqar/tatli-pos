// src/app/page.js

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import MenuList from "@/components/MenuList";
import OrderDrawer from "@/components/OrderDrawer";
import OrderControls from "@/components/OrderControls";
import CustomizationDialog from "@/components/CustomizationDialog";
import { menuData } from "@/data/menu";
import { Button } from "@/components/ui/button";

const GST_RATE = parseFloat(process.env.NEXT_PUBLIC_GST_RATE || 0);
const SERVICE_CHARGE_RATE = parseFloat(
  process.env.NEXT_PUBLIC_SERVICE_CHARGE_RATE || 0
);
const DELIVERY_CHARGE = parseFloat(
  process.env.NEXT_PUBLIC_DELIVERY_CHARGE || 0
);

function createItemKey(item, addons) {
  let key = `${item.id}-${item.rate}`;
  if (addons && addons.length > 0) {
    const addonString = addons
      .map((a) => `${a.id}:${a.quantity}`)
      .sort()
      .join(";");
    key += `-${addonString}`;
  }
  return key;
}

function calculateOrderTotals(items, orderType, includeGST) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const serviceCharge =
    orderType === "dine_in" ? subtotal * (SERVICE_CHARGE_RATE / 100) : 0;
  const tax =
    includeGST && orderType === "dine_in" ? subtotal * (GST_RATE / 100) : 0;
  const deliveryFee = orderType === "delivery" ? DELIVERY_CHARGE : 0;
  const grandTotal = subtotal + serviceCharge + tax + deliveryFee;
  return { subtotal, serviceCharge, tax, deliveryFee, grandTotal };
}

export default function HomePage() {
  const [orderItems, setOrderItems] = useState([]);
  const [orderType, setOrderType] = useState("take_away");
  const [includeGST, setIncludeGST] = useState(true);

  const [activeCategory, setActiveCategory] = useState(menuData[0].category);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    item: null,
    category: null,
  });

  const handleItemClick = useCallback((item, category) => {
    if (category.addons?.length > 0 || item.rates) {
      setDialogState({ isOpen: true, item, category });
    } else {
      onAddItem(item, []);
    }
  }, []);

  const onAddItem = useCallback((baseItem, selectedAddons = []) => {
    const addonsTotal = selectedAddons.reduce(
      (sum, addon) => sum + addon.rate * addon.quantity,
      0
    );
    const finalRate = baseItem.rate + addonsTotal;
    const groupingKey = createItemKey(baseItem, selectedAddons);

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
          total: finalRate * newQuantity,
        };
        return updatedItems;
      } else {
        const newItem = {
          id: baseItem.id,
          name: baseItem.name,
          // --- THIS IS THE FIX ---
          // If the baseItem is a deal, save its internal items array
          items: baseItem.items,
          // --------------------
          key: nanoid(),
          groupingKey,
          quantity: 1,
          addons: selectedAddons,
          baseRate: baseItem.rate,
          rate: finalRate,
          total: finalRate,
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const onUpdateQuantity = useCallback((key, newQuantity) => {
    setOrderItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.key !== key);
      }
      return prevItems.map((item) =>
        item.key === key
          ? { ...item, quantity: newQuantity, total: item.rate * newQuantity }
          : item
      );
    });
  }, []);

  const onClearOrder = useCallback(() => setOrderItems([]), []);

  const orderTotals = useMemo(
    () => calculateOrderTotals(orderItems, orderType, includeGST),
    [orderItems, orderType, includeGST]
  );

  const activeCategoryData = useMemo(
    () => menuData.find((cat) => cat.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50/50">
      <header className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm">
        <h1 className="text-xl text-center font-extrabold text-primary">
          Tatli Order System 🧾
        </h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-full space-y-6">
            <OrderControls
              orderType={orderType}
              setOrderType={setOrderType}
              includeGST={includeGST}
              setIncludeGST={setIncludeGST}
            />
            <div className="flex flex-wrap gap-2 border-b pb-4">
              {menuData.map((category) => (
                <Button
                  key={category.category}
                  variant={
                    activeCategory === category.category ? "default" : "outline"
                  }
                  onClick={() => setActiveCategory(category.category)}
                  className="h-28 w-48 flex-col items-center justify-center gap-1 p-2 text-center"
                  // className="h-24 w-32 flex-col items-center justify-center gap-1 p-2 text-center"
                >
                  <span className="text-4xl">{category.icon}</span>
                  <span className="text-sm font-semibold leading-tight">
                    {category.category}
                  </span>
                </Button>
              ))}
            </div>
            <MenuList
              activeCategoryData={activeCategoryData}
              onItemClick={handleItemClick}
            />
          </div>
        </main>
      </div>
      <OrderDrawer
        order={{ ...orderTotals, items: orderItems, orderType: orderType }}
        onUpdateQuantity={onUpdateQuantity}
        onClearOrder={onClearOrder}
      />
      <CustomizationDialog
        isOpen={dialogState.isOpen}
        onClose={() =>
          setDialogState({ isOpen: false, item: null, category: null })
        }
        item={dialogState.item}
        category={dialogState.category}
        onConfirm={onAddItem}
      />
    </div>
  );
}
