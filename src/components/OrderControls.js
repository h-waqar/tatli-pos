// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { BadgeDollarSign, Car, ShoppingBag } from "lucide-react";

// export default function OrderControls({
//   orderType,
//   setOrderType,
//   includeGST,
//   setIncludeGST,
// }) {
//   return (
//     // Main container: A single, compact flex row with a border
//     <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-lg border p-3">
//       {/* Left Side: Order Type Selection */}
//       <div className="flex items-center gap-3">
//         {/* <Label htmlFor="order-type-group" className="font-semibold">
//           Order Type:
//         </Label> */}

//         {/* Replaced bulky RadioGroup with a compact ToggleGroup */}
//         <ToggleGroup
//           id="order-type-group"
//           type="single"
//           variant="outline"
//           value={orderType}
//           onValueChange={(value) => {
//             // Prevent deselecting by ensuring a value is always set
//             if (value) {
//               setOrderType(value);
//             }
//           }}
//           className="h-9"
//         >
//           <ToggleGroupItem value="dine_in" aria-label="Dine In">
//             <BadgeDollarSign className="h-4 w-4 sm:mr-2" />
//             <span className="hidden sm:inline">Dine In</span>
//           </ToggleGroupItem>
//           <ToggleGroupItem value="take_away" aria-label="Take Away">
//             <ShoppingBag className="h-4 w-4 sm:mr-2" />
//             <span className="hidden sm:inline">Take Away</span>
//           </ToggleGroupItem>
//           <ToggleGroupItem value="delivery" aria-label="Delivery">
//             <Car className="h-4 w-4 sm:mr-2" />
//             <span className="hidden sm:inline">Delivery</span>
//           </ToggleGroupItem>
//         </ToggleGroup>
//       </div>

//       {/* Right Side: GST Toggle (only appears for Dine In) */}
//       {orderType === "dine_in" && (
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="gst-toggle"
//             checked={includeGST}
//             onCheckedChange={setIncludeGST}
//           />
//           <Label htmlFor="gst-toggle" className="font-semibold text-sm">
//             Apply GST ({process.env.NEXT_PUBLIC_GST_RATE}%)
//           </Label>
//         </div>
//       )}
//     </div>
//   );
// }

// src/components/OrderControls.js

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BadgeDollarSign, Car, ShoppingBag } from "lucide-react";

export default function OrderControls({
  orderType,
  setOrderType,
  includeGST,
  setIncludeGST,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <ToggleGroup
          id="order-type-group"
          type="single"
          variant="outline"
          value={orderType}
          onValueChange={(value) => {
            if (value) {
              setOrderType(value);
            }
          }}
          className="h-9"
        >
          {/* --- THIS IS THE FIX --- */}
          {/* Added classes to make active and hover states highly visible */}
          <ToggleGroupItem
            value="dine_in"
            aria-label="Dine In"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <BadgeDollarSign className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Dine In</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="take_away"
            aria-label="Take Away"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-accent hover:text-accent-foreground px-4"
          >
            <ShoppingBag className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Take Away</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="delivery"
            aria-label="Delivery"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Car className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Delivery</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {orderType === "dine_in" && (
        <div className="flex items-center space-x-2">
          <Switch
            id="gst-toggle"
            checked={includeGST}
            onCheckedChange={setIncludeGST}
          />
          <Label htmlFor="gst-toggle" className="font-semibold text-sm">
            Apply GST ({process.env.NEXT_PUBLIC_GST_RATE}%)
          </Label>
        </div>
      )}
    </div>
  );
}
