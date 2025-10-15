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

  useEffect(() => {
    // 1. Load data from sessionStorage
    const storedOrder = sessionStorage.getItem("currentOrder");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrder(parsedOrder);
    }

    // 2. Trigger print dialog after component mounts and data is loaded
    // Use a small timeout to ensure the DOM has fully updated after state change
    const printTimer = setTimeout(() => {
      if (storedOrder) {
        window.print();
        // Optional: clear the session storage item after printing is initiated
        sessionStorage.removeItem("currentOrder");
      }
    }, 500);

    // Cleanup timer on unmount
    return () => {
      clearTimeout(printTimer);
    };
  }, []);

  if (!order) {
    return (
      <div className="p-8 text-center bg-background text-foreground">
        <h1 className="text-2xl font-bold">Error Loading Order</h1>
        <p className="mt-2">
          Please go back to the main page and click 'Print Slip' again.
        </p>
      </div>
    );
  }

  const PrintLayout = (
    // The main container for the receipt. The globals.css media query targets this class
    // to apply 58mm sizing and monospace font only for printing.
    <div className="print-only-container p-4">
      {/* Header Section */}
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
                <TableHead className="py-1 px-0 font-bold text-left">
                  QTY
                </TableHead>
                <TableHead className="py-1 px-1 font-bold">ITEM</TableHead>
                <TableHead className="py-1 px-0 text-right font-bold">
                  RATE
                </TableHead>
                <TableHead className="py-1 px-0 text-right font-bold">
                  TOTAL
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow
                  key={item.key || index}
                  className="border-b border-dashed border-gray-400 h-auto"
                >
                  <TableCell className="py-0.5 px-0 text-left">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="py-0.5 px-1 whitespace-normal max-w-[100px]">
                    {item.name}
                  </TableCell>
                  <TableCell className="py-0.5 px-0 text-right">
                    {formatCurrency(item.rate)}
                  </TableCell>
                  <TableCell className="py-0.5 px-0 text-right">
                    {formatCurrency(item.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer / Totals Section */}
      <footer className="mt-4 text-right space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (5%):</span>
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
      {/* This is the non-print view, displayed in the browser window
        when the print page is opened. It gives context before the print dialog appears.
      */}
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

      {/* The actual component rendered, which the media query targets for printing */}
      <div className="hidden print-only-container">{PrintLayout}</div>
    </>
  );
}
