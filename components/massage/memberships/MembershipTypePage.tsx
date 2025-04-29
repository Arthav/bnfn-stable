import React, { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import { MembershipTypesStruct } from "@/components/types/massage";
import { toast } from "react-toastify";

type ModalType = "add" | "edit" | null;

export default function MembershipTypePage({
  membershipTypes,
  setMembershipTypes,
}: {
  membershipTypes: MembershipTypesStruct[];
  setMembershipTypes: React.Dispatch<React.SetStateAction<MembershipTypesStruct[]>>;
}) {
  // Modal management state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentMembershipType, setCurrentMembershipType] = useState<MembershipTypesStruct | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Load membership types from localStorage on mount
  useEffect(() => {
    const storedMembershipTypes = localStorage.getItem("membershipTypes");
    if (storedMembershipTypes) {
      setMembershipTypes(JSON.parse(storedMembershipTypes));
    }
  }, []);

  // Save membership types to localStorage whenever they change (skip if empty)
  useEffect(() => {
    if (membershipTypes.length === 0) return;
    localStorage.setItem("membershipTypes", JSON.stringify(membershipTypes));
  }, [membershipTypes]);

  // Filter membership types based on search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filterMembershipTypes = useMemo(
    () =>
      membershipTypes.filter(
        (membershipType) =>
          membershipType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          membershipType.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [membershipTypes, searchQuery]
  );

  // Opens modal to add a new membership type
  const openAddModal = () => {
    setCurrentMembershipType(null);
    setName("");
    setDescription("");
    setPrice(0);
    setDuration(0);
    setModalType("add");
  };

  // Opens modal to edit an existing membership type
  const openEditModal = (membershipType: MembershipTypesStruct) => {
    setCurrentMembershipType(membershipType);
    setName(membershipType.name);
    setDescription(membershipType.description);
    setPrice(membershipType.price);
    setDuration(membershipType.duration);
    setModalType("edit");
  };

  // Handles add membership type form submission
  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = membershipTypes.length ? Math.max(...membershipTypes.map((m) => m.id)) + 1 : 1;
    const newMembershipType: MembershipTypesStruct = {
      id: newId,
      name,
      description,
      price,
      duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMembershipTypes((prev) => [...prev, newMembershipType]);
    toast.success("Membership Type added", { position: "top-center", autoClose: 5000 });
    setModalType(null);
  };

  // Handles edit membership type form submission
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMembershipType) return;
    setMembershipTypes((prev) =>
      prev.map((membershipType) =>
        membershipType.id === currentMembershipType.id
          ? {
              ...membershipType,
              name,
              description,
              price,
              duration,
              updatedAt: new Date().toISOString(),
            }
          : membershipType
      )
    );
    toast.success("Membership Type updated", { position: "top-center", autoClose: 5000 });
    setModalType(null);
  };

  // Handles membership type deletion
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this membership type?")) {
      setMembershipTypes((prev) => prev.filter((membershipType) => membershipType.id !== id));
      toast.success("Membership Type deleted", { position: "top-center", autoClose: 5000 });
    }
  };

  function formatNumber(num: number): string {
    const safeNumber = Math.max(num, 0);
    return safeNumber.toString();
  }

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Membership Type Page</h1>
        <div className="flex items-center">
          <button
            onClick={openAddModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded ml-2"
          >
            Add Membership Type
          </button>
          <div className="flex items-center ml-3">
            <input
              type="text"
              placeholder="Search membership types"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">ID</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Name</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Description</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Price</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Duration (Months)</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {filterMembershipTypes?.map((membershipType) => (
              <tr key={membershipType.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{membershipType.id}</td>
                <td className="px-6 py-4">{membershipType.name}</td>
                <td className="px-6 py-4">{membershipType.description}</td>
                <td className="px-6 py-4">${membershipType.price}</td>
                <td className="px-6 py-4">{membershipType.duration}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(membershipType)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(membershipType.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!filterMembershipTypes.length && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No membership types available. Please add a membership type.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            {modalType === "add" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Add New Membership Type</h2>
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name:
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description:
                    </label>
                    <input
                      id="description"
                      type="text"
                      value={description}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium mb-1">
                      Price ($):
                    </label>
                    <input
                      id="price"
                      type="number"
                      value={formatNumber(price)}
                      step=".01"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="duration" className="block text-sm font-medium mb-1">
                      Duration (Months):
                    </label>
                    <input
                      id="duration"
                      type="number"
                      value={formatNumber(duration)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value))}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
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
                      Add Membership Type
                    </button>
                  </div>
                </form>
              </>
            )}

            {modalType === "edit" && currentMembershipType && (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Membership Type</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name:
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description:
                    </label>
                    <input
                      id="description"
                      type="text"
                      value={description}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium mb-1">
                      Price ($):
                    </label>
                    <input
                      id="price"
                      type="number"
                      value={formatNumber(price)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="duration" className="block text-sm font-medium mb-1">
                      Duration (Months):
                    </label>
                    <input
                      id="duration"
                      type="number"
                      value={formatNumber(duration)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value))}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
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
                      Save Changes
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
