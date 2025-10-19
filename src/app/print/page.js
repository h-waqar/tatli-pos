// src/app/print/page.js

"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate, formatTime } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function PrintPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("currentOrder");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
      const printTimer = setTimeout(() => {
        window.print();
        sessionStorage.removeItem("currentOrder");
      }, 500);
      return () => clearTimeout(printTimer);
    }
  }, []);

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">No order data found.</h1>
      </div>
    );
  }

  const {
    items,
    orderType,
    subtotal,
    serviceCharge,
    tax,
    deliveryFee,
    grandTotal,
  } = order;
  const GST_RATE_PERCENT = (order.GST_RATE || 0) * 100;
  const SERVICE_CHARGE_PERCENT = (order.SERVICE_CHARGE_RATE || 0) * 100;

  const PrintLayout = (
    <div className="print-slip">
      <header className="text-center">
        <h1 className="text-lg font-bold">TATLI RESTAURANT</h1>
        <p className="text-xs font-bold uppercase">
          {(orderType || "Order").replace("_", " ")}
        </p>
        <p className="text-xs">
          Date: {formatDate(order.date)} | Time: {formatTime(order.date)}
        </p>
      </header>
      <hr className="my-2 border-t border-dashed border-black" />

      {/* --- FIX: Added 'table-fixed' to enforce column widths --- */}
      <Table className="text-xs table-fixed w-full">
        <TableHeader>
          <TableRow>
            {/* --- FIX: Defined column widths --- */}
            <TableHead className="h-auto p-1 font-bold w-[60%]">Item</TableHead>
            <TableHead className="h-auto p-1 text-center font-bold w-[15%]">
              Qty
            </TableHead>
            <TableHead className="h-auto p-1 text-right font-bold w-[25%]">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <React.Fragment key={item.key}>
              <TableRow>
                {/* --- FIX: Added 'break-words' to wrap long text --- */}
                <TableCell className="p-1 font-bold break-words align-top">
                  {item.name}
                </TableCell>
                <TableCell className="p-1 text-center font-bold align-top">
                  {item.quantity}
                </TableCell>
                <TableCell className="p-1 text-right font-bold align-top">
                  {formatCurrency(item.baseRate * item.quantity)}
                </TableCell>
              </TableRow>

              {item.items?.map((dealItem, index) => (
                <TableRow key={`${item.key}-deal-${index}`}>
                  {/* --- FIX: Added 'break-words' to wrap long text in deals --- */}
                  <TableCell className="py-0 pl-4 text-xs italic break-words">
                    - {dealItem.name}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}

              {item.addons?.map((addon) => (
                <TableRow key={`${item.key}-addon-${addon.id}`}>
                  <TableCell className="py-0 pl-4 text-xs italic break-words">
                    + {addon.quantity}x {addon.name}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="py-0 text-right text-xs">
                    {formatCurrency(
                      addon.rate * addon.quantity * item.quantity
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <hr className="my-2 border-t border-dashed border-black" />
      <footer className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {serviceCharge > 0 && (
          <div className="flex justify-between">
            <span>Service Charge ({SERVICE_CHARGE_PERCENT}%):</span>
            <span>{formatCurrency(serviceCharge)}</span>
          </div>
        )}
        {tax > 0 && (
          <div className="flex justify-between">
            <span>GST ({GST_RATE_PERCENT}%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        )}
        {deliveryFee > 0 && (
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between pt-1 text-sm font-bold">
          <span>GRAND TOTAL:</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </footer>
      <p className="pt-3 text-center text-xs">*** Thank You! ***</p>
    </div>
  );

  return (
    <>
      <div className="screen-only bg-gray-100 p-8">
        <h1 className="mb-4 text-center text-2xl font-bold">Print Preview</h1>
        <Card className="mx-auto w-full max-w-[320px] shadow-lg">
          <CardContent className="p-4">{PrintLayout}</CardContent>
        </Card>
      </div>
      <div className="print-only">{PrintLayout}</div>
    </>
  );
}
