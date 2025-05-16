import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Print({ invoice }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Calculate totals
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const taxAmount = (subtotal * invoice.tax_rate) / 100;
    const discountAmount = (subtotal * invoice.discount) / 100;
    const total = subtotal + taxAmount - discountAmount;

    // Print the page when it loads
    React.useEffect(() => {
        window.print();
    }, []);
    console.groupCollapsed(user.logo)
   
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white print:p-0">
            {/* Invoice Content */}
            <div className="invoice-print">
                {/* Header with Logo */}
                <div className="flex justify-between items-start mb-8 border-b pb-6 print:border-b-0">
                    <div className="flex items-center">
                        {/* Company Logo */}
                        {user.logo && (
                            <div className="mr-4">
                                <img 
                                    src={`/storage/${user.logo}`}
                                    alt="Company Logo"
                                    className="h-16 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none'; // Hide if image fails to load
                                    }}
                                />
                            </div>
                        )}
                       
                    </div>
                    
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
                        <div className="text-gray-700">
                            <p><strong>Number:</strong> {invoice.number}</p>
                            <p><strong>Date:</strong> {invoice.date}</p>
                            <p><strong>Due Date:</strong> {invoice.due_date}</p>
                            <p>
                                <strong>Status:</strong> 
                                <span className={`px-2 py-1 ml-2 text-xs rounded-full ${
                                    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {invoice.status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-gray-800 mb-2">Bill From</h3>
                        <div className="text-gray-700">
                            <p>{user.name}</p>
                            <p>{user.address}</p>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-gray-800 mb-2">Bill To</h3>
                        <div className="text-gray-700">
                            <p>{invoice.customer.name}</p>
                            <p>{invoice.customer.address}</p>
                            <p>{invoice.customer.email}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-black">
                                <th className="py-2 px-4 text-left border">Description</th>
                                <th className="py-2 px-4 text-right border">Qty</th>
                                <th className="py-2 px-4 text-right border">Unit Price</th>
                                <th className="py-2 px-4 text-right border">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index} className={ 'bg-white text-black' }>
                                    <td className="py-2 px-4 border">{item.description}</td>
                                    <td className="py-2 px-4 text-right border">{item.quantity}</td>
                                    <td className="py-2 px-4 text-right border">
                                        {item.unit_price} {invoice.currency}
                                    </td>
                                    <td className="py-2 px-4 text-right border">
                                        {(item.quantity * item.unit_price).toFixed(2)} {invoice.currency}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="ml-auto w-64 text-black">
                    <div className="flex justify-between py-2 border-b">
                        <span>Subtotal:</span>
                        <span>{subtotal.toFixed(2)} {invoice.currency}</span>
                    </div>
                    
                    {invoice.tax_rate > 0 && (
                        <div className="flex justify-between py-2 border-b">
                            <span>Tax ({invoice.tax_rate}%):</span>
                            <span>{taxAmount.toFixed(2)} {invoice.currency}</span>
                        </div>
                    )}
                    
                    {invoice.discount > 0 && (
                        <div className="flex justify-between py-2 border-b">
                            <span>Discount ({invoice.discount}%):</span>
                            <span>-{discountAmount.toFixed(2)} {invoice.currency}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-between py-2 font-bold text-lg">
                        <span>Total:</span>
                        <span>{total.toFixed(2)} {invoice.currency}</span>
                    </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div className="mt-8 pt-4 border-t">
                        <h4 className="font-bold text-gray-800 mb-2">Notes</h4>
                        <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-4 border-t text-center text-sm text-gray-500">
                    <p>Thank you for your business!</p>
                    <p>Please make payment by {invoice.due_date}</p>
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
                }
            `}</style>
        </div>
    );
}