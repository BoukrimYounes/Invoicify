import React, { useEffect, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { FiPlus, FiTrash2, FiSave, FiX, FiUpload } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

function EditInvoice({ invoice }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const { flash } = usePage().props;

    const { data, setData, put, errors, processing } = useForm({
        number: invoice.number,
        date: invoice.date,
        due_date: invoice.due_date,
        user_id: user.id,
        customer_id: invoice.customer_id,
        status: invoice.status,
        customer: {
            name: invoice.customer?.name || "",
            email: invoice.customer?.email || "",
            address: invoice.customer?.address || "",
        },
        invoice_items: invoice.items?.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
        })) || [
            {
                id: Date.now().toString(),
                description: "",
                quantity: 1,
                unit_price: 0,
            },
        ],
        subtotal: invoice.subtotal || 0,
        tax_rate: invoice.tax_rate || 0,
        discount: invoice.discount || 0,
        total: invoice.total || 0,
        currency: invoice.currency || "MAD",
        notes: invoice.notes || "",
        deleted_items: [],
        logo: null,
    });

    // Derived states from form data
    const [currency, setCurrency] = useState(data.currency);
    const [taxRate, setTaxRate] = useState(data.tax_rate);
    const [discount, setDiscount] = useState(data.discount);
    const [logoPreview, setLogoPreview] = useState(invoice.logo_url || null);

    // Currencies
    const currencies = [
        { code: "MAD", name: "Moroccan Dirham" },
        { code: "USD", name: "US Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "JPY", name: "Japanese Yen" },
        { code: "BTC", name: "Bitcoin" },
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

    const formatNumber = (num) => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(num);
    };

    // Calculate totals
    const subtotal = data.invoice_items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
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
    }, [subtotal, taxRate, discount, total, currency, flash]);

    // Handle logo upload
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file?.type.startsWith("image/")) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size should be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target.result);
            };
            reader.readAsDataURL(file);

            setData("logo", file); // Store the file object directly
        } else {
            toast.error("Please upload an image file");
        }
    };

    const removeLogo = () => {
        setLogoPreview(null);
        setData("logo", null);
    };

    const handleItemChange = (id, field, value) => {
        setData((prev) => ({
            ...prev,
            invoice_items: prev.invoice_items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          [field]:
                              field === "quantity" || field === "unit_price"
                                  ? Number(value)
                                  : value,
                      }
                    : item
            ),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append all data fields
        Object.keys(data).forEach((key) => {
            if (
                key === "invoice_items" ||
                key === "customer" ||
                key === "deleted_items"
            ) {
                formData.append(key, JSON.stringify(data[key]));
            } else if (key === "logo") {
                if (data.logo) {
                    formData.append(key, data.logo);
                }
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        put(`/invoices/${invoice.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Invoice updated successfully");
            },
            onError: (errors) => {
                toast.error("Failed to update invoice");
                console.error(errors);
            },
        });
    };

    // Add new item
    const addItem = () => {
        setData((prev) => ({
            ...prev,
            invoice_items: [
                ...prev.invoice_items,
                {
                    id: Date.now().toString(),
                    description: "",
                    quantity: 1,
                    unit_price: 0,
                },
            ],
        }));
    };

    // Remove item
    const removeItem = (id) => {
        const existingItem = data.invoice_items.find(
            (item) => item.id === id && item.id?.toString().length > 4 // Check if it's a DB item
        );

        setData((prev) => ({
            ...prev,
            invoice_items: prev.invoice_items.filter((item) => item.id !== id),
            deleted_items: existingItem
                ? [...prev.deleted_items, existingItem.id]
                : prev.deleted_items,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Toaster position="top-center" reverseOrder={false} />

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Edit Invoice
                        </h1>
                    </div>
                    <button
                        onClick={() => window.history.back()}
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
                                    name="number"
                                    value={data.number}
                                    onChange={(e) =>
                                        setData("number", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="INV-0001"
                                    required
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">
                                    #ID
                                </span>
                            </div>
                            {errors.number && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.number}
                                </p>
                            )}
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
                                    {logoPreview ? (
                                        <div className="relative">
                                            <img
                                                src={logoPreview}
                                                alt="Company Logo"
                                                className="w-20 h-20 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeLogo}
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
                                name="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData("date", e.target.value)
                                }
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            />
                            {errors.date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.date}
                                </p>
                            )}
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
                                name="due_date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                                required
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {errors.due_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.due_date}
                                </p>
                            )}
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
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        placeholder="Customer Name"
                                        required
                                    />
                                    {errors.customer?.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.customer.name}
                                        </p>
                                    )}
                                </div>

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
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        placeholder="Customer Email"
                                    />
                                    {errors.customer?.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.customer.email}
                                        </p>
                                    )}
                                </div>

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
                                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        placeholder="Customer Address"
                                    />
                                    {errors.customer?.address && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.customer.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-gray-100">
                                Items
                            </h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 transition focus:outline-none"
                            >
                                <FiPlus />
                                Add Item
                            </button>
                        </div>
                        {data.invoice_items.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="flex gap-4 mb-3 items-center"
                            >
                                <div className="flex-1">
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
                                        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                    {errors[
                                        `invoice_items.${index}.description`
                                    ] && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors[
                                                    `invoice_items.${index}.description`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={Number(item.quantity)}
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
                                    {errors[
                                        `invoice_items.${index}.quantity`
                                    ] && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors[
                                                    `invoice_items.${index}.quantity`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formatNumber(item.unit_price)}
                                        onChange={(e) =>
                                            handleItemChange(
                                                item.id,
                                                "unit_price",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Unit Price"
                                        className="w-24 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                    {errors[
                                        `invoice_items.${index}.unit_price`
                                    ] && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors[
                                                    `invoice_items.${index}.unit_price`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 cursor-pointer focus:outline-none"
                                    aria-label="Remove item"
                                    type="button"
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
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    {/* Discount, Tax and currency */}
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
                                    min="0"
                                    max="100"
                                    value={taxRate || ""}
                                    onChange={(e) =>
                                        setTaxRate(Number(e.target.value))
                                    }
                                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    %
                                </span>
                            </div>
                            {errors.tax_rate && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.tax_rate}
                                </p>
                            )}
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
                                    min="0"
                                    max="100"
                                    value={discount || ""}
                                    onChange={(e) =>
                                        setDiscount(Number(e.target.value))
                                    }
                                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    %
                                </span>
                            </div>
                            {errors.discount && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.discount}
                                </p>
                            )}
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
                            {errors.currency && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.currency}
                                </p>
                            )}
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
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
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
                                {taxAmount.toFixed(2)} {currency}
                            </span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-800 dark:text-gray-100">
                            <span>Discount ({discount}%):</span>
                            <span>
                                -{discountAmount.toFixed(2)} {currency}
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
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Update Invoice"}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                window.open(
                                    route("invoices.show", invoice.id),
                                    "_blank"
                                )
                            }
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition focus:outline-none"
                        >
                            Print Invoice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditInvoice;
