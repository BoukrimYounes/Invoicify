import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiSave, FiX, FiUpload } from "react-icons/fi";

function NewInvoice() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("MAD");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Currencies
  const currencies = [
    { code: "MAD", name: "Moroccan Dirham" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "BTC", name: "Bitcoin" }, // Added Bitcoin
  ];

  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // day + hour + min + sec + ms
      .toISOString()
      .split("T")[0],
    notes: "",
    billFrom: {
      name: "",
      email: "",
      address: "",
      logo: null,
    },
    billTo: {
      name: "",
      email: "",
      address: "",
    },
    items: [
      {
        id: Date.now().toString().slice(-4),
        description: "",
        quantity: 1,
        price: 0,
      },
    ],
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
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          billFrom: { ...prev.billFrom, logo: e.target.result },
        }));
      };
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

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Add currency, taxRate, and discount to the form data
    const invoiceData = {
      ...formData,
      currency,
      taxRate,
      discount,
      subtotal,
      total,
    };

    // Log the form data (or send it to an API)
    console.log(
      "data of invoice                                                  " +
        JSON.stringify(invoiceData)
    );

    // Optionally, navigate to another page after submission
    navigate("/home"); // Redirect to the invoices page
  };

  // Add/remove items
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString().slice(-4),
          description: "",
          quantity: 1,
          price: 0,
        },
      ],
    }));
  };

  const removeItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // const handlePrint = () => {
  //   const invoiceData = {
  //     ...formData,
  //     currency: currency, // default fallback
  //     taxRate: taxRate,
  //     discount: discount,
  //     subtotal: subtotal,
  //     total: total,
  //     date: formData.date,
  //     dueDate: formData.dueDate,
  //   };

  //   const printWindow = window.open("", "_blank");
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Invoice - ${invoiceData.invoiceNumber}</title>
  //         <style>
  //           :root {
  //             --primary-color: #2d3748;
  //             --secondary-color: #4a5568;
  //             --accent-color: #48bb78;
  //             --border-color: #e2e8f0;
  //           }

  //           body {
  //             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  //             margin: 1.5cm auto;
  //             max-width: 1000px;
  //             color: var(--primary-color);
  //           }

  //           .invoice-container {
  //             padding: 2rem;
  //             background: white;
  //             box-shadow: 0 0 20px rgba(0,0,0,0.1);
  //             border-radius: 8px;
  //           }

  //           .header {
  //             display: flex;
  //             justify-content: space-between;
  //             margin-bottom: 2rem;
  //             padding-bottom: 2rem;
  //             border-bottom: 2px solid var(--accent-color);
  //           }

  //           .company-info {
  //             text-align: right;
  //             h1 { color: var(--accent-color); margin: 0; }
  //             p { margin: 0.25rem 0; }
  //           }

  //           .logo {
  //             max-width: 180px;
  //             max-height: 100px;
  //           }

  //           .details-grid {
  //             display: grid;
  //             grid-template-columns: repeat(3, 1fr);
  //             gap: 2rem;
  //             margin: 2rem 0;
  //             background: #f8fafc;
  //             padding: 1.5rem;
  //             border-radius: 6px;
  //           }

  //           .detail-item strong {
  //             display: block;
  //             color: var(--secondary-color);
  //             margin-bottom: 0.5rem;
  //           }

  //           .items-table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             margin: 2rem 0;
  //           }

  //           .items-table th {
  //             background: var(--primary-color);
  //             color: white;
  //             padding: 1rem;
  //             text-align: left;
  //           }

  //           .items-table td {
  //             padding: 1rem;
  //             border-bottom: 1px solid var(--border-color);
  //           }

  //           .items-table tr:nth-child(even) {
  //             background: #f8fafc;
  //           }

  //           .summary-box {
  //             background: #f0fff4;
  //             padding: 1.5rem;
  //             border-radius: 6px;
  //             border: 1px solid var(--accent-color);
  //             margin: 2rem 0;
  //             float: right;
  //             width: 300px;
  //           }

  //           .summary-item {
  //             display: flex;
  //             justify-content: space-between;
  //             margin: 0.5rem 0;
  //           }

  //           .total-amount {
  //             font-size: 1.5rem;
  //             color: var(--accent-color);
  //             font-weight: bold;
  //           }

  //           .notes-section {
  //             margin-top: 3rem;
  //             padding-top: 2rem;
  //             border-top: 2px solid var(--border-color);
  //           }

  //           @media print {
  //             body {
  //               margin: 0.5cm;
  //               box-shadow: none;
  //             }
  //             .invoice-container {
  //               padding: 0;
  //             }
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="invoice-container">
  //           <div class="header">
  //             <div>
  //               ${
  //                 formData.billFrom.logo
  //                   ? `<img src="${formData.billFrom.logo}" class="logo" alt="Company Logo">`
  //                   : '<div class="logo-placeholder" style="font-size: 1.5rem; color: var(--accent-color);">[Company Logo]</div>'
  //               }
  //             </div>
  //             <div class="company-info">
  //               <h1>INVOICE</h1>
  //               <p>${invoiceData.billFrom.name}</p>
  //               <p>${invoiceData.billFrom.address}</p>
  //               <p>${invoiceData.billFrom.email}</p>
  //             </div>
  //           </div>

  //           <div class="details-grid">
  //             <div class="detail-item">
  //               <strong>Invoice Number</strong>
  //               ${invoiceData.invoiceNumber}
  //             </div>
  //             <div class="detail-item">
  //               <strong>Invoice Date</strong>
  //               ${invoiceData.invoiceDate}
  //             </div>
  //             <div class="detail-item">
  //               <strong>Due Date</strong>
  //               ${invoiceData.dueDate}
  //             </div>
  //           </div>

  //           <div class="billing-section">
  //             <div style="display: flex; justify-content: space-between; gap: 2rem;">
  //               <div style="flex: 1;">
  //                 <h3 style="color: var(--accent-color); margin-top: 0;">Bill From:</h3>
  //                 <p>${invoiceData.billFrom.name}</p>
  //                 <p>${invoiceData.billFrom.address}</p>
  //                 <p>${invoiceData.billFrom.email}</p>
  //               </div>
  //               <div style="flex: 1;">
  //                 <h3 style="color: var(--accent-color); margin-top: 0;">Bill To:</h3>
  //                 <p>${invoiceData.billTo.name}</p>
  //                 <p>${invoiceData.billTo.address}</p>
  //                 <p>${invoiceData.billTo.email}</p>
  //               </div>
  //             </div>
  //           </div>

  //       <table class="items-table">
  //         <thead>
  //           <tr>
  //             <th style="padding: 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: var(--accent-color)">Item</th>
  //             <th style="padding: 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: right; color: var(--accent-color)">Qty</th>
  //             <th style="padding: 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: right; color: var(--accent-color)">Unit Price</th>
  //             <th style="padding: 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: right; color: var(--accent-color)">Total</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${(invoiceData?.items || [])
  //             .map(
  //               (item, index) => `
  //             <tr key="${index}">
  //               <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;${
  //                 index === invoiceData.items.length - 1
  //                   ? " border-bottom: none;"
  //                   : ""
  //               }">
  //                 ${item.description || "—"}
  //               </td>
  //               <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;${
  //                 index === invoiceData.items.length - 1
  //                   ? " border-bottom: none;"
  //                   : ""
  //               }">
  //                 ${Number(item.quantity).toFixed(0)}
  //               </td>
  //               <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;${
  //                 index === invoiceData.items.length - 1
  //                   ? " border-bottom: none;"
  //                   : ""
  //               }">
  //                 ${Number(item.price).toFixed(2)} ${invoiceData.currency}
  //               </td>
  //               <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;${
  //                 index === invoiceData.items.length - 1
  //                   ? " border-bottom: none;"
  //                   : ""
  //               }">
  //                 ${(Number(item.quantity) * Number(item.price)).toFixed(2)} ${
  //                 invoiceData.currency
  //               }
  //               </td>
  //             </tr>
  //           `
  //             )
  //             .join("")}
  //           ${
  //             invoiceData?.items?.length === 0
  //               ? `
  //             <tr>
  //               <td colspan="4" style="padding: 24px; text-align: center; color: #94a3b8;">
  //                 No items added
  //               </td>
  //             </tr>
  //           `
  //               : ""
  //           }
  //        </tbody>
  //       </table>

  //           <div class="summary-box">
  //             <div class="summary-item">
  //               <span>Subtotal:</span>
  //               <span>${subtotal.toFixed(2)} ${currency}</span>
  //             </div>
  //             <div class="summary-item">
  //               <span>Tax (${taxRate}%):</span>
  //               <span>${((subtotal * taxRate) / 100).toFixed(
  //                 2
  //               )} ${currency}</span>
  //             </div>
  //             <div class="summary-item">
  //               <span>Discount (${discount}%):</span>
  //               <span>-${((subtotal * discount) / 100).toFixed(
  //                 2
  //               )} ${currency}</span>
  //             </div>
  //             <div class="summary-item total-amount">
  //               <span>Total:</span>
  //               <span>${total.toFixed(2)} ${currency}</span>
  //             </div>
  //           </div>

  //           ${
  //             invoiceData.notes
  //               ? `
  //             <div class="notes-section">
  //               <h3 style="color: var(--accent-color); margin-top: 0;">Notes</h3>
  //               <p>${invoiceData.notes}</p>
  //             </div>
  //           `
  //               : ""
  //           }

  //           <div style="margin-top: 3rem; text-align: center; color: var(--secondary-color); font-size: 0.9rem;">
  //             <p>Thank you for your business! • Payment due within ${
  //               invoiceData.dueDate
  //             } days</p>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `);

  //   printWindow.document.close();
  //   setTimeout(() => {
  //     printWindow.print();
  //   }, 1000);
  // };

  const handlePrint = () => {
    const invoiceData = {
      ...formData,
      currency: currency || "MAD",
      taxRate: taxRate || 0,
      discount: discount || 0,
      subtotal: subtotal || 0,
      total: total || 0,
      date: formData.invoiceDate || new Date().toLocaleDateString(),
      dueDate:
        formData.dueDate ||
        new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
    };

    const htmlContent = `<html>
      <head>
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          /* Single Page Invoice Style */
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0.5cm auto;
            max-width: 800px;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
          }

          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #4a5568;
          }

          .logo-column {
            max-width: 150px;
          }

          .logo {
            max-width: 120px;
            max-height: 60px;
          }

          .invoice-meta {
            text-align: right;
          }

          .invoice-id {
            font-size: 1.2rem;
            font-weight: bold;
            color: #2d3748;
          }

          .billing-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
          }

          .billing-box {
            padding: 0.8rem;
            background: #f8fafc;
            border-radius: 4px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }

          .items-table th {
            background: #2d3748;
            color: white;
            padding: 0.6rem;
            font-weight: normal;
          }

          .items-table td {
            padding: 0.6rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .text-right {
            text-align: right;
          }

          .total-section {
            margin: 1rem 0;
            padding: 0.8rem;
            background: #f8fafc;
            border-radius: 4px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 0.3rem 0;
          }

          .grand-total {
            font-weight: bold;
            color: #2d3748;
          }

          .notes {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
          }

          @media print {
            body { 
              margin: 0.5cm;
              font-size: 12px;
            }
            .items-table td {
              padding: 0.4rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="logo-column">
            ${
              invoiceData.billFrom.logo
                ? `<img src="${invoiceData.billFrom.logo}" class="logo" alt="Logo">`
                : `<div class="invoice-id">${
                    invoiceData.billFrom.name || "Company"
                  }</div>`
            }
          </div>
          <div class="invoice-meta">
            <div class="invoice-id">INVOICE #${invoiceData.invoiceNumber}</div>
            <div>Date: ${invoiceData.date}</div>
            <div>Due: ${invoiceData.dueDate}</div>
          </div>
        </div>

        <div class="billing-grid">
          <div class="billing-box">
            <strong>From:</strong><br>
            ${invoiceData.billFrom.name || ""}<br>
            ${invoiceData.billFrom.address || ""}<br>
            ${invoiceData.billFrom.email || ""}
          </div>
          <div class="billing-box">
            <strong>To:</strong><br>
            ${invoiceData.billTo.name || ""}<br>
            ${invoiceData.billTo.address || ""}<br>
            ${invoiceData.billTo.email || ""}
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${(invoiceData.items || [])
              .map(
                (item) => `
              <tr>
                <td>${item.description || "Item"}</td>
                <td class="text-right">${Number(item.quantity).toFixed(0)}</td>
                <td class="text-right">${Number(item.price).toFixed(2)} ${
                  invoiceData.currency
                }</td>
                <td class="text-right">${(item.quantity * item.price).toFixed(
                  2
                )} ${invoiceData.currency}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)} ${invoiceData.currency}</span>
          </div>
          ${
            taxRate > 0
              ? `
            <div class="total-row">
              <span>Tax (${taxRate}%):</span>
              <span>${((subtotal * taxRate) / 100).toFixed(2)} ${
                  invoiceData.currency
                }</span>
            </div>
          `
              : ""
          }
          ${
            discount > 0
              ? `
            <div class="total-row">
              <span>Discount (${discount}%):</span>
              <span>-${((subtotal * discount) / 100).toFixed(2)} ${
                  invoiceData.currency
                }</span>
            </div>
          `
              : ""
          }
          <div class="total-row grand-total">
            <span>Total Due:</span>
            <span>${total.toFixed(2)} ${invoiceData.currency}</span>
          </div>
        </div>

        ${
          invoiceData.notes
            ? `
          <div class="notes">
            <strong>Notes:</strong><br>
            ${invoiceData.notes}
          </div>
        `
            : ""
        }

        <div style="text-align: center; margin-top: 1rem; font-size: 11px; color: #718096;">
          Thank you for your business! Please make payment by the ${
            invoiceData.dueDate
          }
        </div>
      </body>
    </html>`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
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
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
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
                type="button"
                onClick={addItem}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 transition focus:outline-none"
              >
                <FiPlus />
                Add Item
              </button>
            </div>
            {formData.items.map((item) => (
              <div key={item.id} className="flex gap-4 mb-3 items-center">
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
                  className="w-24 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(item.id, "price", e.target.value)
                  }
                  placeholder="Price"
                  min="0"
                  className="w-24 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Additional notes for the invoice"
            />
          </div>

          {/* Disc and Tax and currency */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
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
                  value={taxRate}
                  onChange={(e) =>
                    setTaxRate(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  min="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  %
                </span>
              </div>
            </div>
            <div>
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
                  value={discount}
                  onChange={(e) =>
                    setDiscount(Math.max(0, Number(e.target.value)))
                  }
                  className=" w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  min="0"
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
            <button
              type="button"
              onClick={handlePrint}
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

// Reusable Address Component
const AddressSection = ({ data, onChange }) => (
  <div className="space-y-2">
    <input
      value={data.name}
      onChange={(e) => onChange("name", e.target.value)}
      placeholder="Name"
      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 required:"
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
