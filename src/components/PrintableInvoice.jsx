import React from "react";

const PrintableInvoice = ({
  invoiceData,
  currency,
  taxRate,
  discount,
  subtotal,
  total,
}) => {
  return (
    <div className="p-8 bg-white text-gray-800">
      {/* Invoice Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Invoice</h1>
        <p className="text-sm text-gray-600">
          Invoice Number: {invoiceData.invoiceNumber}
        </p>
      </div>

      {/* Bill From and Bill To */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Bill From</h2>
          <p>{invoiceData.billFrom.name}</p>
          <p>{invoiceData.billFrom.email}</p>
          <p>{invoiceData.billFrom.address}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Bill To</h2>
          <p>{invoiceData.billTo.name}</p>
          <p>{invoiceData.billTo.email}</p>
          <p>{invoiceData.billTo.address}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
        <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-2">
          <div>Description</div>
          <div>Quantity</div>
          <div>Price</div>
          <div>Total</div>
        </div>
        {invoiceData.items.map((item) => (
          <div key={item.id} className="grid grid-cols-4 gap-4 border-b py-2">
            <div>{item.description}</div>
            <div>{item.quantity}</div>
            <div>
              {item.price.toFixed(2)} {currency}
            </div>
            <div>
              {(item.quantity * item.price).toFixed(2)} {currency}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-right">
        <p className="mb-2">
          <span className="font-semibold">Subtotal:</span> {subtotal.toFixed(2)}{" "}
          {currency}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Tax ({taxRate}%):</span>{" "}
          {((subtotal * taxRate) / 100).toFixed(2)} {currency}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Discount ({discount}%):</span> -
          {((subtotal * discount) / 100).toFixed(2)} {currency}
        </p>
        <p className="text-xl font-bold">
          <span className="font-semibold">Total:</span> {total.toFixed(2)}{" "}
          {currency}
        </p>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p>{invoiceData.notes}</p>
        </div>
      )}
    </div>
  );
};

export default PrintableInvoice;
