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
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

export default function OrderDrawer({ order, onUpdateQuantity, onClearOrder }) {
  const { items } = order;
  const taxRate = 0.05; // 5% placeholder tax

  // Calculate totals whenever items change
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
    // 1. Save all necessary order data to sessionStorage before navigating
    // This allows the /print route to retrieve the order instantly (Offline MVP requirement)
    sessionStorage.setItem(
      "currentOrder",
      JSON.stringify({
        ...totalCalculations,
        items: items,
        date: new Date().toISOString(),
        taxRate: taxRate,
      })
    );

    // 2. Open the dedicated print page in a new window/tab
    // This allows the new page to immediately trigger window.print()
    window.open("/print", "_blank");
  };

  return (
    // Fixed button for mobile/desktop view to open the Drawer
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

      {/* The main content of the Order Drawer (Sidebar) */}
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg p-4">
          <DrawerHeader>
            <DrawerTitle>Current Order</DrawerTitle>
            <DrawerDescription>
              Review and manage items before printing the slip.
            </DrawerDescription>
          </DrawerHeader>

          {/* Cart Items Table - Uses shadcn Table and Card */}
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
                      <TableRow key={item.key}>
                        <TableCell className="font-medium max-w-[150px] truncate">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(item.rate)}
                        </TableCell>
                        <TableCell>
                          {/* Quantity Controls */}
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
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Totals Summary */}
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

            {/* Action Buttons */}
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
