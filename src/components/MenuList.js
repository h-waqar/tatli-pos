"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import AddItemModal from "./AddItemModal";
import { formatCurrency } from "@/utils/format";
import { Plus } from "lucide-react";

// Helper component to render the item card - REMAINS THE SAME
function MenuItemCard({ item, category, onAddItem }) {
  const isCustomizable =
    item.rates || (category.addons && category.addons.length > 0);

  const price =
    item.rate !== null && item.rate !== undefined
      ? formatCurrency(item.rate)
      : item.rates
      ? `${formatCurrency(item.rates[0])} +`
      : "N/A";

  return (
    <AddItemModal item={item} category={category} onAddItem={onAddItem}>
      <Card className="flex flex-col justify-between p-3 h-full cursor-pointer hover:bg-muted/50 transition-colors">
        <CardTitle className="text-base font-semibold leading-tight pr-8">
          {item.name}
        </CardTitle>
        <div className="mt-2 text-sm text-primary font-bold">
          {price}
          {isCustomizable && (
            <span className="text-xs text-blue-500 ml-1">Customizable</span>
          )}
        </div>
      </Card>
    </AddItemModal>
  );
}

// Helper component for Deals visualization - REMAINS THE SAME
function DealCard({ deal, onAddItem }) {
  const dealItem = {
    id: deal.id,
    name: deal.name,
    baseRate: deal.rate,
    rate: deal.rate,
    addons: [],
  };

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <div>
        <h4 className="font-bold text-lg text-primary">{deal.name}</h4>
        <p className="text-sm text-muted-foreground mt-1 mb-2">Includes:</p>
        <ul className="list-disc list-inside text-sm pl-2 space-y-0.5">
          {deal.items.map((item, index) => (
            <li
              key={index}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between items-center pt-3 border-t mt-3">
        <span className="font-bold text-xl">{formatCurrency(deal.rate)}</span>
        <Button size="sm" onClick={() => onAddItem(dealItem)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </Card>
  );
}

export default function MenuList({ activeCategoryData, onAddItem }) {
  const category = activeCategoryData;

  if (!category) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        Select a category to view items.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold flex items-center gap-3">
        <span className="text-2xl">{category.icon}</span>
        {category.category}
      </h2>

      <div className="p-2">
        {/* Deals Section */}
        {category.deals && category.deals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {" "}
            {/* Adjusted grid for deals */}
            {category.deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} onAddItem={onAddItem} />
            ))}
          </div>
        ) : (
          /* Standard Items Section (Grid Layout) */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.items.map((item, index) => (
              <MenuItemCard
                key={item.id + item.name + index}
                item={item}
                category={category}
                onAddItem={onAddItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
