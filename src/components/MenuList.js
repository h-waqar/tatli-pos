// src/components/MenuList.js

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { PlusCircle } from "lucide-react";

export default function MenuList({ activeCategoryData, onItemClick }) {
  if (!activeCategoryData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Please select a category to see the menu.
        </CardContent>
      </Card>
    );
  }

  const renderCard = (item) => (
    <Card
      key={item.id}
      className="flex flex-col justify-between p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onItemClick(item, activeCategoryData)}
    >
      <div>
        <p className="font-bold">{item.name}</p>
        {item.items && (
          <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1">
            {item.items.map((dealItem, index) => (
              <li key={index}>{dealItem.name}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-between items-center mt-2">
        {/* --- THIS IS THE FIX --- */}
        {/* Show price ONLY if 'rate' is a number. */}
        {typeof item.rate === "number" && (
          <p className="text-lg font-extrabold text-primary">
            {formatCurrency(item.rate)}
          </p>
        )}
        {/* Show "Customize" if there are multiple price options, regardless of the property name (`rates` or `rate:[]`). */}
        {(item.rates || Array.isArray(item.rate)) && (
          <p className="text-sm text-primary">Customize</p>
        )}
        <PlusCircle className="h-6 w-6 text-gray-400" />
      </div>
    </Card>
  );

  const allItems = [
    ...(activeCategoryData.items || []),
    ...(activeCategoryData.deals || []),
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {allItems.map(renderCard)}
    </div>
  );
}
