"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Minus, X } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default function AddItemModal({ item, category, onAddItem, children }) {
  const [open, setOpen] = useState(false);

  // Safely define scoop labels and initial base rate/index
  const scoopLabels = category.scoops || [];
  const initialRate =
    item.rates && item.rates.length > 0 ? item.rates[0] : item.rate;
  const initialRateIndex = item.rates ? item.rates.indexOf(initialRate) : 0;

  // State variables for customization
  const [selectedRate, setSelectedRate] = useState(initialRate);
  const [selectedRateIndex, setSelectedRateIndex] = useState(initialRateIndex);

  // Addon Management State: { addonId: quantity }
  const initialAddonState = category.addons
    ? category.addons.reduce((acc, addon) => ({ ...acc, [addon.id]: 0 }), {})
    : {};
  const [selectedAddons, setSelectedAddons] = useState(initialAddonState);

  // State for visual feedback on successful repeat add
  const [lastAddedKey, setLastAddedKey] = useState(null);

  // --- Utility Functions ---

  // Reset all modal state when it closes
  const resetModalState = () => {
    setSelectedRate(initialRate);
    setSelectedRateIndex(initialRateIndex);
    setSelectedAddons(initialAddonState);
    setLastAddedKey(null);
  };

  // Get the current rate of an addon based on the selected base item size index
  const getCurrentAddonRate = (addon) => {
    if (
      item.rates &&
      addon.rates &&
      selectedRateIndex >= 0 &&
      selectedRateIndex < addon.rates.length
    ) {
      return addon.rates[selectedRateIndex];
    }
    // Fallback to simple fixed 'rate' property (for Burgers, Wraps, etc.)
    return addon.rate || 0;
  };

  // --- MEMOIZED CALCULATIONS ---

  // Calculate total price of all selected addons
  const addonsTotal = useMemo(() => {
    if (!category.addons) return 0;
    return category.addons.reduce((total, addon) => {
      const quantity = selectedAddons[addon.id] || 0;
      const currentRate = getCurrentAddonRate(addon); // Use dynamic rate
      return total + currentRate * quantity;
    }, 0);
  }, [selectedAddons, selectedRateIndex, category.addons]);

  // Calculate the final price of the customized item
  const finalItemRate = selectedRate + addonsTotal;

  // Determine the descriptive label for the item
  const itemLabel =
    item.rates && scoopLabels.length > 0
      ? scoopLabels[selectedRateIndex]
      : item.name;

  // --- HANDLERS ---

  const handleRateSelect = (rate, index) => {
    setSelectedRate(rate);
    setSelectedRateIndex(index); // Update index when scoop/rate changes
    setLastAddedKey(null); // Clear feedback on new selection
  };

  const handleUpdateAddon = (addonId, delta) => {
    setSelectedAddons((prev) => {
      const newQuantity = Math.max(0, (prev[addonId] || 0) + delta);
      return { ...prev, [addonId]: newQuantity };
    });
    setLastAddedKey(null); // Clear feedback on new selection
  };

  const handleFinalAddToOrder = () => {
    const activeAddons = category.addons
      ? category.addons
          .filter((addon) => selectedAddons[addon.id] > 0)
          .map((addon) => {
            const currentRate = getCurrentAddonRate(addon);
            const quantity = selectedAddons[addon.id];

            return {
              id: addon.id,
              name: addon.name,
              rate: currentRate, // Store the price used at the time of order
              quantity: quantity,
              total: currentRate * quantity,
            };
          })
      : [];

    const customItem = {
      name: item.rates ? `${item.name} (${itemLabel})` : item.name,
      id: item.id,
      baseRate: selectedRate,
      rate: finalItemRate,
      addons: activeAddons,
    };

    // 1. Add item to global cart
    onAddItem(customItem);

    // 2. Set feedback key for visual confirmation
    setLastAddedKey(Date.now());

    // 3. Reset addon quantities, but keep base rate selection for repeats (UX fix)
    setSelectedAddons(initialAddonState);
  };

  const handleModalOpenChange = (newOpenState) => {
    if (!newOpenState) {
      resetModalState();
    }
    setOpen(newOpenState);
  };

  // --- RENDERING GUARDS & UX QUICK ADD ---

  // 1. Guard for missing rates
  if (item.rate === null && !item.rates) {
    return (
      <Button size="sm" variant="secondary" disabled>
        Rate Missing
      </Button>
    );
  }

  const isCustomizable =
    item.rates || (category.addons && category.addons.length > 0);

  // 2. UX Improvement: Direct Add for simple, non-customizable items
  if (!isCustomizable && item.rate !== null && item.rate !== undefined) {
    return (
      <div
        onClick={() =>
          onAddItem({
            name: item.name,
            id: item.id,
            baseRate: item.rate,
            rate: item.rate,
            addons: [],
          })
        }
        className="cursor-pointer"
      >
        {children}
      </div>
    );
  }

  // 3. Render Customization Modal for complex items
  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4 pb-2 bg-primary text-primary-foreground rounded-t-lg flex-row justify-between items-center">
          <DialogTitle>Customize {item.name}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleModalOpenChange(false)}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Success Feedback for Quick Repeat Ordering */}
          {lastAddedKey && (
            <Card className="border-green-500 bg-green-50 dark:bg-green-900/50 p-3 text-center transition-all duration-300">
              <p className="font-semibold text-green-700 dark:text-green-300">
                Item added to order! Add another or close.
              </p>
            </Card>
          )}

          {/* Rate/Scoop Selector */}
          {item.rates && (
            <Card>
              <CardHeader>
                <DialogTitle className="text-base">
                  Base Price / Scoop
                </DialogTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {item.rates.map((rate, index) => (
                  <Button
                    key={index}
                    variant={selectedRate === rate ? "default" : "secondary"}
                    onClick={() => handleRateSelect(rate, index)}
                  >
                    {scoopLabels[index] || "Option"} ({formatCurrency(rate)})
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Addon Selection */}
          {category.addons && category.addons.length > 0 && (
            <Card>
              <CardHeader>
                <DialogTitle className="text-base">Add Extras</DialogTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.addons.map((addon) => {
                  const currentAddonRate = getCurrentAddonRate(addon);
                  return (
                    <div
                      key={addon.id}
                      className="flex justify-between items-center"
                    >
                      <p className="font-medium">
                        {addon.name} ({formatCurrency(currentAddonRate)})
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleUpdateAddon(addon.id, -1)}
                          disabled={selectedAddons[addon.id] === 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-5 text-center">
                          {selectedAddons[addon.id]}
                        </span>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleUpdateAddon(addon.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer with Final Total and Add button */}
        <DialogFooter className="sticky bottom-0 bg-background dark:bg-card p-6 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="text-lg font-bold">
              Total: {formatCurrency(finalItemRate)}
            </div>
            <Button onClick={handleFinalAddToOrder}>
              Add to Order (Total: {formatCurrency(finalItemRate)})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
