// src/components/OrderControls.js

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, Car, ShoppingBag } from "lucide-react";

export default function OrderControls({
  orderType,
  setOrderType,
  includeGST,
  setIncludeGST,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Type</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          {/* <Label className="mb-2 block font-semibold"></Label> */}
          <RadioGroup
            value={orderType}
            onValueChange={setOrderType}
            className="flex flex-wrap gap-4"
          >
            {[
              { value: "dine_in", label: "Dine In", icon: BadgeDollarSign },
              { value: "take_away", label: "Take Away", icon: ShoppingBag },
              { value: "delivery", label: "Delivery", icon: Car },
            ].map(({ value, label, icon: Icon }) => (
              <Label
                key={value}
                htmlFor={value}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 p-4 transition-colors hover:bg-accent hover:text-accent-foreground ${
                  orderType === value ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value={value} id={value} className="sr-only" />
                <Icon className="mb-2 h-6 w-6" />
                {label}
              </Label>
            ))}
          </RadioGroup>
        </div>
        {orderType === "dine_in" && (
          <div className="flex items-center space-x-2 rounded-lg border p-4">
            <Switch
              id="gst-toggle"
              checked={includeGST}
              onCheckedChange={setIncludeGST}
            />
            <Label htmlFor="gst-toggle" className="font-semibold">
              Apply GST ({process.env.NEXT_PUBLIC_GST_RATE}%)
            </Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
