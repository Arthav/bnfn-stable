import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Membership } from "@/components/types/massage";
import { toast } from "react-toastify";

type ModalType = "add" | "edit" | null;

export default function MembershipMasterPage({
  memberships,
  setMemberships,
}: {
  memberships: Membership[];
  setMemberships: React.Dispatch<React.SetStateAction<Membership[]>>;
}) {
  // Modal management state.
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(
    null
  );
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [membershipType, setMembershipType] = useState<
    "Basic" | "Premium" | "VIP" | string
  >("Basic");
  const [membershipStartDate, setMembershipStartDate] = useState<string>("");
  const [membershipEndDate, setMembershipEndDate] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [points, setPoints] = useState<number>(0);

  // Load memberships from localStorage on mount.
  useEffect(() => {
    const storedMemberships = localStorage.getItem("memberships");
    if (storedMemberships) {
      setMemberships(JSON.parse(storedMemberships));
    }
  }, []);

  // Save memberships to localStorage whenever they change (skip if empty).
  useEffect(() => {
    if (memberships.length === 0) return;
    localStorage.setItem("memberships", JSON.stringify(memberships));
  }, [memberships]);

  // Opens modal to add a new membership.
  const openAddModal = () => {
    setCurrentMembership(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setMembershipType("Basic");
    setMembershipStartDate("");
    setMembershipEndDate("");
    setIsActive(true);
    setPoints(0);
    setModalType("add");
  };

  // Opens modal to edit an existing membership.
  const openEditModal = (membership: Membership) => {
    setCurrentMembership(membership);
    setFirstName(membership.firstName);
    setLastName(membership.lastName);
    setEmail(membership.email);
    setPhoneNumber(membership.phoneNumber);
    setMembershipType(membership.membershipType);
    setMembershipStartDate(membership.membershipStartDate);
    setMembershipEndDate(membership.membershipEndDate || "");
    setIsActive(membership.isActive);
    setPoints(membership.points);
    setModalType("edit");
  };

  // Handles add membership form submission.
  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = memberships.length
      ? Math.max(...memberships.map((m) => m.id)) + 1
      : 1;
    const newMembership: Membership = {
      id: newId,
      firstName,
      lastName,
      email,
      phoneNumber,
      membershipType,
      membershipStartDate,
      membershipEndDate,
      isActive,
      points,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMemberships((prev) => [...prev, newMembership]);
    toast.success("Membership added", {
      position: "top-center",
      autoClose: 5000,
    });
    setModalType(null);
  };

  // Handles edit membership form submission.
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMembership) return;
    setMemberships((prev) =>
      prev.map((membership) =>
        membership.id === currentMembership.id
          ? {
              ...membership,
              firstName,
              lastName,
              email,
              phoneNumber,
              membershipType,
              membershipStartDate,
              membershipEndDate,
              isActive,
              points,
              updatedAt: new Date().toISOString(),
            }
          : membership
      )
    );
    toast.success("Membership updated", {
      position: "top-center",
      autoClose: 5000,
    });
    setModalType(null);
  };

  // Handles membership deletion.
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this membership?")) {
      setMemberships((prev) =>
        prev.filter((membership) => membership.id !== id)
      );
      toast.success("Membership deleted", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Membership Master Page</h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Membership
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {memberships.map((membership) => (
              <tr key={membership.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{membership.id}</td>
                <td className="px-6 py-4">
                  {membership.firstName} {membership.lastName}
                </td>
                <td className="px-6 py-4">{membership.email}</td>
                <td className="px-6 py-4">{membership.phoneNumber}</td>
                <td className="px-6 py-4">{membership.membershipType}</td>
                <td className="px-6 py-4">
                  {membership.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4">{membership.points}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(membership)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(membership.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!memberships.length && (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No memberships available. Please add a membership.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 ">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96  max-h-[80vh] overflow-y-auto">
            {modalType === "add" && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Add New Membership
                </h2>
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name:
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name:
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLastName(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email:
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium mb-1"
                    >
                      Phone Number:
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      value={phoneNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPhoneNumber(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="membershipType"
                      className="block text-sm font-medium mb-1"
                    >
                      Membership Type:
                    </label>
                    <select
                      id="membershipType"
                      value={membershipType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setMembershipType(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Premium">Premium</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="membershipStartDate"
                      className="block text-sm font-medium mb-1"
                    >
                      Start Date:
                    </label>
                    <input
                      id="membershipStartDate"
                      type="date"
                      value={membershipStartDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMembershipStartDate(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="membershipEndDate"
                      className="block text-sm font-medium mb-1"
                    >
                      End Date:
                    </label>
                    <input
                      id="membershipEndDate"
                      type="date"
                      value={membershipEndDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMembershipEndDate(e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="points"
                      className="block text-sm font-medium mb-1"
                    >
                      Points:
                    </label>
                    <input
                      id="points"
                      type="number"
                      value={points}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPoints(Number(e.target.value))
                      }
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
                      Add Membership
                    </button>
                  </div>
                </form>
              </>
            )}
            {/* Edit modal */}
            {modalType === "edit" && currentMembership && (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Membership</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name:
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name:
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLastName(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email:
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium mb-1"
                    >
                      Phone Number:
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      value={phoneNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPhoneNumber(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="membershipType"
                      className="block text-sm font-medium mb-1"
                    >
                      Membership Type:
                    </label>
                    <select
                      id="membershipType"
                      value={membershipType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setMembershipType(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Premium">Premium</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="membershipStartDate"
                      className="block text-sm font-medium mb-1"
                    >
                      Start Date:
                    </label>
                    <input
                      id="membershipStartDate"
                      type="date"
                      value={membershipStartDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMembershipStartDate(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="membershipEndDate"
                      className="block text-sm font-medium mb-1"
                    >
                      End Date:
                    </label>
                    <input
                      id="membershipEndDate"
                      type="date"
                      value={membershipEndDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMembershipEndDate(e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="points"
                      className="block text-sm font-medium mb-1"
                    >
                      Points:
                    </label>
                    <input
                      id="points"
                      type="number"
                      value={points}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPoints(Number(e.target.value))
                      }
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
