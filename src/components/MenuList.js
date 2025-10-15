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
import AddItemModal from "./AddItemModal"; // NEW IMPORT
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { menuData } from "@/data/menu";

export default function MenuList({ onAddItem }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Our Menu</h2>
      <Accordion type="single" collapsible className="w-full">
        {menuData.map((category) => (
          <Card key={category.category} className="mb-4">
            <AccordionItem value={category.category}>
              <AccordionTrigger className="text-lg font-semibold px-4 hover:no-underline">
                {category.category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 p-4">
                  {/* Render Main Items */}
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-dashed last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.rate !== null && item.rate !== undefined && (
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.rate)}
                          </p>
                        )}
                        {/* Show indicator for customization options */}
                        {(category.addons || item.rates) && (
                          <p className="text-xs text-blue-500">Customizable</p>
                        )}
                      </div>

                      <div>
                        {/* Use the new AddItemModal for all complex items (with rates or addons) 
                           and simple items (no rates/addons)
                        */}
                        <AddItemModal
                          item={item}
                          category={category}
                          onAddItem={onAddItem}
                        />
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
