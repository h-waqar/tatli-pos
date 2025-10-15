"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { menuData } from "@/data/menu";

// Helper component for items with multiple rates (like Ice Cream)
function RateSelector({ item, onAddItem }) {
  // Default to the first rate available
  const [selectedRate, setSelectedRate] = useState(
    item.rates ? item.rates[0] : null
  );
  const [open, setOpen] = useState(false);

  if (!item.rates || item.rates.length === 0) {
    return null;
  }

  const handleRateSelect = (rate) => {
    setSelectedRate(rate);
  };

  const handleAddToOrder = () => {
    onAddItem({
      id: item.id,
      name: `${item.name} (${formatCurrency(selectedRate)})`, // Append rate to name for clarity in the cart
      rate: selectedRate,
    });
    setOpen(false); // Close the dialog after adding
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Select Size/Rate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {item.rates.map((rate, index) => (
            <Button
              key={index}
              variant={selectedRate === rate ? "default" : "secondary"}
              onClick={() => handleRateSelect(rate)}
            >
              {category.garnishOptions
                ? category.garnishOptions[index]
                : `Option ${index + 1}`}{" "}
              - {formatCurrency(rate)}
            </Button>
          ))}
        </div>
        <Button onClick={handleAddToOrder} disabled={selectedRate === null}>
          Add {formatCurrency(selectedRate)} to Order
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function MenuList({ onAddItem }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Our Menu</h2>
      {/* Accordion wraps all categories and makes them collapsible */}
      <Accordion type="single" collapsible className="w-full">
        {menuData.map((category) => (
          <Card key={category.category} className="mb-4">
            <AccordionItem value={category.category}>
              {/* AccordionTrigger displays the category name */}
              <AccordionTrigger className="text-lg font-semibold px-4 hover:no-underline">
                {category.category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 p-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-dashed last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.rate && (
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.rate)}
                          </p>
                        )}
                        {item.garnishOptions && (
                          <p className="text-xs text-blue-500">
                            Options: {item.garnishOptions.join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Action Button: Add to Order */}
                      <div>
                        {/* Case 1: Single Rate Item (most burgers, rolls) */}
                        {item.rate !== null && item.rate !== undefined ? (
                          <Button
                            size="sm"
                            onClick={() =>
                              onAddItem({
                                id: item.id,
                                name: item.name,
                                rate: item.rate,
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        ) : // Case 2: Multi-Rate Item (Ice Cream)
                        item.rates && item.rates.length > 0 ? (
                          <RateSelector
                            item={item}
                            onAddItem={onAddItem}
                            category={category}
                          />
                        ) : (
                          // Case 3: Item with missing rate (e.g., Zesty Zinger Burger)
                          <Button size="sm" variant="secondary" disabled>
                            Rate Missing
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
