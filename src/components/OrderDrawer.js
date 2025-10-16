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
  const { items, orderType, includeGST } = order;

  // Use ENV variables for calculation visibility
  const GST_RATE = parseFloat(process.env.NEXT_PUBLIC_GST_RATE || 0);
  const DELIVERY_CHARGE = parseFloat(
    process.env.NEXT_PUBLIC_DELIVERY_CHARGE || 0
  );

  const totalCalculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    // GST Logic: Only applies if includeGST is true AND orderType is 'dine_in'
    const tax = includeGST && orderType === "dine_in" ? subtotal * GST_RATE : 0;

    // Delivery Logic: Only applies if orderType is 'delivery'
    const deliveryFee = orderType === "delivery" ? DELIVERY_CHARGE : 0;

    const grandTotal = subtotal + tax + deliveryFee;

    return {
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      grandTotal: grandTotal,
    };
  }, [items, orderType, includeGST, GST_RATE, DELIVERY_CHARGE]);

  const handlePrint = () => {
    // Save all state for printing
    sessionStorage.setItem(
      "currentOrder",
      JSON.stringify({
        ...order,
        ...totalCalculations,
        date: new Date().toISOString(),
        GST_RATE,
        DELIVERY_CHARGE,
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
            <DrawerDescription className="font-bold text-lg uppercase text-primary">
              {orderType.replace("_", " ")}
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
                                {/* Addon total * Base item Qty */}
                                {formatCurrency(addon.total * item.quantity)}
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

          {/* Totals Summary (Updated) */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>{formatCurrency(totalCalculations.subtotal)}</span>
            </div>

            {/* Tax Line Item */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                GST ({(GST_RATE * 100).toFixed(0)}%):
                {orderType !== "dine_in"
                  ? " (N/A)"
                  : includeGST
                  ? ""
                  : " (Off)"}
              </span>
              <span className="font-medium">
                {formatCurrency(totalCalculations.tax)}
              </span>
            </div>

            {/* Delivery Fee Line Item */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Delivery Fee:</span>
              <span className="font-medium">
                {formatCurrency(totalCalculations.deliveryFee)}
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
