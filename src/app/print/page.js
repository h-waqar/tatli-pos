"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate, formatTime } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PrintPage() {
  const [order, setOrder] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("currentOrder");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrder(parsedOrder);
    }

    const printTimer = setTimeout(() => {
      if (storedOrder) {
        window.print();
        sessionStorage.removeItem("currentOrder");
      }
    }, 500);

    return () => {
      clearTimeout(printTimer);
    };
  }, []);

  if (!order) {
    return (
      <div className="p-8 text-center bg-background text-foreground">
        <h1 className="text-2xl font-bold">Error Loading Order</h1>
        <p className="mt-2">
          Please go back to the main page and click &apos;Print Slip&apos;
          again.
        </p>
      </div>
    );
  }

  // --- Print Slip Layout (58mm Thermal Friendly) ---

  const PrintLayout = (
    <div className="print-only-container p-2">
      <header className="text-center mb-3">
        <h1 className="font-bold text-lg leading-tight">TATLI RESTAURANT</h1>
        <p className="text-xs">Order Slip</p>
        <p className="text-xs">
          Date: {formatDate(order.date)}
          <br />
          Time: {formatTime(order.date)}
        </p>
        <hr className="my-2 border-black border-t-[1.5px]" />
      </header>

      {/* Items List - Using a bare Table for structure */}
      <Card className="border-0 shadow-none p-0">
        <CardContent className="p-0">
          <Table className="w-full text-left">
            <TableHeader>
              <TableRow className="border-b border-black">
                <TableHead className="py-1 px-0 font-bold text-left w-1/12">
                  QTY
                </TableHead>
                <TableHead className="py-1 px-1 font-bold w-6/12">
                  ITEM
                </TableHead>
                <TableHead className="py-1 px-0 text-right font-bold w-3/12">
                  RATE
                </TableHead>
                <TableHead className="py-1 px-0 text-right font-bold w-2/12">
                  TOTAL
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <React.Fragment key={item.key || index}>
                  {/* Base Item Row */}
                  <TableRow className="border-b border-dashed border-gray-400 h-auto font-bold">
                    <TableCell className="py-0.5 px-0 text-left">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="py-0.5 px-1 whitespace-normal max-w-[100px]">
                      {item.name}
                    </TableCell>
                    <TableCell className="py-0.5 px-0 text-right">
                      {formatCurrency(item.baseRate || item.rate)}
                    </TableCell>
                    <TableCell className="py-0.5 px-0 text-right">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>

                  {/* Nested Addon Rows */}
                  {item.addons &&
                    item.addons.map((addon) => (
                      <TableRow
                        key={`${item.key}-${addon.id}-print`}
                        className="h-auto"
                      >
                        <TableCell className="py-0.5 px-0 text-left"></TableCell>
                        <TableCell className="py-0.5 pl-4 px-1 text-xs italic whitespace-normal">
                          + {addon.quantity}x {addon.name}
                        </TableCell>
                        <TableCell className="py-0.5 px-0 text-right text-xs">
                          {formatCurrency(addon.rate)}
                        </TableCell>
                        <TableCell className="py-0.5 px-0 text-right text-xs">
                          {formatCurrency(addon.total * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer / Totals Section */}
      <footer className="mt-4 text-right space-y-1">
        <div className="flex justify-between">
          <span>SUBTOTAL:</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>TAX:</span>
          <span>{formatCurrency(order.tax)}</span>
        </div>
        <hr className="my-1 border-black border-t-[1.5px]" />
        <div className="flex justify-between font-bold text-lg">
          <span>GRAND TOTAL:</span>
          <span>{formatCurrency(order.grandTotal)}</span>
        </div>
        <p className="text-center mt-3 text-xs">
          *** Thank you for your order! ***
        </p>
      </footer>
    </div>
  );

  return (
    <>
      <div className="p-8 bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">
          Print Preview (Ready for 58mm)
        </h1>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 border rounded-lg max-w-sm mx-auto shadow-xl">
          <div className="bg-white dark:bg-black text-black dark:text-white p-2">
            {PrintLayout}
          </div>
        </div>
        <p className="text-center mt-6 text-sm text-muted-foreground">
          The print dialog opened automatically. This is the thermal slip
          preview.
        </p>
      </div>

      <div className="hidden print-only-container">{PrintLayout}</div>
    </>
  );
}
