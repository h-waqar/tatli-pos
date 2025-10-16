"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ORDER_TYPES = [
  { value: "dine_in", label: "Dine In" },
  { value: "take_away", label: "Take Away" },
  { value: "delivery", label: "Delivery" },
];

export default function OrderControls({
  orderType,
  setOrderType,
  includeGST,
  setIncludeGST,
}) {
  // Logic: GST is only applicable to Dine In orders, so we disable the toggle otherwise.
  const isGSTApplicable = orderType === "dine_in";

  // Logic: Delivery Fee is only applicable to Delivery orders.
  const isDelivery = orderType === "delivery";

  const handleOrderTypeChange = (value) => {
    setOrderType(value);
    // Automatically turn off GST if switching away from Dine In
    if (value !== "dine_in") {
      setIncludeGST(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Type Selector */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="order-type">Order Type</Label>
          <Select value={orderType} onValueChange={handleOrderTypeChange}>
            <SelectTrigger id="order-type" className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* GST Toggle (Dine In Only) */}
        <div className="flex items-center justify-between">
          <Label htmlFor="gst-toggle">
            Apply GST Tax
            <p className="text-xs text-muted-foreground">
              ({process.env.NEXT_PUBLIC_GST_RATE * 100}%) - Only for Dine In
            </p>
          </Label>
          <Switch
            id="gst-toggle"
            checked={includeGST}
            onCheckedChange={setIncludeGST}
            disabled={!isGSTApplicable}
          />
        </div>

        {/* Delivery Indicator */}
        {isDelivery && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-sm">
            <p className="text-sm font-medium">
              Delivery Fee applies:{" "}
              {formatCurrency(process.env.NEXT_PUBLIC_DELIVERY_CHARGE)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
