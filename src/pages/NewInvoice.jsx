import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiX,
  FiUpload,
} from "react-icons/fi";

function NewInvoice() {
  const navigate = useNavigate();
  const [currency] = useState("MAD");
  const [taxRate] = useState(10);
  const [discount] = useState(0);


  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    billFrom: {
      name: "Your Company",
      email: "billing@company.com",
      address: "123 Business St, City",
      logo: null,
    },
    billTo: {
      name: "",
      email: "",
      address: "",
    },
    items: [{ id: Date.now(), description: "", quantity: 1, price: 0 }],
  });

  // Calculate totals
  const subtotal = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const total =
    subtotal + (subtotal * taxRate) / 100 - (subtotal * discount) / 100;

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          billFrom: { ...prev.billFrom, logo: e.target.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Add/remove items
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), description: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const removeItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Create Invoice
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            aria-label="Close"
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Logo Upload & Invoice Number */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Invoice Number */}
          <div className="space-y-2">
            <label
              htmlFor="invoiceNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Invoice Number
            </label>
            <div className="relative">
              <input
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="INV-0001"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">
                #ID
              </span>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Logo
            </label>
            <div className="relative group">
              <label className="flex flex-col items-center justify-center h-full min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {formData.billFrom.logo ? (
                  <div className="relative">
                    <img
                      src={formData.billFrom.logo}
                      alt="Company Logo"
                      className="w-20 h-20 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          billFrom: { ...prev.billFrom, logo: null },
                        }))
                      }
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <FiUpload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <div className="text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        Upload logo
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="invoiceDate"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Invoice Date
            </label>
            <input
              id="invoiceDate"
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Bill From/To */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-100">
              Bill From
            </h3>
            <AddressSection
              data={formData.billFrom}
              onChange={(field, value) =>
                setFormData((prev) => ({
                  ...prev,
                  billFrom: { ...prev.billFrom, [field]: value },
                }))
              }
            />
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-100">
              Bill To
            </h3>
            <AddressSection
              data={formData.billTo}
              onChange={(field, value) =>
                setFormData((prev) => ({
                  ...prev,
                  billTo: { ...prev.billTo, [field]: value },
                }))
              }
            />
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-100">
              Items
            </h3>
            <button
              onClick={addItem}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              <FiPlus /> Add Item
            </button>
          </div>
          {formData.items.map((item) => (
            <div key={item.id} className="flex gap-4 mb-3 items-end">
              <input
                value={item.description}
                onChange={(e) =>
                  handleItemChange(item.id, "description", e.target.value)
                }
                placeholder="Description"
                className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(item.id, "quantity", e.target.value)
                }
                className="w-20 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min="1"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(item.id, "price", e.target.value)
                }
                placeholder="Price"
                className="w-32 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 focus:outline-none"
                aria-label="Remove item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Additional notes for the invoice"
          />
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
          <div className="flex justify-between mb-2 text-gray-800 dark:text-gray-100">
            <span>Subtotal:</span>
            <span>
              {subtotal.toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between mb-2 text-gray-800 dark:text-gray-100">
            <span>Tax ({taxRate}%):</span>
            <span>
              {((subtotal * taxRate) / 100).toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-100">
            <span>Discount ({discount}%):</span>
            <span>
              -{((subtotal * discount) / 100).toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between font-bold border-t pt-4 text-gray-800 dark:text-gray-100">
            <span>Total:</span>
            <span>
              {total.toFixed(2)} {currency}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-2 focus:outline-none">
            <FiSave /> Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Address Component
const AddressSection = ({ data, onChange }) => (
  <div className="space-y-2">
    <input
      value={data.name}
      onChange={(e) => onChange("name", e.target.value)}
      placeholder="Name"
      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />
    <input
      type="email"
      value={data.email}
      onChange={(e) => onChange("email", e.target.value)}
      placeholder="Email"
      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />
    <textarea
      value={data.address}
      onChange={(e) => onChange("address", e.target.value)}
      placeholder="Address"
      rows="3"
      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />
  </div>
);

export default NewInvoice;
