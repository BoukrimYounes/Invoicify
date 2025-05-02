import React, { useEffect, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { FiPlus, FiTrash2, FiSave, FiX, FiUpload } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

function NewInvoice() {
    const [taxRate, setTaxRate] = useState(0); // Percentage (e.g., 20 for 20%)
    const [discount, setDiscount] = useState(0); // Percentage (e.g., 10 for 10%)
    const [currency, setCurrency] = useState("MAD");

    const { auth } = usePage().props;
    const user = auth.user;

    const { flash } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        number: `INV-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        user_id: user.id,
        status: "Unpaid",
        // Change billTo to customer to match backend
        customer: {
            name: "",
            email: "",
            address: "",
        },
        invoice_items: [
            {
                id: Date.now().toString().slice(-4),
                description: "",
                quantity: 1,
                unit_price: 0,
            },
        ],
        notes: "",
        // Initialize calculated fields with 0 instead of empty string
        subtotal: 0,
        discount: 0,
        total: 0,
        tax_rate: 0,
        currency: "MAD",
    });
    // Currencies
    const currencies = [
        { code: "MAD", name: "Moroccan Dirham" },
        { code: "USD", name: "US Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "JPY", name: "Japanese Yen" },
        { code: "BTC", name: "Bitcoin" }, // Added Bitcoin
    ];

    const invoiceStatuses = [
        { value: "Unpaid", label: "Unpaid", color: "bg-red-100 text-red-800" },
        {
            value: "Pending",
            label: "Pending",
            color: "bg-yellow-100 text-yellow-800",
        },
        { value: "Paid", label: "Paid", color: "bg-green-100 text-green-800" },
    ];

    const subtotal = data.invoice_items.reduce(
        (sum, item) =>
            sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
        0
    );

    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + taxAmount - discountAmount;

        useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);

        setData((prev) => ({
            ...prev,
            subtotal: subtotal,
            tax_rate: taxRate,
            discount: discount,
            total: total,
            currency: currency,
        }));
    }, [subtotal, taxRate, discount, total, currency,flash]);
    
    // Handle logo upload
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file?.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
        }
    };

    const handleItemChange = (id, field, value) => {
        setData((prev) => ({
            ...prev,
            invoice_items: prev.invoice_items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    // Add/remove invoice_items
    const addItem = () => {
        setData((prev) => ({
            ...prev,
            invoice_items: [
                ...prev.invoice_items,
                {
                    id: Date.now().toString().slice(-4),
                    description: "",
                    quantity: 1,
                    unit_price: 0,
                },
            ],
        }));
    };

    const removeItem = (id) => {
        setData((prev) => ({
            ...prev,
            invoice_items: prev.invoice_items.filter((item) => item.id !== id),
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        post("/invoices");
        router.reload();
        console.log(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Toaster position="top-center" reverseOrder={false} />
                {/* Header */}
                <div className="flex justify-between invoice_items-center mb-6">
                    <div className="flex invoice_items-center gap-4">
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
                <form onSubmit={handleSubmit}>
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
                                    value={data.number}
                                    onChange={(e) =>
                                        setData("number", e.target.value)
                                    }
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
                                <label className="flex flex-col invoice_items-center justify-center h-full min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />

                                    {user.logo ? (
                                        <div className="relative">
                                            <img
                                                src={user.logo}
                                                alt="Company Logo"
                                                className="w-20 h-20 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <FiX className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col invoice_items-center p-4 text-center">
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
                                value={data.date}
                                onChange={(e) =>
                                    setData("date", e.target.value)
                                }
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
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
                                value={data.due_date}
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                                required
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    {/* Bill From/To */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-100">
                                Bill From
                            </h3>
                            <div className="space-y-2">
                                {/* Name Field */}
                                <div className="relative">
                                    <input
                                        value={user?.name || ""}
                                        readOnly
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-not-allowed"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-not-allowed"
                                    />
                                </div>

                                {/* Address Field */}
                                <div className="relative">
                                    <textarea
                                        value={user?.address || ""}
                                        readOnly
                                        rows="3"
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-100">
                                Bill To
                            </h3>
                            <div className="space-y-2">
                                <div className="relative">
                                    <input
                                        value={data.customer?.name || ""}
                                        onChange={(e) =>
                                            setData(
                                                "customer.name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 "
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={data.customer?.email || ""}
                                        onChange={(e) =>
                                            setData(
                                                "customer.email",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 "
                                    />
                                </div>

                                {/* Address Field */}
                                <div className="relative">
                                    <textarea
                                        value={data.customer?.address || ""}
                                        onChange={(e) =>
                                            setData(
                                                "customer.address",
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 "
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice_items */}
                    <div className="mb-6">
                        <div className="flex justify-between invoice_items-center mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-gray-100">
                                Invoice_items
                            </h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex invoice_items-center gap-1 transition focus:outline-none"
                            >
                                <FiPlus />
                                Add Item
                            </button>
                        </div>
                        {data.invoice_items.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="flex gap-4 mb-3 invoice_items-center"
                            >
                                <input
                                    value={item.description}
                                    onChange={(e) =>
                                        handleItemChange(
                                            item.id,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Description"
                                    className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleItemChange(
                                            item.id,
                                            "quantity",
                                            e.target.value
                                        )
                                    }
                                    className="w-24 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                                <input
                                    type="number"
                                    value={item.unit_price}
                                    onChange={(e) =>
                                        handleItemChange(
                                            item.id,
                                            "unit_price",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Unit_price"
                                    className="w-24 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 cursor-pointer focus:outline-none"
                                    aria-label="Remove item"
                                >
                                    <FiTrash2 size={20} />
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
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows="3"
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Additional notes for the invoice"
                            required
                        />
                    </div>

                    {/* Disc and Tax and currency */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="">
                            <label
                                htmlFor="taxRate"
                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Tax Rate (%)
                            </label>
                            <div className="relative">
                                <input
                                    id="taxRate"
                                    type="number"
                                    value={taxRate || ""}
                                    onChange={(e) => {
                                        const value =
                                            e.target.value === ""
                                                ? 0
                                                : Math.max(
                                                      0,
                                                      Number(e.target.value)
                                                  );
                                        setTaxRate(value);
                                    }}
                                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>
                        <div className="">
                            <label
                                htmlFor="discount"
                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Discount (%)
                            </label>
                            <div className="relative">
                                <input
                                    id="discount"
                                    type="number"
                                    value={discount || ""}
                                    onChange={(e) => {
                                        const value =
                                            e.target.value === ""
                                                ? 0
                                                : Math.max(
                                                      0,
                                                      Number(e.target.value)
                                                  );
                                        setDiscount(value);
                                    }}
                                    className=" w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    min="0"
                                    required
                                />

                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="currency"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Currency
                            </label>
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-4 appearance-none py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                {currencies.map((curr) => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.name} ({curr.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                                >
                                    {invoiceStatuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <span
                                        className={`${
                                            invoiceStatuses.find(
                                                (s) => s.value === data.status
                                            )?.color
                                        } px-2 py-1 rounded-full text-xs`}
                                    >
                                        {
                                            invoiceStatuses.find(
                                                (s) => s.value === data.status
                                            )?.label
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
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
                                {((subtotal * taxRate) / 100).toFixed(2)}{" "}
                                {currency}
                            </span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-100">
                            <span>Discount ({discount}%):</span>
                            <span>
                                -{((subtotal * discount) / 100).toFixed(2)}{" "}
                                {currency}
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
                        <input
                            type="button" // Prevent form submission
                            value="Cancel"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none"
                        ></input>
                        <input
                            type="submit" // Trigger form submission// Trigger form submission
                            value="Save Invoice"
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none"
                        ></input>
                        {/* <button
              type="button"
              href={route('invoices.edit',{ invoice: invoice.id })}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition focus:outline-none"
            >
              Print Invoice
            </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewInvoice;
