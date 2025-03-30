import React, { useState } from "react";
import { AddOns } from "@/components/types/massage";

interface MultiSelectDropdownProps {
  addOns: AddOns[];
  selectedAddOnIds: number[];
  setSelectedAddOnIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function MultiSelectDropdown({
  addOns,
  selectedAddOnIds,
  setSelectedAddOnIds,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeAddOns = addOns.filter((addon) => addon.status === "Active");

  const toggleSelection = (id: number) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedLabels = activeAddOns
    .filter((addon) => selectedAddOnIds.includes(addon.id))
    .map((addon) => addon.name)
    .join(", ");

  // Compute the total price of selected add‑Ons
  const totalPrice = activeAddOns
    .filter((addon) => selectedAddOnIds.includes(addon.id))
    .reduce((acc, addon) => acc + addon.price, 0);

  return (
    // Wrap in a focusable div with onBlur to handle clicks outside
    <div className="relative" tabIndex={0}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-left focus:outline-none"
      >
        <div className="flex justify-between items-center">
          <span>{selectedAddOnIds.length > 0 ? selectedLabels : "Select Add‑Ons"}</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded shadow-lg max-h-60 overflow-auto">
          {activeAddOns.map((addon) => (
            <label
              key={addon.id}
              className="flex items-center px-2 py-1 hover:bg-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedAddOnIds.includes(addon.id)}
                onChange={() => toggleSelection(addon.id)}
                className="mr-2"
              />
              <span>
                {addon.name} (${addon.price})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
