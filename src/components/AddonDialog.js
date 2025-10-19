// src/components/AddonDialog.js

"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function AddonDialog({
  isOpen,
  onClose,
  item,
  addons,
  onConfirm,
}) {
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Memoize total calculation for performance
  const currentTotal = useMemo(() => {
    const addonsTotal = selectedAddons.reduce(
      (sum, addon) => sum + addon.rate * addon.quantity,
      0
    );
    return (item?.rate || 0) + addonsTotal;
  }, [item, selectedAddons]);

  // Handle addon quantity changes
  const handleAddonQuantity = (addon, change) => {
    setSelectedAddons((prev) => {
      const existingAddon = prev.find((a) => a.id === addon.id);
      if (existingAddon) {
        const newQuantity = existingAddon.quantity + change;
        if (newQuantity <= 0) {
          // Remove addon if quantity is zero or less
          return prev.filter((a) => a.id !== addon.id);
        }
        // Update quantity of existing addon
        return prev.map((a) =>
          a.id === addon.id ? { ...a, quantity: newQuantity } : a
        );
      } else if (change > 0) {
        // Add new addon with quantity 1
        return [...prev, { ...addon, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleConfirmClick = () => {
    onConfirm(item, selectedAddons);
    handleClose();
  };

  const handleClose = () => {
    setSelectedAddons([]); // Reset state on close
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize {item.name}</DialogTitle>
          <DialogDescription>
            Add extra items to your selection. Base price is{" "}
            {formatCurrency(item.rate)}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <h4 className="font-semibold text-md">Available Add-ons</h4>
          {addons.map((addon) => {
            const selected = selectedAddons.find((a) => a.id === addon.id);
            const quantity = selected ? selected.quantity : 0;
            return (
              <div key={addon.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{addon.name}</p>
                  <p className="text-sm text-muted-foreground">
                    + {formatCurrency(addon.rate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleAddonQuantity(addon, -1)}
                    disabled={quantity === 0}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                  <span className="w-6 text-center font-bold">{quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleAddonQuantity(addon, 1)}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold">
              Total: {formatCurrency(currentTotal)}
            </span>
            <Button onClick={handleConfirmClick}>Add to Order</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
