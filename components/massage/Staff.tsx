import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Staff } from "@/components/types/massage";

type ModalType = "add" | "edit" | null;

export default function StaffListPage({
  staffList,
  setStaffList,
}: {
  staffList: Staff[];
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>;
}) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [nameFormData, setNameFormData] = useState<string>("");


  // Save to localStorage whenever the staff list changes.
  useEffect(() => {
    if (staffList.length > 0) {
      localStorage.setItem("staffList", JSON.stringify(staffList));
    }
  }, [staffList]);

  // Open modal to add a new staff member.
  const openAddModal = () => {
    setCurrentStaff(null);
    setNameFormData("");
    setModalType("add");
  };

  // Open modal to edit an existing staff member.
  const openEditModal = (staff: Staff) => {
    setCurrentStaff(staff);
    setNameFormData(staff.name);
    setModalType("edit");
  };

  // Handle add staff submission.
  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = staffList.length
      ? Math.max(...staffList.map((s) => s.id)) + 1
      : 1;
    const timestamp = new Date().toISOString();
    const newStaff: Staff = {
      id: newId,
      name: nameFormData,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const updatedStaff = [...staffList, newStaff];
    setStaffList(updatedStaff);
    toast.success("Staff member added", {
      position: "top-center",
      autoClose: 5000,
    });
    setModalType(null);
  };

  // Handle edit staff submission.
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentStaff) return;
    setStaffList((prev) =>
      prev.map((staff) =>
        staff.id === currentStaff.id
          ? {
              ...staff,
              name: nameFormData,
              updatedAt: new Date().toISOString(),
            }
          : staff
      )
    );
    toast.success("Staff updated", { position: "top-center", autoClose: 5000 });
    setModalType(null);
  };

  // Handle staff deletion.
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setStaffList((prev) => prev.filter((staff) => staff.id !== id));
      toast.success("Staff deleted", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff List</h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Updated At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{staff.name}</td>
                <td className="px-6 py-4">
                  {new Date(staff.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(staff.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(staff)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staff.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!staffList.length && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No staff available. Please add a staff member.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
            {modalType === "add" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Add New Staff</h2>
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="staffName"
                      className="block text-sm font-medium mb-1"
                    >
                      Name:
                    </label>
                    <input
                      id="staffName"
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
            {modalType === "edit" && currentStaff && (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Staff</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="editStaffName"
                      className="block text-sm font-medium mb-1"
                    >
                      Name:
                    </label>
                    <input
                      id="editStaffName"
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
