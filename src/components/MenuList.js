"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddItemModal from "./AddItemModal";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { menuData } from "@/data/menu";

// Helper component for Deals visualization
function DealCard({ deal, onAddItem }) {
  // Treat deals as simple, single-rate items for ordering
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

export default function MenuList({ onAddItem }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Our Menu</h2>
      <Accordion type="multiple" defaultValue={["Burgers"]} className="w-full">
        {" "}
        {/* Open Burgers by default */}
        {menuData.map((category) => (
          <Card key={category.category} className="mb-4">
            <AccordionItem value={category.category}>
              <AccordionTrigger className="text-lg font-semibold px-4 hover:no-underline">
                {category.category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  {/* Deals Section */}
                  {category.deals && category.deals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.deals.map((deal) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          onAddItem={onAddItem}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Standard Items Section */
                    <div className="grid gap-2">
                      {category.items.map((item) => (
                        <div
                          key={item.id + item.name} // Use name + id for safety since IDs may repeat (e.g. BBQ Items)
                          className="flex justify-between items-center py-2 border-b border-dashed last:border-b-0"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.rate !== null && item.rate !== undefined && (
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.rate)}
                              </p>
                            )}
                            {(category.addons || item.rates) && (
                              <p className="text-xs text-blue-500">
                                Customizable
                              </p>
                            )}
                          </div>

                          <div>
                            {/* Use AddItemModal for all items; it handles Quick Add logic internally */}
                            <AddItemModal
                              item={item}
                              category={category}
                              onAddItem={onAddItem}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
