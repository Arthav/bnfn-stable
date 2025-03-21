import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";

// Define your data type – change the fields as required.
interface Item {
  id: number;
  name: string;
  // Add additional fields if needed.
}

type ModalType = "add" | "edit" | null;

export default function TemplatePage() {
  // State for a list of items.
  const [items, setItems] = useState<Item[]>([]);
  // Modal management state.
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [nameFormData, setNameFormData] = useState<string>("");

  // Load items from localStorage on mount.
  useEffect(() => {
    const storedItems = localStorage.getItem("items");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Save items to localStorage whenever they change (skip if empty).
  useEffect(() => {
    if (items.length === 0) return;
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // Opens modal to add a new item.
  const openAddModal = () => {
    setCurrentItem(null);
    setNameFormData("");
    setModalType("add");
  };

  // Opens modal to edit an existing item.
  const openEditModal = (item: Item) => {
    setCurrentItem(item);
    setNameFormData(item.name);
    setModalType("edit");
  };

  // Handles add item form submission.
  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem: Item = { id: newId, name: nameFormData };
    setItems(prev => [...prev, newItem]);
    toast.success("Item added", { position: "top-center", autoClose: 5000 });
    setModalType(null);
  };

  // Handles edit item form submission.
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentItem) return;
    setItems(prev =>
      prev.map(item =>
        item.id === currentItem.id ? { ...item, name: nameFormData } : item
      )
    );
    toast.success("Item updated", { position: "top-center", autoClose: 5000 });
    setModalType(null);
  };

  // Handles item deletion.
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success("Item deleted", { position: "top-center", autoClose: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Template Page</h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={2} className="text-center py-4">
                  No items available. Please add items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
            {modalType === "add" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="itemName"
                      className="block text-sm font-medium mb-1"
                    >
                      Item Name:
                    </label>
                    <input
                      id="itemName"
                      type="text"
                      value={nameFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNameFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </>
            )}
            {modalType === "edit" && currentItem && (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="editItemName"
                      className="block text-sm font-medium mb-1"
                    >
                      Item Name:
                    </label>
                    <input
                      id="editItemName"
                      type="text"
                      value={nameFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNameFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
