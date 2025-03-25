import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Services } from "@/components/types/massage";

// Constants for service status ordering and classes.
const statusOrder: Record<Services["status"], number> = {
  Active: 0,
  Discontinued: 1,
};

type ModalType = "add" | "edit" | null;

const statusClasses: Record<Services["status"], string> = {
  Active: "bg-green-600",
  Discontinued: "bg-gray-600",
};

export default function ManageServicePage({
  services,
  setServices,
}: {
  services: Services[];
  setServices: (services: Services[]) => void;
}) {
  // Modal and current service state.
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentService, setCurrentService] = useState<Services | null>(null);
  // Form states.
  const [nameFormData, setNameFormData] = useState<string>("");
  const [descriptionFormData, setDescriptionFormData] = useState<string>("");
  const [priceFormData, setPriceFormData] = useState<string>("");
  const [serviceTimeFormData, setServiceTimeFormData] = useState<string>("");
  const [footTimeFormData, setFootTimeFormData] = useState<string>("");
  const [bodyTimeFormData, setBodyTimeFormData] = useState<string>("");
  const [commissionFormData, setCommissionFormData] = useState<string>("");

  const sortedServices = [...services].sort((a, b) => {
    const diff = statusOrder[a.status] - statusOrder[b.status];
    if (diff !== 0) return diff;
    return 0;
  });

  // Load services from localStorage on mount.
  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  // Save services to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  // Opens modal to add a new service.
  const openAddModal = () => {
    setCurrentService(null);
    setNameFormData("");
    setDescriptionFormData("");
    setPriceFormData("");
    setServiceTimeFormData("");
    setFootTimeFormData("");
    setBodyTimeFormData("");
    setCommissionFormData("");
    setModalType("add");
  };

  // Opens modal to edit an existing service.
  const openEditModal = (service: Services) => {
    setCurrentService(service);
    setNameFormData(service.name);
    setDescriptionFormData(service.description);
    setPriceFormData(service.price.toString());
    setServiceTimeFormData(service.serviceTimeMin.toString());
    setFootTimeFormData(service.footTimeMin.toString());
    setBodyTimeFormData(service.bodyTimeMin.toString());
    setCommissionFormData(service.commission.toString());
    setModalType("edit");
  };

  // Handles add service form submission.
  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = services.length
      ? Math.max(...services.map((s) => s.id)) + 1
      : 1;
    const newService: Services = {
      id: newId,
      name: nameFormData,
      description: descriptionFormData,
      price: parseFloat(priceFormData) || 0,
      status: "Active",
      serviceTimeMin: parseFloat(serviceTimeFormData) || 0,
      footTimeMin: parseFloat(footTimeFormData) || 0,
      bodyTimeMin: parseFloat(bodyTimeFormData) || 0,
      commission: parseFloat(commissionFormData) || 0,
    };
    setServices([...services, newService]);
    toast.success("Service added", { position: "top-center", autoClose: 5000 });
    setModalType(null);
  };

  // Handles edit service form submission.
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentService) return;
    setServices(
      services.map((service) =>
        service.id === currentService.id
          ? {
              ...service,
              name: nameFormData,
              description: descriptionFormData,
              price: parseFloat(priceFormData) || 0,
              serviceTimeMin: parseFloat(serviceTimeFormData) || 0,
              footTimeMin: parseFloat(footTimeFormData) || 0,
              bodyTimeMin: parseFloat(bodyTimeFormData) || 0,
              commission: parseFloat(commissionFormData) || 0,
            }
          : service
      )
    );
    toast.success("Service updated", {
      position: "top-center",
      autoClose: 5000,
    });
    setModalType(null);
  };

  // Handles service deletion.
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices(
        services.map((service) =>
          service.id === id ? { ...service, status: "Discontinued" } : service
        )
      );
      toast.success("Service discontinued", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleActivate = (id: number) => {
    if (window.confirm("Are you sure you want to activate this service?")) {
      setServices(
        services.map((service) =>
          service.id === id ? { ...service, status: "Active" } : service
        )
      );
      toast.success("Service activated", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Service</h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Service
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Service Time (Min)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Foot Time (Min)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Body Time (Min)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Commission
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
            {sortedServices.map((service) => (
              <tr key={service.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{service.name}</td>
                <td className="px-6 py-4">{service.description}</td>
                <td className="px-6 py-4">${service.price.toFixed(2)}</td>
                <td className="px-6 py-4">{service.serviceTimeMin}</td>
                <td className="px-6 py-4">{service.footTimeMin}</td>
                <td className="px-6 py-4">{service.bodyTimeMin}</td>
                <td className="px-6 py-4">${service.commission.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${statusClasses[service.status]}`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(service)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  {service.status !== "Discontinued" && (
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Discontinue
                    </button>
                  )}
                  {service.status === "Discontinued" && (
                    <button
                      onClick={() => handleActivate(service.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!services.length && (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No services available. Please add services.
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
                <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="serviceName"
                      className="block text-sm font-medium mb-1"
                    >
                      Service Name:
                    </label>
                    <input
                      id="serviceName"
                      type="text"
                      value={nameFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNameFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="serviceDescription"
                      className="block text-sm font-medium mb-1"
                    >
                      Description:
                    </label>
                    <textarea
                      id="serviceDescription"
                      value={descriptionFormData}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setDescriptionFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="servicePrice"
                      className="block text-sm font-medium mb-1"
                    >
                      Price:
                    </label>
                    <input
                      id="servicePrice"
                      type="number"
                      min={0}
                      value={priceFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPriceFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="serviceTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Service Time (Min):
                    </label>
                    <input
                      id="serviceTime"
                      type="number"
                      value={serviceTimeFormData}
                      min={0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setServiceTimeFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="footTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Foot Time (Min):
                    </label>
                    <input
                      id="footTime"
                      type="number"
                      min={0}
                      value={footTimeFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFootTimeFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="bodyTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Body Time (Min):
                    </label>
                    <input
                      id="bodyTime"
                      type="number"
                      min={0}
                      value={bodyTimeFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setBodyTimeFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="commission"
                      className="block text-sm font-medium mb-1"
                    >
                      Commission:
                    </label>
                    <input
                      id="commission"
                      type="number"
                      value={commissionFormData}
                      min={0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCommissionFormData(e.target.value)
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
                      Add Service
                    </button>
                  </div>
                </form>
              </>
            )}
            {modalType === "edit" && currentService && (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="editServiceName"
                      className="block text-sm font-medium mb-1"
                    >
                      Service Name:
                    </label>
                    <input
                      id="editServiceName"
                      type="text"
                      value={nameFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNameFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="editServiceDescription"
                      className="block text-sm font-medium mb-1"
                    >
                      Description:
                    </label>
                    <textarea
                      id="editServiceDescription"
                      value={descriptionFormData}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setDescriptionFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="editServicePrice"
                      className="block text-sm font-medium mb-1"
                    >
                      Price:
                    </label>
                    <input
                      id="editServicePrice"
                      type="number"
                      min={0}
                      value={priceFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPriceFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="editServiceTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Service Time (Min):
                    </label>
                    <input
                      id="editServiceTime"
                      type="number"
                      value={serviceTimeFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setServiceTimeFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="editFootTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Foot Time (Min):
                    </label>
                    <input
                      id="editFootTime"
                      type="number"
                      value={footTimeFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFootTimeFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="editBodyTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Body Time (Min):
                    </label>
                    <input
                      id="editBodyTime"
                      type="number"
                      value={bodyTimeFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setBodyTimeFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="editCommission"
                      className="block text-sm font-medium mb-1"
                    >
                      Commission:
                    </label>
                    <input
                      id="editCommission"
                      type="number"
                      value={commissionFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCommissionFormData(e.target.value)
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
