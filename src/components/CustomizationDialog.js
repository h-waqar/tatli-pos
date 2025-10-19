// src/components/CustomizationDialog.js

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function CustomizationDialog({
  isOpen,
  onClose,
  item,
  category,
  onConfirm,
}) {
  // Since the `key` prop forces a reset, we can initialize state directly.
  const [selectedBaseIndex, setSelectedBaseIndex] = useState(() => {
    // If it's a single-rate item, it's pre-selected. Otherwise, null.
    return item && item.rate && !item.rates ? -1 : null;
  });
  const [selectedAddons, setSelectedAddons] = useState([]);

  // This effect correctly re-prices addons when the scoop size changes.
  useEffect(() => {
    if (!item || selectedBaseIndex === null || selectedAddons.length === 0) {
      return;
    }

    const rePricedAddons = selectedAddons.map((addonInCart) => {
      const originalAddonDef = category.addons.find(
        (a) => a.id === addonInCart.id
      );
      if (
        originalAddonDef &&
        originalAddonDef.rates &&
        selectedBaseIndex !== -1
      ) {
        const newRate = originalAddonDef.rates[selectedBaseIndex];
        return { ...addonInCart, rate: newRate };
      }
      return addonInCart;
    });

    setSelectedAddons(rePricedAddons);
  }, [selectedBaseIndex, category, item, selectedAddons.length]); // Refined dependencies

  const selectedRate = useMemo(() => {
    if (!item) return null;
    if (selectedBaseIndex === -1) return item.rate;
    if (selectedBaseIndex !== null && item.rates) {
      return item.rates[selectedBaseIndex];
    }
    return null;
  }, [selectedBaseIndex, item]);

  const currentTotal = useMemo(() => {
    const basePrice = selectedRate || 0;
    const addonsTotal = selectedAddons.reduce(
      (sum, addon) => sum + addon.rate * addon.quantity,
      0
    );
    return basePrice + addonsTotal;
  }, [selectedRate, selectedAddons]);

  const handleAddonQuantity = (addon, change) => {
    const originalAddonDef = category.addons.find((a) => a.id === addon.id);
    if (!originalAddonDef) return;

    let resolvedAddonPrice;
    if (originalAddonDef.rates) {
      if (selectedBaseIndex !== null && selectedBaseIndex !== -1) {
        resolvedAddonPrice = originalAddonDef.rates[selectedBaseIndex];
      } else {
        return;
      }
    } else {
      resolvedAddonPrice = originalAddonDef.rate;
    }

    setSelectedAddons((prev) => {
      const existing = prev.find((a) => a.id === addon.id);
      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter((a) => a.id !== addon.id);
        }
        return prev.map((a) =>
          a.id === addon.id ? { ...a, quantity: newQuantity } : a
        );
      } else if (change > 0) {
        return [
          ...prev,
          {
            id: addon.id,
            name: addon.name,
            rate: resolvedAddonPrice,
            quantity: 1,
          },
        ];
      }
      return prev;
    });
  };

  const handleConfirmClick = () => {
    if (!item) return;
    const finalItem = {
      ...item,
      name: item.rates
        ? `${item.name} (${category.scoops[selectedBaseIndex]})`
        : item.name,
      rate: selectedRate,
    };
    onConfirm(finalItem, selectedAddons);
    onClose();
  };

  if (!item || !category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize {item.name}</DialogTitle>
          <DialogDescription>
            Select your options and add extras.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {item.rates && (
            <div>
              <Label className="font-semibold text-md">Select Size</Label>
              <RadioGroup
                value={selectedBaseIndex?.toString()}
                onValueChange={(val) => setSelectedBaseIndex(parseInt(val, 10))}
                className="mt-2 space-y-1"
              >
                {item.rates.map((rate, index) => (
                  <Label
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md has-[:checked]:border-primary cursor-pointer"
                  >
                    <span>
                      {category.scoops?.[index] || `${index + 1} Scoop`}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{formatCurrency(rate)}</span>
                      <RadioGroupItem value={index.toString()} />
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {category.addons?.length > 0 && (
            <div>
              <h4 className="font-semibold text-md">Available Add-ons</h4>
              <div className="mt-2 space-y-2">
                {category.addons.map((addon) => {
                  const selected = selectedAddons.find(
                    (a) => a.id === addon.id
                  );
                  const quantity = selected ? selected.quantity : 0;

                  const originalAddonDef = category.addons.find(
                    (a) => a.id === addon.id
                  );
                  const displayPrice = originalAddonDef.rates
                    ? selectedBaseIndex !== null && selectedBaseIndex !== -1
                      ? originalAddonDef.rates[selectedBaseIndex]
                      : "Select size"
                    : originalAddonDef.rate;

                  return (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {typeof displayPrice === "number" ? (
                            `+ ${formatCurrency(displayPrice)}`
                          ) : (
                            <span className="text-xs italic">
                              {displayPrice}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleAddonQuantity(addon, -1)}
                          disabled={!quantity}
                        >
                          <MinusCircle className="h-5 w-5" />
                        </Button>
                        <span className="w-6 text-center font-bold">
                          {quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleAddonQuantity(addon, 1)}
                          disabled={selectedRate === null}
                        >
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold">
              Total: {formatCurrency(currentTotal)}
            </span>
            <Button
              onClick={handleConfirmClick}
              disabled={selectedRate === null}
            >
              Add to Order
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
