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
import { toast } from "sonner";

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
    // --- THIS IS THE FIX ---
    // The condition is now smarter, checking for addons, a 'rates' array, OR if 'rate' itself is an array.
    if (category.addons?.length > 0 || item.rates || Array.isArray(item.rate)) {
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

    let isNewItem = true;
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.groupingKey === groupingKey
      );

      if (existingItemIndex > -1) {
        isNewItem = false;
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
          items: baseItem.items,
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

    if (isNewItem) {
      toast.success("Item Added", {
        description: `${baseItem.name} has been added to your order.`,
      });
    } else {
      toast.info("Quantity Increased", {
        description: `${baseItem.name} quantity has been updated.`,
      });
    }
  }, []);

  const onUpdateQuantity = useCallback((key, newQuantity) => {
    setOrderItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.key === key) {
            if (newQuantity > item.quantity) {
              toast("Quantity Updated", {
                description: `${item.name} is now x${newQuantity}.`,
              });
            }
            return {
              ...item,
              quantity: newQuantity,
              total: item.rate * newQuantity,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const onClearOrder = useCallback(() => {
    setOrderItems([]);
    toast.error("Order Cleared", {
      description: "All items have been removed from the order.",
    });
  }, []);

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
        <h1 className="text-2xl font-extrabold text-primary">
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
                >
                  <span className="text-3xl">{category.icon}</span>
                  <span className="text-xs font-semibold leading-tight">
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
        key={dialogState.item ? dialogState.item.id : "dialog-closed"}
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
