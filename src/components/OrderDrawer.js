"use client";

import React, { useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { ShoppingCart, Minus, Plus } from "lucide-react";

export default function OrderDrawer({ order, onUpdateQuantity, onClearOrder }) {
  const { items } = order;
  const taxRate = 0.05; // 5% placeholder tax

  const totalCalculations = useMemo(() => {
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = calculatedSubtotal * taxRate;
    const grandTotal = calculatedSubtotal + tax;

    return {
      subtotal: calculatedSubtotal,
      tax: tax,
      grandTotal: grandTotal,
    };
  }, [items]);

  const handlePrint = () => {
    sessionStorage.setItem(
      "currentOrder",
      JSON.stringify({
        ...totalCalculations,
        items: items,
        date: new Date().toISOString(),
        taxRate: taxRate,
      })
    );
    window.open("/print", "_blank");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50">
          <ShoppingCart className="h-6 w-6" />
          {items.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {items.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-lg p-4">
          <DrawerHeader>
            <DrawerTitle>Current Order</DrawerTitle>
            <DrawerDescription>
              Review and manage items before printing the slip.
            </DrawerDescription>
          </DrawerHeader>

          <Card className="max-h-96 overflow-y-auto mb-4">
            <CardContent className="p-0">
              {items.length === 0 ? (
                <p className="p-4 text-center text-muted-foreground">
                  Your order is empty.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Item</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <React.Fragment key={item.key}>
                        <TableRow className="bg-secondary/10 hover:bg-secondary/20">
                          <TableCell className="font-medium max-w-[150px] truncate">
                            {item.name}
                          </TableCell>
                          {/* Display BASE RATE for clear accounting */}
                          <TableCell className="text-sm">
                            {formatCurrency(item.baseRate || item.rate)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() =>
                                  onUpdateQuantity(item.key, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-5 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() =>
                                  onUpdateQuantity(item.key, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          {/* Display FULL RATE (base + addons) total */}
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>

                        {/* Nested Addon Rows */}
                        {item.addons &&
                          item.addons.map((addon) => (
                            <TableRow
                              key={`${item.key}-${addon.id}`}
                              className="text-muted-foreground bg-secondary/5 border-none"
                            >
                              <TableCell className="py-0.5 pl-4 text-xs italic border-none">
                                + {addon.quantity}x {addon.name}
                              </TableCell>
                              <TableCell className="py-0.5 text-xs border-none">
                                {formatCurrency(addon.rate)}
                              </TableCell>
                              <TableCell className="py-0.5 text-center text-sm border-none"></TableCell>
                              <TableCell className="py-0.5 text-right text-xs border-none">
                                {formatCurrency(addon.total * item.quantity)}{" "}
                                {/* Addon total * Base item Qty */}
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <div className="p-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">
                {formatCurrency(totalCalculations.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax (5%):</span>
              <span className="font-medium">
                {formatCurrency(totalCalculations.tax)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Grand Total:</span>
              <span>{formatCurrency(totalCalculations.grandTotal)}</span>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={onClearOrder}
                variant="outline"
                disabled={items.length === 0}
                className="w-full"
              >
                Clear Order
              </Button>
              <Button
                onClick={handlePrint}
                disabled={items.length === 0}
                className="w-full"
              >
                Print Slip
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
