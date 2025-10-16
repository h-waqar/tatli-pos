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
import { Plus, Minus, X } from "lucide-react"; // Added X icon
import { formatCurrency } from "@/utils/format";

export default function AddItemModal({ item, category, onAddItem }) {
  const [open, setOpen] = useState(false);

  const scoopLabels = category.scoops || [];

  // State variables for customization
  const [selectedRate, setSelectedRate] = useState(
    item.rates && item.rates.length > 0 ? item.rates[0] : item.rate
  );
  const [selectedRateIndex, setSelectedRateIndex] = useState(
    item.rates ? item.rates.indexOf(selectedRate) : 0
  );
  const initialAddonState = category.addons
    ? category.addons.reduce((acc, addon) => ({ ...acc, [addon.id]: 0 }), {})
    : {};
  const [selectedAddons, setSelectedAddons] = useState(initialAddonState);

  // Added state to track last successful add for visual feedback
  const [lastAddedKey, setLastAddedKey] = useState(null);

  // Reset all modal state when it closes
  const resetModalState = () => {
    setSelectedRate(
      item.rates && item.rates.length > 0 ? item.rates[0] : item.rate
    );
    setSelectedRateIndex(item.rates ? item.rates.indexOf(selectedRate) : 0);
    setSelectedAddons(initialAddonState);
    setLastAddedKey(null);
  };

  // --- MEMOIZED CALCULATIONS ---

  const getCurrentAddonRate = (addon) => {
    if (
      item.rates &&
      addon.rates &&
      selectedRateIndex >= 0 &&
      selectedRateIndex < addon.rates.length
    ) {
      return addon.rates[selectedRateIndex];
    }
    return addon.rate || 0;
  };

  const addonsTotal = useMemo(() => {
    if (!category.addons) return 0;
    return category.addons.reduce((total, addon) => {
      const quantity = selectedAddons[addon.id] || 0;
      const currentRate = getCurrentAddonRate(addon);
      return total + currentRate * quantity;
    }, 0);
  }, [selectedAddons, selectedRateIndex, category.addons]);

  const finalItemRate = selectedRate + addonsTotal;

  const itemLabel =
    item.rates && scoopLabels.length > 0
      ? scoopLabels[selectedRateIndex]
      : item.name;

  // --- HANDLERS ---

  const handleRateSelect = (rate, index) => {
    setSelectedRate(rate);
    setSelectedRateIndex(index);
  };

  const handleUpdateAddon = (addonId, delta) => {
    setSelectedAddons((prev) => {
      const newQuantity = Math.max(0, (prev[addonId] || 0) + delta);
      return { ...prev, [addonId]: newQuantity };
    });
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
              rate: currentRate,
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

    // The core logic is to call onAddItem and then reset the addon *quantities* // but keep the modal open and the scoop/rate *selection* active.
    onAddItem(customItem);
    setLastAddedKey(Date.now()); // Update key for visual feedback
    setSelectedAddons(initialAddonState); // Reset addon quantities for the next item
  };

  const handleModalOpenChange = (newOpenState) => {
    if (!newOpenState) {
      resetModalState();
    }
    setOpen(newOpenState);
  };

  // Guard clause for items with no rates
  if (item.rate === null && !item.rates) {
    return (
      <Button size="sm" variant="secondary" disabled>
        Rate Missing
      </Button>
    );
  }

  // Determine if customization is needed
  const isCustomizable =
    item.rates || (category.addons && category.addons.length > 0);

  // Direct Add Button for simple, non-customizable items (UX IMPROVEMENT: Quick Add)
  if (!isCustomizable && item.rate !== null && item.rate !== undefined) {
    return (
      <Button
        size="sm"
        onClick={() =>
          onAddItem({
            name: item.name,
            id: item.id,
            baseRate: item.rate,
            rate: item.rate,
            addons: [],
          })
        }
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          {isCustomizable ? "Customize" : <Plus className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
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
                Added to Order. Adjust quantity or close.
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
              Add to Order (Current Qty: 1)
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
