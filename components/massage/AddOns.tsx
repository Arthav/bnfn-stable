import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { AddOns, Staff } from "@/components/types/massage";

type ModalType = "add" | "edit" | null;

export default function ManageAddOnsPage({
  addOns,
  setAddOns,
  activeStaff,
}: {
  addOns: AddOns[];
  setAddOns: React.Dispatch<React.SetStateAction<AddOns[]>>;
  activeStaff: Staff | null;
}) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentAddon, setCurrentAddon] = useState<AddOns | null>(null);
  // Form state for all fields.
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    profit: 0,
    status: "Active" as "Active" | "Discontinued",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations.
  const totalPages = Math.ceil(addOns.length / itemsPerPage);
  const paginatedAddOns = addOns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Save add-ons to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem("addOns", JSON.stringify(addOns));
  }, [addOns]);

  const openAddModal = () => {
    setCurrentAddon(null);
    setFormData({ name: "", price: 0, profit: 0, status: "Active" });
    setModalType("add");
  };

  const openEditModal = (addon: AddOns) => {
    setCurrentAddon(addon);
    setFormData({
      name: addon.name,
      price: addon.price,
      profit: addon.profit,
      status: addon.status,
    });
    setModalType("edit");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "profit" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = addOns.length ? Math.max(...addOns.map((a) => a.id)) + 1 : 1;
    const newAddon: AddOns = { id: newId, ...formData, createdBy: activeStaff };
    setAddOns((prev) => [...prev, newAddon]);
    setTimeout(() => {
      toast.success("Addon added", { position: "top-center", autoClose: 5000 });
    }, 0);

    setModalType(null);
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentAddon) return;
    setAddOns((prev) =>
      prev.map((a) => (a.id === currentAddon.id ? { ...a, ...formData } : a))
    );
    toast.success("Addon updated", { position: "top-center", autoClose: 5000 });
    setModalType(null);
  };

  // Toggle the add-on status between Active and Discontinued.
  const handleToggleStatus = (id: number) => {
    const addonToToggle = addOns.find((addon) => addon.id === id);
    if (!addonToToggle) return;
    const newStatus =
      addonToToggle.status === "Active" ? "Discontinued" : "Active";

    setAddOns((prev) =>
      prev.map((addon) =>
        addon.id === id ? { ...addon, status: newStatus } : addon
      )
    );

    // Defer toast outside the updater function.
    setTimeout(() => {
      toast.success(
        `Addon ${newStatus === "Active" ? "activated" : "deactivated"}`,
        { position: "top-center", autoClose: 5000 }
      );
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SGD",
      minimumSignificantDigits: 1,
      minimumIntegerDigits: 1,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.max(value, 0));
  };

  function formatNumber(num: number): string {
    const safeNumber = Math.max(num, 0);
    return safeNumber.toString();
  }

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Add-ons</h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Add-on
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Profit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {paginatedAddOns.map((addon) => (
              <tr key={addon.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{addon.name}</td>
                <td className="px-6 py-4">{formatCurrency(addon.price)}</td>
                <td className="px-6 py-4">{formatCurrency(addon.profit)}</td>
                <td className="px-6 py-4">{addon.status}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(addon)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  {addon.status === "Active" ? (
                    <button
                      onClick={() => handleToggleStatus(addon.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(addon.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!addOns.length && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No add-ons available. Please add add-ons.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {addOns.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
            {modalType === "add" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Add New Add-on</h2>
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Name:
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium mb-1"
                    >
                      Price:
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formatNumber(formData.price)}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400">
                      {formData.price
                        ? formatCurrency(formData.price)
                        : "SGD 0,00"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="profit"
                      className="block text-sm font-medium mb-1"
                    >
                      Profit:
                    </label>
                    <input
                      id="profit"
                      name="profit"
                      type="number"
                      value={formatNumber(formData.profit)}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400">
                      {formData.profit
                        ? formatCurrency(formData.profit)
                        : "SGD 0,00"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium mb-1"
                    >
                      Status:
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
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
            {modalType === "edit" && currentAddon && (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Add-on</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Name:
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium mb-1"
                    >
                      Price:
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="profit"
                      className="block text-sm font-medium mb-1"
                    >
                      Profit:
                    </label>
                    <input
                      id="profit"
                      name="profit"
                      type="number"
                      value={formData.profit}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium mb-1"
                    >
                      Status:
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
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
