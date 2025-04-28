import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useMemo,
} from "react";
import {
  Membership,
  MembershipTypesStruct,
  RedeemPointHistoryStruct,
} from "@/components/types/massage";
import { toast } from "react-toastify";

type ModalType = "add" | "edit" | "redeem" | null;

export default function MembershipMasterPage({
  memberships,
  setMemberships,
  membershipTypes,
  redeemHistory,
  setRedeemHistory,
}: {
  memberships: Membership[];
  setMemberships: React.Dispatch<React.SetStateAction<Membership[]>>;
  membershipTypes: MembershipTypesStruct[];
  redeemHistory: RedeemPointHistoryStruct[];
  setRedeemHistory: React.Dispatch<
    React.SetStateAction<RedeemPointHistoryStruct[]>
  >;
}) {
  // Modal management state.
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(
    null
  );
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");
  const [identityNumber, setIdentityNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [membershipTypeId, setMembershipTypeId] = useState<number>(0);
  const [membershipStartDate, setMembershipStartDate] = useState<string>("");
  const [membershipEndDate, setMembershipEndDate] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [points, setPoints] = useState<number>(0);
  const [redeemPoints, setRedeemPoints] = useState<number>(0);
  const [showDetailModal, setShowDetailModal] = useState<Membership | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

  useEffect(() => {
    if (redeemHistory.length === 0) return;
    localStorage.setItem("redeemHistory", JSON.stringify(redeemHistory));
  }, [redeemHistory]);

  // Filter memberships based on search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filterMemberships = useMemo(
    () =>
      memberships.filter(
        (membership) =>
          membership.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          membership.lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          membership.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          membership.phoneNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      ),
    [memberships, searchQuery]
  );

  // Pagination calculations
  const totalPages = Math.ceil(filterMemberships.length / itemsPerPage);
  const paginatedMemberships = filterMemberships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  useEffect(() => {
    if (redeemHistory.length === 0) return;
    localStorage.setItem("redeemHistory", JSON.stringify(redeemHistory));
  }, [redeemHistory]);

  // Opens modal to add a new membership.
  const openAddModal = () => {
    setCurrentMembership(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setNationality("");
    setIdentityNumber("");
    setPhoneNumber("");
    setMembershipTypeId(0);
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
    setNationality(membership.nationality);
    setIdentityNumber(membership.identityNumber);
    setPhoneNumber(membership.phoneNumber);
    setMembershipTypeId(membership.membershipTypeId);
    setMembershipStartDate(membership.membershipStartDate);
    setMembershipEndDate(membership.membershipEndDate || "");
    setIsActive(membership.isActive);
    setPoints(membership.points);
    setModalType("edit");
  };

  // Opens modal to redeem points.
  const openRedeemModal = (membership: Membership) => {
    setCurrentMembership(membership);
    setRedeemPoints(0);
    setModalType("redeem");
  };

  const openDetailModal = (membership: Membership) => {
    setShowDetailModal(membership);
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
      nationality,
      identityNumber,
      membershipTypeId,
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
              nationality,
              identityNumber,
              membershipTypeId,
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

  const handleRedeemSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !currentMembership ||
      redeemPoints <= 0 ||
      redeemPoints > currentMembership.points
    ) {
      toast.error("Invalid points to redeem", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Update the membership points
    const updatedMembership = {
      ...currentMembership,
      points: currentMembership.points - redeemPoints,
      updatedAt: new Date().toISOString(),
    };

    // Update memberships state
    setMemberships((prev) =>
      prev.map((membership) =>
        membership.id === currentMembership.id ? updatedMembership : membership
      )
    );

    // Add to redeem history
    const newRedeemHistory: RedeemPointHistoryStruct = {
      id: Math.max(...memberships.map((m) => m.id)) + 1, // Generate new ID for redemption
      membershipId: currentMembership.id,
      points: redeemPoints,
      redeemDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setRedeemHistory((prev) => [...prev, newRedeemHistory]);

    toast.success("Points redeemed successfully", {
      position: "top-center",
      autoClose: 5000,
    });
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Membership Master Page</h1>
        <div className="flex items-center justify-end">
          <label htmlFor="perPage" className="mr-2">
            Show
          </label>
          <select
            id="perPage"
            className="bg-gray-700 text-white px-2 py-1 rounded"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">per page</span>
        </div>

        <div className="flex items-center">
          <button
            onClick={openAddModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded ml-2"
          >
            Add Membership
          </button>
          <div className="flex items-center ml-3">
            <input
              type="text"
              placeholder="Search memberships"
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
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Name
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
            {paginatedMemberships?.map((membership) => (
              <tr key={membership.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{membership.id}</td>
                <td className="px-6 py-4">
                  {membership.firstName} {membership.lastName}
                </td>
                <td className="px-6 py-4">
                  {membershipTypes.find(
                    (t) => t.id === membership.membershipTypeId
                  )?.name || "-"}
                </td>
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
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openRedeemModal(membership)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Redeem Points
                  </button>
                  <button
                    onClick={() => openDetailModal(membership)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Show Details
                  </button>
                </td>
              </tr>
            ))}
            {!paginatedMemberships.length && (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  No memberships available. Please add a membership.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filterMemberships.length > itemsPerPage && (
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

      {showDetailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Membership Details</h2>
            <div className="mb-4">
              <p>
                <strong>Name:</strong> {showDetailModal.firstName}{" "}
                {showDetailModal.lastName}
              </p>
              <p>
                <strong>Email:</strong> {showDetailModal.email}
              </p>
              <p>
                <strong>Phone:</strong> {showDetailModal.phoneNumber}
              </p>
              <p>
                <strong>Nationality:</strong> {showDetailModal.nationality}
              </p>
              <p>
                <strong>Identity Number:</strong>{" "}
                {showDetailModal.identityNumber}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetailModal(null)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 ">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            {/* Modal content */}
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
                      htmlFor="nationality"
                      className="block text-sm font-medium mb-1"
                    >
                      Nationality:
                    </label>
                    <input
                      id="nationality"
                      type="text"
                      value={nationality}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNationality(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="identityNumber"
                      className="block text-sm font-medium mb-1"
                    >
                      Identity Number:
                    </label>
                    <input
                      id="identityNumber"
                      type="text"
                      value={identityNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setIdentityNumber(e.target.value)
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
                      value={membershipTypeId}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setMembershipTypeId(Number(e.target.value))
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    >
                      <option value="">Select Membership Type</option>
                      {membershipTypes.map((membershipType) => (
                        <option
                          key={membershipType.id}
                          value={membershipType.id}
                        >
                          {membershipType.name}
                        </option>
                      ))}
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
                      htmlFor="nationality"
                      className="block text-sm font-medium mb-1"
                    >
                      Nationality:
                    </label>
                    <input
                      id="nationality"
                      type="text"
                      value={nationality}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNationality(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="identityNumber"
                      className="block text-sm font-medium mb-1"
                    >
                      Identity Number:
                    </label>
                    <input
                      id="identityNumber"
                      type="text"
                      value={identityNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setIdentityNumber(e.target.value)
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
                      value={membershipTypeId}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setMembershipTypeId(Number(e.target.value))
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    >
                      <option value="">Select Membership Type</option>
                      {membershipTypes.map((membershipType) => (
                        <option
                          key={membershipType.id}
                          value={membershipType.id}
                        >
                          {membershipType.name}
                        </option>
                      ))}
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
            {modalType === "redeem" && currentMembership && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Redeem Points</h2>
                  <form onSubmit={handleRedeemSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="redeemPoints"
                        className="block text-sm font-medium mb-1"
                      >
                        Points to Redeem:
                      </label>
                      <input
                        id="redeemPoints"
                        type="number"
                        value={redeemPoints}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setRedeemPoints(Number(e.target.value))
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
                        Redeem
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
