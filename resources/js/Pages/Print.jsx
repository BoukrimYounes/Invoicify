import React from "react";
import { usePage } from "@inertiajs/react";

export default function Print({ invoice }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Calculate totals
    const subtotal = invoice.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
    );
    const taxAmount = (subtotal * invoice.tax_rate) / 100;
    const discountAmount = (subtotal * invoice.discount) / 100;
    const total = subtotal + taxAmount - discountAmount;

    // Print the page when it loads
    React.useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white print:p-0 relative min-h-screen">
            {/* Invoice Content */}
            <div className="invoice-print">
                {/* Header with Company Logo */}
                <div className="flex justify-between items-start mb-8 border-b-2 border-blue-100 pb-6 print:border-b-0">
                    <div className="flex items-center">
                        {/* Company Logo */}
                        {user.logo && (
                            <div className="mr-4">
                                <img
                                    src={`/storage/${user.logo}`}
                                    alt="Company Logo"
                                    className="h-20 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-blue-800">{user.name}</h1>
                            <p className="text-sm text-gray-600">{user.address}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-blue-600 mb-2">
                            INVOICE
                        </h2>
                        <div className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                            <p className="flex justify-between">
                                <span className="font-medium">Number:</span>
                                <span className="font-semibold">{invoice.number}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium">Date:</span>
                                <span>{invoice.date}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium">Due Date:</span>
                                <span>{invoice.due_date}</span>
                            </p>
                            <p className="flex justify-between items-center mt-1">
                                <span className="font-medium">Status:</span>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                        invoice.status === "Paid"
                                            ? "bg-green-100 text-green-800"
                                            : invoice.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {invoice.status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-bold text-blue-700 mb-2 border-b border-blue-200 pb-1">
                            Bill From
                        </h3>
                        <div className="text-gray-700">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm">{user.address}</p>
                            <p className="text-sm">{user.email}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                            Bill To
                        </h3>
                        <div className="text-gray-700">
                            <p className="font-medium">{invoice.customer.name}</p>
                            <p className="text-sm">{invoice.customer.address}</p>
                            <p className="text-sm">{invoice.customer.email}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="py-3 px-4 text-left border border-blue-700 rounded-tl-lg">
                                    Description
                                </th>
                                <th className="py-3 px-4 text-right border border-blue-700">
                                    Qty
                                </th>
                                <th className="py-3 px-4 text-right border border-blue-700">
                                    Unit Price
                                </th>
                                <th className="py-3 px-4 text-right border border-blue-700 rounded-tr-lg">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} text-gray-800`}
                                >
                                    <td className="py-3 px-4 border border-gray-200">
                                        {item.description}
                                    </td>
                                    <td className="py-3 px-4 text-right border border-gray-200">
                                        {item.quantity}
                                    </td>
                                    <td className="py-3 px-4 text-right border border-gray-200">
                                        {item.unit_price} {invoice.currency}
                                    </td>
                                    <td className="py-3 px-4 text-right border border-gray-200 font-medium">
                                        {(item.quantity * item.unit_price).toFixed(2)} {invoice.currency}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="ml-auto w-60">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex justify-between py-2 border-b border-blue-200">
                            <span className="text-gray-700">Subtotal:</span>
                            <span className="font-medium">
                                {subtotal.toFixed(2)} {invoice.currency}
                            </span>
                        </div>

                        {invoice.tax_rate > 0 && (
                            <div className="flex justify-between py-2 border-b border-blue-200">
                                <span className="text-gray-700">Tax ({invoice.tax_rate}%):</span>
                                <span className="font-medium">
                                    {taxAmount.toFixed(2)} {invoice.currency}
                                </span>
                            </div>
                        )}

                        {invoice.discount > 0 && (
                            <div className="flex justify-between py-2 border-b border-blue-200">
                                <span className="text-gray-700">Discount ({invoice.discount}%):</span>
                                <span className="font-medium text-red-600">
                                    -{discountAmount.toFixed(2)} {invoice.currency}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between py-2 font-bold text-lg mt-2">
                            <span className="text-blue-800">Total:</span>
                            <span className="text-blue-800">
                                {total.toFixed(2)} {invoice.currency}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <h4 className="font-bold text-blue-700 mb-2">Notes</h4>
                        <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-lg">
                            {invoice.notes}
                        </p>
                    </div>
                )}

            </div>

            {/* App Logo and Text at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 text-center py-4 border-t border-gray-200 bg-blue-50 print:bg-transparent">
                <div className="flex items-center justify-center space-x-2">
                    <img
                        className="h-6 object-contain"
                        src="/storage/icon.png"
                        alt="Invoicify Logo"
                    />
                    <span className="text-xs text-gray-600">
                        Free invoice creator - <span className="text-blue-600">invoicify.com</span>
                    </span>
                </div>
            </div>

            {/* Print-specific styles */}
            <style jsx>{`
                @media print {
                    body {
                        background: white !important;
                        font-size: 12pt;
                    }
                    .invoice-print {
                        padding: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    table {
                        page-break-inside: auto;
                    }
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    img {
                        max-height: 80px !important;
                        width: auto !important;
                    }
                    /* Ensure footer stays at bottom */
                    .min-h-screen {
                        min-height: 100vh;
                    }
                    /* Bottom logo styling */
                    .absolute {
                        position: absolute;
                    }
                    .bottom-0 {
                        bottom: 0;
                    }
                    /* Colors for printing */
                    .bg-blue-50, .bg-gray-50 {
                        background-color: rgba(239, 246, 255, 0.8) !important;
                    }
                    .text-blue-600, .text-blue-700, .text-blue-800 {
                        color: #2563eb !important;
                    }
                }
            `}</style>
        </div>
    );
}