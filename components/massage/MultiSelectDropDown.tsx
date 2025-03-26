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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
        className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-left focus:outline-none"
      >
        {selectedAddOnIds.length > 0 ? selectedLabels : "Select Add‑Ons"}
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
