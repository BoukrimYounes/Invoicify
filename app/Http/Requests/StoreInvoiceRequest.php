<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        
    return [
        'number' => 'required|string|unique:invoices',
        'date' => 'required|date',
        'due_date' => 'required|date',
        'discount' => 'required|numeric',
        'currency' => 'required|string|size:3',
        'tax_rate' => 'required|numeric',
        'status' => 'required|string',
        'subtotal' => 'required|numeric',
        'total' => 'required|numeric',
        'notes' => 'nullable|string',
        'invoice_items' => 'required|array|min:1',
        'invoice_items.*.description' => 'required|string',
        'invoice_items.*.quantity' => 'required|integer|min:1',
        'invoice_items.*.price' => 'required|numeric|min:0',
        'customer.name' => 'required|string',
        'customer.email' => 'required|email',
        'customer.address' => 'required|string',
    ];
}
}