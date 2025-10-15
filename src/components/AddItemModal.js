// "use client";

// import React, { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Plus, Minus } from "lucide-react";
// import { formatCurrency } from "@/utils/format";

// export default function AddItemModal({ item, category, onAddItem }) {
//   const [open, setOpen] = useState(false);

//   // 1. Scoop/Rate Management (for Ice Cream)
//   const initialRate =
//     item.rates && item.rates.length > 0 ? item.rates[0] : item.rate;
//   const [selectedRate, setSelectedRate] = useState(initialRate);

//   // 2. Addon Management
//   // State to track selected addons: { addonId: quantity }
//   const initialAddonState = category.addons
//     ? category.addons.reduce((acc, addon) => ({ ...acc, [addon.id]: 0 }), {})
//     : {};
//   const [selectedAddons, setSelectedAddons] = useState(initialAddonState);

//   // Determine the primary label for the item
//   const itemLabel = item.rates
//     ? (category.scoops || ["Option"])[item.rates.indexOf(selectedRate)]
//     : item.name;

//   // Calculate total price of all selected addons
//   const addonsTotal = useMemo(() => {
//     if (!category.addons) return 0;
//     return category.addons.reduce((total, addon) => {
//       const quantity = selectedAddons[addon.id] || 0;
//       return total + addon.rate * quantity;
//     }, 0);
//   }, [selectedAddons, category.addons]);

//   // Calculate the final price of the customized item
//   const finalItemRate = selectedRate + addonsTotal;

//   const handleUpdateAddon = (addonId, delta) => {
//     setSelectedAddons((prev) => {
//       const newQuantity = Math.max(0, (prev[addonId] || 0) + delta);
//       return { ...prev, [addonId]: newQuantity };
//     });
//   };

//   const handleFinalAddToOrder = () => {
//     // 1. Identify which addons were selected with quantity > 0
//     const activeAddons = category.addons
//       ? category.addons
//           .filter((addon) => selectedAddons[addon.id] > 0)
//           .map((addon) => ({
//             id: addon.id,
//             name: addon.name,
//             rate: addon.rate,
//             quantity: selectedAddons[addon.id],
//             total: addon.rate * selectedAddons[addon.id],
//           }))
//       : [];

//     // 2. Create the unique custom item object
//     const customItem = {
//       // Name includes the rate/scoop option for clear identification in the cart
//       name: item.rates ? `${item.name} (${itemLabel})` : item.name,
//       id: item.id,
//       baseRate: selectedRate,
//       rate: finalItemRate, // Final rate includes all addons
//       addons: activeAddons,
//     };

//     onAddItem(customItem);

//     // Reset state and close modal
//     setSelectedRate(initialRate);
//     setSelectedAddons(initialAddonState);
//     setOpen(false);
//   };

//   // Skip rendering if rate is null and no rates array exists (e.g., "Zesty Zinger")
//   if (item.rate === null && !item.rates) {
//     return (
//       <Button size="sm" variant="secondary" disabled>
//         Rate Missing
//       </Button>
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm">
//           <Plus className="h-4 w-4" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md p-0">
//         <DialogHeader className="p-6 pb-4 bg-primary text-primary-foreground rounded-t-lg">
//           <DialogTitle>Customize {item.name}</DialogTitle>
//         </DialogHeader>

//         <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
//           {/* Rate/Scoop Selector (For Ice Cream and future variable items) */}
//           {item.rates && (
//             <Card>
//               <CardHeader>
//                 <DialogTitle className="text-base">
//                   Select Size/Scoop
//                 </DialogTitle>
//               </CardHeader>
//               <CardContent className="grid gap-2">
//                 {item.rates.map((rate, index) => (
//                   <Button
//                     key={index}
//                     variant={selectedRate === rate ? "default" : "secondary"}
//                     onClick={() => setSelectedRate(rate)}
//                   >
//                     {category.scoops[index]} - {formatCurrency(rate)}
//                   </Button>
//                 ))}
//               </CardContent>
//             </Card>
//           )}

//           {/* Addon Selection */}
//           {category.addons && category.addons.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <DialogTitle className="text-base">Add Extras</DialogTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {category.addons.map((addon) => (
//                   <div
//                     key={addon.id}
//                     className="flex justify-between items-center"
//                   >
//                     <p className="font-medium">
//                       {addon.name} ({formatCurrency(addon.rate)})
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         onClick={() => handleUpdateAddon(addon.id, -1)}
//                         disabled={selectedAddons[addon.id] === 0}
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-5 text-center">
//                         {selectedAddons[addon.id]}
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         onClick={() => handleUpdateAddon(addon.id, 1)}
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Footer with Final Total and Add button */}
//         <DialogFooter className="sticky bottom-0 bg-white dark:bg-card p-6 border-t">
//           <div className="flex justify-between items-center w-full">
//             <div className="text-lg font-bold">
//               Total: {formatCurrency(finalItemRate)}
//             </div>
//             <Button onClick={handleFinalAddToOrder}>Add to Order</Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default function AddItemModal({ item, category, onAddItem }) {
  const [open, setOpen] = useState(false);

  // 1. Scoop/Rate Management (for Ice Cream)
  const initialRate =
    item.rates && item.rates.length > 0 ? item.rates[0] : item.rate;
  const [selectedRate, setSelectedRate] = useState(initialRate);

  // 2. Addon Management
  // State to track selected addons: { addonId: quantity }
  const initialAddonState = category.addons
    ? category.addons.reduce((acc, addon) => ({ ...acc, [addon.id]: 0 }), {})
    : {};
  const [selectedAddons, setSelectedAddons] = useState(initialAddonState);

  // FIX 1: Safely access category.scoops
  const scoopLabels = category.scoops || [];

  // Determine the primary label for the item
  // FIX 2: Safely access the scoop label array
  const itemLabel =
    item.rates && scoopLabels.length > 0
      ? scoopLabels[item.rates.indexOf(selectedRate)]
      : item.name;

  // Calculate total price of all selected addons
  const addonsTotal = useMemo(() => {
    if (!category.addons) return 0;
    return category.addons.reduce((total, addon) => {
      const quantity = selectedAddons[addon.id] || 0;
      return total + addon.rate * quantity;
    }, 0);
  }, [selectedAddons, category.addons]);

  // Calculate the final price of the customized item
  const finalItemRate = selectedRate + addonsTotal;

  const handleUpdateAddon = (addonId, delta) => {
    setSelectedAddons((prev) => {
      const newQuantity = Math.max(0, (prev[addonId] || 0) + delta);
      return { ...prev, [addonId]: newQuantity };
    });
  };

  const handleFinalAddToOrder = () => {
    // 1. Identify which addons were selected with quantity > 0
    const activeAddons = category.addons
      ? category.addons
          .filter((addon) => selectedAddons[addon.id] > 0)
          .map((addon) => ({
            id: addon.id,
            name: addon.name,
            rate: addon.rate,
            quantity: selectedAddons[addon.id],
            total: addon.rate * selectedAddons[addon.id],
          }))
      : [];

    // 2. Create the unique custom item object
    const customItem = {
      // Name includes the rate/scoop option for clear identification in the cart
      name: item.rates ? `${item.name} (${itemLabel})` : item.name,
      id: item.id,
      baseRate: selectedRate,
      rate: finalItemRate, // Final rate includes all addons
      addons: activeAddons,
    };

    onAddItem(customItem);

    // Reset state and close modal
    setSelectedRate(initialRate);
    setSelectedAddons(initialAddonState);
    setOpen(false);
  };

  // Skip rendering if rate is null and no rates array exists (e.g., "Zesty Zinger")
  if (item.rate === null && !item.rates) {
    return (
      <Button size="sm" variant="secondary" disabled>
        Rate Missing
      </Button>
    );
  }

  // Determine if customization is even needed (only show modal if rates/addons exist)
  const isCustomizable =
    item.rates || (category.addons && category.addons.length > 0);

  // If it's a simple single-rate item without addons, use a simple button directly
  if (!isCustomizable && item.rate !== null && item.rate !== undefined) {
    return (
      <Button
        size="sm"
        onClick={() =>
          onAddItem({
            name: item.name,
            id: item.id,
            baseRate: item.rate,
            rate: item.rate,
            addons: [],
          })
        }
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          {isCustomizable ? "Customize" : <Plus className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-4 bg-primary text-primary-foreground rounded-t-lg">
          <DialogTitle>Customize {item.name}</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Rate/Scoop Selector (For Ice Cream and future variable items) */}
          {item.rates && (
            <Card>
              <CardHeader>
                <DialogTitle className="text-base">
                  Select Size/Scoop
                </DialogTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {item.rates.map((rate, index) => (
                  <Button
                    key={index}
                    variant={selectedRate === rate ? "default" : "secondary"}
                    onClick={() => setSelectedRate(rate)}
                  >
                    {/* FIX 3: Safely display the scoop label */}
                    {scoopLabels[index] || "Option"} - {formatCurrency(rate)}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Addon Selection */}
          {category.addons && category.addons.length > 0 && (
            <Card>
              <CardHeader>
                <DialogTitle className="text-base">Add Extras</DialogTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex justify-between items-center"
                  >
                    <p className="font-medium">
                      {addon.name} ({formatCurrency(addon.rate)})
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleUpdateAddon(addon.id, -1)}
                        disabled={selectedAddons[addon.id] === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center">
                        {selectedAddons[addon.id]}
                      </span>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleUpdateAddon(addon.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer with Final Total and Add button */}
        <DialogFooter className="sticky bottom-0 bg-white dark:bg-card p-6 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="text-lg font-bold">
              Total: {formatCurrency(finalItemRate)}
            </div>
            <Button onClick={handleFinalAddToOrder}>Add to Order</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
