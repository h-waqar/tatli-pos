// src/components/OrderDrawer.js

"use client";

import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MinusCircle,
  PlusCircle,
  Printer,
  ShoppingBasket,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/utils/format";
import React from "react";

export default function OrderDrawer({ order, onUpdateQuantity, onClearOrder }) {
  const router = useRouter();
  const {
    items,
    subtotal,
    serviceCharge,
    tax,
    deliveryFee,
    grandTotal,
    orderType,
  } = order;

  const handlePrint = () => {
    const orderForPrint = {
      ...order,
      date: new Date().toISOString(),
      GST_RATE: parseFloat(process.env.NEXT_PUBLIC_GST_RATE || 0) / 100,
      SERVICE_CHARGE_RATE:
        parseFloat(process.env.NEXT_PUBLIC_SERVICE_CHARGE_RATE || 0) / 100,
    };
    sessionStorage.setItem("currentOrder", JSON.stringify(orderForPrint));
    router.push("/print");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-20 h-16 w-16 rounded-full shadow-lg"
          size="icon"
        >
          <ShoppingBasket className="h-8 w-8" />
          {items?.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {items.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>Current Order</DrawerTitle>
            {items?.length > 0 && (
              <Button variant="destructive" size="sm" onClick={onClearOrder}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear Order
              </Button>
            )}
          </DrawerHeader>
          <div className="overflow-y-auto p-4">
            {items?.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                No items added yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <React.Fragment key={item.key}>
                      <TableRow>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() =>
                              onUpdateQuantity(item.key, item.quantity - 1)
                            }
                          >
                            <MinusCircle className="h-5 w-5" />
                          </Button>
                          <span className="w-6 text-center font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() =>
                              onUpdateQuantity(item.key, item.quantity + 1)
                            }
                          >
                            <PlusCircle className="h-5 w-5" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>

                      {/* If the item is a DEAL, list its contents */}
                      {item.items?.map((dealItem, index) => (
                        <TableRow
                          key={index}
                          className="text-xs hover:bg-transparent"
                        >
                          <TableCell className="py-1 pl-8 italic text-muted-foreground border-none">
                            - {dealItem.name}
                          </TableCell>
                          <TableCell className="border-none"></TableCell>
                          <TableCell className="border-none"></TableCell>
                        </TableRow>
                      ))}

                      {/* Addon Rows */}
                      {item.addons?.map((addon) => (
                        <TableRow
                          key={addon.id}
                          className="text-xs hover:bg-transparent"
                        >
                          <TableCell className="py-1 pl-8 italic text-muted-foreground border-none">
                            + {addon.quantity}x {addon.name}
                          </TableCell>
                          <TableCell className="border-none"></TableCell>
                          <TableCell className="py-1 text-right italic text-muted-foreground border-none">
                            {formatCurrency(
                              addon.rate * addon.quantity * item.quantity
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>Subtotal</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(subtotal)}
                    </TableCell>
                  </TableRow>
                  {serviceCharge > 0 && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        Service Charges (
                        {process.env.NEXT_PUBLIC_SERVICE_CHARGE_RATE}%)
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(serviceCharge)}
                      </TableCell>
                    </TableRow>
                  )}
                  {tax > 0 && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        GST ({process.env.NEXT_PUBLIC_GST_RATE}%)
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(tax)}
                      </TableCell>
                    </TableRow>
                  )}
                  {deliveryFee > 0 && (
                    <TableRow>
                      <TableCell colSpan={2}>Delivery Fee</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(deliveryFee)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="text-lg font-bold">
                    <TableCell colSpan={2}>Grand Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(grandTotal)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </div>
          {items?.length > 0 && (
            <div className="sticky bottom-0 mt-auto border-t bg-background p-4">
              <Button className="w-full" size="lg" onClick={handlePrint}>
                <Printer className="mr-2 h-5 w-5" /> Print Slip
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
